"""A compact, downloadable portfolio of the eight self-initiated concepts."""
from pathlib import Path
from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from reportlab.lib.colors import HexColor
BASE=Path(__file__).resolve().parents[1]
OUTPUT=BASE/'assets/shayan-portfolio.pdf'
W,H=960,680
c=canvas.Canvas(str(OUTPUT),pagesize=(W,H))
c.setTitle('Shayan - Selected Design Concepts 2026')
c.setAuthor('Shayan')
projects=[('Oud Noir','Fragrance campaign','oud-leaves'),('Noor Atelier','Fashion and social campaign','noor-editorial'),('Rise Above','Sneaker campaign','sneaker-type'),('The Creator Edition','Creator Story templates','creator-duo'),('Studio Notes','Visual identity study','brand-notes'),('A Fresh Expression','Web and social campaign','oud-banner'),('The Campaign Review','Presentation concept - demonstration metrics','campaign-deck'),('Noir Objects','Packaging concept','oud-packaging')]
def base(num):
    c.setFillColor(HexColor('#F4EFE8')); c.rect(0,0,W,H,fill=1,stroke=0)
    c.setFillColor(HexColor('#111111')); c.setFont('Helvetica',9)
    c.drawString(45,638,'SHAYAN / GRAPHIC DESIGNER')
    c.drawRightString(915,638,'SELECTED CONCEPTS / 2026')
    c.setStrokeColor(HexColor('#C8A45D')); c.setLineWidth(.5); c.line(45,622,915,622)
    c.setFont('Helvetica',8); c.drawString(45,25,'Karachi, Pakistan | faisalshayan444@gmail.com'); c.drawRightString(915,25,f'{num:02d} / 09')
base(1)
c.setFont('Times-Roman',87); c.drawString(45,442,'A portfolio,')
c.setFont('Times-Italic',87); c.drawString(45,347,'on repeat.')
c.setFont('Helvetica',17); c.drawString(49,255,'Brand identity. Social campaigns. Considered images.')
c.setFont('Helvetica',12); c.drawString(49,192,'Independent creative practice by Shayan, based in Karachi and working worldwide.')
c.setFillColor(HexColor('#635D57')); c.setFont('Helvetica',10)
c.drawString(49,140,'Eight self-initiated design concepts, including AI-assisted campaign imagery.')
c.drawString(49,122,'Brand names are creative concepts; sample performance figures are demonstration content.')
c.linkURL('mailto:faisalshayan444@gmail.com',(45,15,410,40))
c.showPage()
for i,(title,category,image) in enumerate(projects,2):
    base(i)
    c.setFont('Times-Roman',39); c.drawString(45,563,title)
    c.setFont('Helvetica',10); c.drawString(47,537,category+' / Independent concept')
    im=Image.open(BASE/f'assets/work/{image}.webp').convert('RGB')
    max_w,max_h=870,450; scale=min(max_w/im.width,max_h/im.height)
    iw,ih=im.width*scale,im.height*scale
    c.drawImage(ImageReader(im),45+(870-iw)/2,65+(450-ih)/2,width=iw,height=ih)
    c.showPage()
c.save()
print(f'Created {OUTPUT} ({OUTPUT.stat().st_size:,} bytes).')
