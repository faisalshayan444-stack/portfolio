"""Prepare locally generated campaign artwork for a buildless static portfolio."""
from pathlib import Path
from PIL import Image, ImageOps
import json

BASE = Path(__file__).resolve().parents[1]
SOURCE = Path(r'C:\Users\sabaf\.codex\generated_images\01a179e6-a3a6-7f12-a508-de33582b32cc')
WORK = BASE / 'assets/work'
IMAGES = BASE / 'assets/images'
WORK.mkdir(parents=True, exist_ok=True)
IMAGES.mkdir(parents=True, exist_ok=True)
mapping = {
 'oud-leaves':'65e8c9c4-cd6f-4071-bf5f-f44258809b29',
 'oud-crown':'f821af9f-b180-45a7-9b2b-c2e37e1d46a2',
 'oud-heritage':'299d3159-5af2-45f1-8adf-b1249465c364',
 'oud-packaging':'4e797787-01c7-4f54-8884-754e6aa8be2c',
 'noor-editorial':'7de7b88b-be90-45b6-9c8f-935716b5eca1',
 'noor-eid':'6e11eebb-47e8-4702-aa30-3a9ddd7ac987',
 'noor-outdoor':'8c4758bc-8b76-4e92-9ff6-0d2cbf7f9d1b',
 'noor-classic':'689d7ddc-7ae0-49c9-98ab-2474a22a90b5',
 'sneaker-type':'17c44fcf-fbb8-4408-a673-6f88e257c2bc',
 'sneaker-clean':'7a80a656-65f6-4ea4-b380-e51479d923c1',
 'creator-noor':'da929455-5b8f-42f0-b5ff-00210e7f7d57',
 'creator-oud':'e5fadc46-da3a-4091-81f6-51c0107e0587',
 'oud-tropical':'065889b0-63e4-4618-a41e-c023f3c229a9',
 'oud-banner':'43f1d9ba-f968-4e03-b329-4cbd6de30b30',
 'oud-fresh-type':'a2c727b9-c22d-470d-9368-c5503395268d',
 'oud-sky':'037e57a5-581c-4a5d-b98b-4b8de80b44fd',
 'campaign-deck':'cc0477cb-9198-4e10-b9f8-2b9834aaf64b',
}
sizes = {}
for name, ident in mapping.items():
    image = Image.open(SOURCE / f'exec-{ident}.png').convert('RGB')
    image.thumbnail((1440,1800), Image.Resampling.LANCZOS)
    image.save(WORK / f'{name}.webp', quality=86, method=6)
    sizes[name] = list(image.size)
for source, target, box in [('sneaker-clean','sneaker-detail',(.15,.34,.92,.75)),('oud-packaging','packaging-detail',(.12,.24,.88,.87)),('campaign-deck','deck-detail',(.025,.2,.97,.59))]:
    image = Image.open(WORK / f'{source}.webp')
    w,h = image.size
    image = image.crop(tuple(round(v*d) for v,d in zip(box,(w,h,w,h))))
    image.save(WORK / f'{target}.webp',quality=88,method=6)
    sizes[target] = list(image.size)
# Pair the two finished templates as an editorial spread.
spread = Image.new('RGB',(1440,1080),'#dfd5c7')
for name, x in [('creator-noor',210),('creator-oud',790)]:
    image=Image.open(WORK/f'{name}.webp'); image.thumbnail((450,900),Image.Resampling.LANCZOS)
    spread.paste(image,(x,(1080-image.height)//2))
spread.save(WORK/'creator-duo.webp',quality=88,method=6)
sizes['creator-duo']=[1440,1080]
social=Image.open(WORK/'oud-banner.webp'); social=ImageOps.fit(social,(1200,630)); social.save(IMAGES/'social-cover.jpg',quality=88)
(WORK/'image-sizes.json').write_text(json.dumps(sizes,indent=2))
print(f'Prepared {len(sizes)} campaign images.')
