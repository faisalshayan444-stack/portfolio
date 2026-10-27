"""Convert the licensed script font into filled glyphs and pen-centre masks.

Run with Pillow, NumPy and fontTools; the delivered site needs none of these.
"""
from pathlib import Path
import sys, json, math
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'tmp/fonttools'))
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.transformPen import TransformPen

WORD='Portfolio'
FONT=ROOT/'assets/fonts/PinyonScript-Regular.ttf'
tt=TTFont(FONT); glyphs=tt.getGlyphSet(); cmap=tt.getBestCmap()
upm=tt['head'].unitsPerEm
font=ImageFont.truetype(str(FONT),upm)
scale=.35; pad=8
render_font=ImageFont.truetype(str(FONT),round(upm*scale))

def neighbours(a):
    return [np.roll(a,1,0),np.roll(np.roll(a,1,0),-1,1),np.roll(a,-1,1),np.roll(np.roll(a,-1,0),-1,1),np.roll(a,-1,0),np.roll(np.roll(a,-1,0),1,1),np.roll(a,1,1),np.roll(np.roll(a,1,0),1,1)]

def thin(binary):
    a=binary.copy()
    while True:
        changed=0
        for step in (0,1):
            p=neighbours(a); count=np.sum(p,axis=0)
            turns=np.sum([~p[i]&p[(i+1)%8] for i in range(8)],axis=0)
            triplets=(p[0]&p[2]&p[4],p[2]&p[4]&p[6]) if step==0 else (p[0]&p[2]&p[6],p[0]&p[4]&p[6])
            remove=a&(count>=2)&(count<=6)&(turns==1)&~triplets[0]&~triplets[1]
            changed+=int(remove.sum()); a[remove]=False
        if not changed:return a

def radius(binary):
    a=binary.copy(); n=0
    while a.any():
        a=a&np.logical_and.reduce(neighbours(a)); n+=1
    return n

def trace(skeleton):
    pixels={(int(x),int(y)) for y,x in np.argwhere(skeleton)}
    graph={p:set() for p in pixels}
    for x,y in pixels:
        for dx,dy in [(-1,-1),(0,-1),(1,-1),(-1,0),(1,0),(-1,1),(0,1),(1,1)]:
            q=(x+dx,y+dy)
            if q not in pixels:continue
            if dx and dy and ((x+dx,y) in pixels or (x,y+dy) in pixels):continue
            graph[(x,y)].add(q)
    paths=[]
    singles=[p for p in pixels if not graph[p]]
    for p in singles:paths.append([p,(p[0]+.05,p[1]+.05)])
    while any(graph.values()):
        ends=[p for p,v in graph.items() if len(v)==1]
        start=min(ends or [p for p,v in graph.items() if v],key=lambda p:(p[0],-p[1]))
        points=[start]; current=start; previous=None
        while graph[current]:
            options=graph[current]
            if previous is None:
                target=min(options,key=lambda p:(p[1],p[0]))
            else:
                vx,vy=current[0]-previous[0],current[1]-previous[1]
                target=max(options,key=lambda p:((p[0]-current[0])*vx+(p[1]-current[1])*vy)/math.hypot(p[0]-current[0],p[1]-current[1]))
            graph[current].remove(target); graph[target].remove(current)
            points.append(target); previous,current=current,target
        if len(points)>1:paths.append(points)
    # Small detached dot strokes come after the main letter strokes.
    paths.sort(key=lambda p:(len(p)<5,min(v[0] for v in p)))
    return paths

def simplify(points, tolerance=4):
    """Keep the pen's curves with fewer control points for light animation."""
    if len(points)<3:return points
    ax,ay=points[0];bx,by=points[-1]
    dx,dy=bx-ax,by-ay; length=dx*dx+dy*dy
    distances=[]
    for x,y in points[1:-1]:
        t=max(0,min(1,((x-ax)*dx+(y-ay)*dy)/length)) if length else 0
        distances.append(math.hypot(x-ax-t*dx,y-ay-t*dy))
    farthest=max(distances)
    if farthest<=tolerance:return [points[0],points[-1]]
    at=distances.index(farthest)+1
    return simplify(points[:at+1],tolerance)[:-1]+simplify(points[at:],tolerance)

def smooth(points):
    # Pixel-derived centre lines become smooth quadratic pen trajectories.
    points=simplify(points)
    if len(points)<2:points=[points[0],(points[0][0]+.05,points[0][1]+.05)]
    d=f'M{points[0][0]:.2f},{points[0][1]:.2f}'
    for i in range(1,len(points)-1):
        x,y=points[i];nx,ny=points[i+1]
        d+=f'Q{x:.2f},{y:.2f} {(x+nx)/2:.2f},{(y+ny)/2:.2f}'
    d+=f'L{points[-1][0]:.2f},{points[-1][1]:.2f}'
    return d

masks=[]; letters=[]; bounds=[]; stroke_count=0
for i,char in enumerate(WORD):
    glyph=glyphs[cmap[ord(char)]]
    bp=BoundsPen(glyphs);glyph.draw(bp)
    xmin,ymin,xmax,ymax=bp.bounds
    advance=font.getlength(WORD[:i+1])-font.getlength(char)
    pen=SVGPathPen(glyphs);glyph.draw(TransformPen(pen,(1,0,0,-1,advance,0)))
    outline=pen.getCommands()
    bounds.append((advance+xmin,-ymax,advance+xmax,-ymin))
    w=math.ceil((xmax-xmin)*scale)+pad*2;h=math.ceil((ymax-ymin)*scale)+pad*2
    image=Image.new('L',(w,h));draw=ImageDraw.Draw(image)
    draw.text((pad-xmin*scale,pad+ymax*scale),char,font=render_font,anchor='ls',fill=255)
    binary=np.asarray(image)>100
    width=(radius(binary)*2+6)/scale
    paths=[]
    for line in trace(thin(binary)):
        mapped=[(advance+xmin+(x-pad)/scale,-ymax+(y-pad)/scale) for x,y in line]
        paths.append(f'<path class="signature-pen" d="{smooth(mapped)}" pathLength="1" fill="none" stroke="white" stroke-width="{width:.2f}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1" stroke-dashoffset="0"/>')
    stroke_count+=len(paths)
    masks.append(f'<mask id="signature-letter-{i}" maskUnits="userSpaceOnUse" x="-1000" y="-2000" width="8000" height="4000">'+''.join(paths)+'</mask>')
    letters.append(f'<g class="signature-letter" mask="url(#signature-letter-{i})"><path d="{outline}" fill="currentColor"/></g>')
xmin=min(b[0] for b in bounds)-25;ymin=min(b[1] for b in bounds)-25
xmax=max(b[2] for b in bounds)+25;ymax=max(b[3] for b in bounds)+25
svg=f'<svg class="signature-vector" xmlns="http://www.w3.org/2000/svg" viewBox="{xmin:.2f} {ymin:.2f} {xmax-xmin:.2f} {ymax-ymin:.2f}" aria-hidden="true" focusable="false"><defs>'+''.join(masks)+'</defs>'+''.join(letters)+'</svg>'
(ROOT/'assets/images/portfolio-signature.svg').write_text(svg,encoding='utf8')
(ROOT/'js/signature.js').write_text('// Generated from the licensed Pinyon Script font; see scripts/create-signature.py.\nexport const signatureMarkup = '+json.dumps(svg)+';\n',encoding='utf8')
print(f'Generated {len(WORD)} letters, {stroke_count} pen strokes; {len(svg):,} SVG characters.')
