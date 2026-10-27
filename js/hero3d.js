import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// EDIT HERE: record tint, rotational speed, mouse response, rendering budget.
const HERO = { color: '#F2A7C3', degreesPerSecond: 3, damping: .06, pixelRatio: 1.5, fps: 30 };
export function initHero() {
  const canvas = document.querySelector('#vinyl-canvas');
  const host = document.querySelector('.vinyl-stage');
  if (!canvas || !host || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' }); } catch { return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, HERO.pixelRatio));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = .85;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, .1, 30); camera.position.z = 5.8;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment(); const environment = pmrem.fromScene(room, .04);
  scene.environment = environment.texture; room.dispose(); pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x79605b, 1.2));
  const key = new THREE.DirectionalLight(0xfff6ef, 2); key.position.set(-3, 4, 5); scene.add(key);
  const fill = new THREE.DirectionalLight(0xffcddd, .5); fill.position.set(4, -2, 3); scene.add(fill);
  const group = new THREE.Group(); scene.add(group);
  const spinner = new THREE.Group(); group.add(spinner);
  // The bump map models hundreds of shallow grooves without heavy geometry.
  const grooveCanvas = document.createElement('canvas'); grooveCanvas.width = grooveCanvas.height = 2048;
  const ctx = grooveCanvas.getContext('2d'); ctx.fillStyle = '#888'; ctx.fillRect(0, 0, 2048, 2048);
  for (let r = 230; r < 1005; r += 3.4) { ctx.strokeStyle = `rgba(${r % 11 < 5 ? '35,35,35' : '210,210,210'},.55)`; ctx.lineWidth = r % 17 < 5 ? 1.8 : .8; ctx.beginPath(); ctx.arc(1024, 1024, r, 0, Math.PI * 2); ctx.stroke(); }
  const bump = new THREE.CanvasTexture(grooveCanvas); bump.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
  const surfaceCanvas = document.createElement('canvas'); surfaceCanvas.width = surfaceCanvas.height = 2048;
  const surface = surfaceCanvas.getContext('2d'); surface.fillStyle = HERO.color; surface.fillRect(0,0,2048,2048);
  for (let r=300;r<1020;r+=3.4) { surface.strokeStyle = r%13<5 ? 'rgba(145,40,93,.2)' : 'rgba(255,231,243,.3)'; surface.lineWidth = .8; surface.beginPath(); surface.arc(1024,1024,r,0,Math.PI*2); surface.stroke(); }
  const tint = new THREE.CanvasTexture(surfaceCanvas); tint.colorSpace = THREE.SRGBColorSpace;
  const vinylMaterial = new THREE.MeshPhysicalMaterial({ color: '#f6b0d0', map:tint, roughness: .32, metalness: .05, transmission: 0, thickness: .08, clearcoat: .6, clearcoatRoughness: .3, iridescence: .06, iridescenceIOR: 1.2, bumpMap: bump, bumpScale: .035, side: THREE.DoubleSide, envMapIntensity: .6 });
  const face = new THREE.Mesh(new THREE.RingGeometry(.053, 1.55, 160), vinylMaterial); spinner.add(face);
  const edge = new THREE.Mesh(new THREE.CylinderGeometry(1.55,1.55,.024,160,1,true),vinylMaterial);
  edge.rotation.x = Math.PI/2; edge.position.z = -.012; spinner.add(edge);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(1.545, .013, 8, 160), new THREE.MeshPhysicalMaterial({ color: HERO.color, roughness: .25, metalness: .15, clearcoat: 1 })); spinner.add(rim);
  const labelCanvas = document.createElement('canvas'); labelCanvas.width = labelCanvas.height = 512;
  const lc = labelCanvas.getContext('2d'); lc.fillStyle = '#272324'; lc.fillRect(0, 0, 512, 512);
  lc.strokeStyle = '#665455'; lc.lineWidth = 2; lc.beginPath(); lc.arc(256, 256, 227, 0, Math.PI * 2); lc.stroke();
  lc.fillStyle = '#d1b2ad'; lc.textAlign = 'center'; lc.font = '15px Arial'; lc.fillText('S H A Y A N', 256, 148); lc.font = '10px Arial'; lc.fillText('SIDE A    •    SELECTED WORKS', 256, 365); lc.fillText('33⅓ RPM  /  2026', 256, 390);
  const labelTexture = new THREE.CanvasTexture(labelCanvas); labelTexture.colorSpace = THREE.SRGBColorSpace;
  const label = new THREE.Mesh(new THREE.RingGeometry(.053, .46, 96), new THREE.MeshStandardMaterial({ map: labelTexture, roughness: .7, metalness: .02 })); label.position.z = .012; spinner.add(label);
  const inner = new THREE.Mesh(new THREE.RingGeometry(.053, .077, 64), new THREE.MeshStandardMaterial({ color: '#b5a6a7', metalness: .65, roughness: .4 })); inner.position.z = .018; spinner.add(inner);
  const pointer = { x: 0, y: 0 }; let visible = true, frame = 0, last = 0, elapsed = 0;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const move = e => { pointer.x = (e.clientX / innerWidth - .5) * .22; pointer.y = (e.clientY / innerHeight - .5) * .22; };
  if (fine) window.addEventListener('pointermove', move, { passive: true });
  function size() { const s = host.clientWidth; renderer.setSize(s, s, false); camera.aspect = 1; camera.updateProjectionMatrix(); }
  const resize = new ResizeObserver(size); resize.observe(host); size();
  function render(t) {
    frame = 0; if (!visible || document.hidden) return;
    if (last && t-last < 1000/HERO.fps-1) { frame = requestAnimationFrame(render); return; }
    const dt = Math.min((t - (last || t)) / 1000, .05); last = t; elapsed += dt;
    const tx = fine ? -pointer.y : Math.sin(elapsed * .22) * .055;
    const ty = fine ? pointer.x : Math.cos(elapsed * .17) * .07;
    group.rotation.x += (tx - group.rotation.x) * HERO.damping;
    group.rotation.y += (ty - group.rotation.y) * HERO.damping;
    group.position.y = Math.sin(elapsed * .6) * .018;
    spinner.rotation.z -= THREE.MathUtils.degToRad(HERO.degreesPerSecond) * dt;
    renderer.render(scene, camera); document.documentElement.classList.add('webgl-ready'); frame = requestAnimationFrame(render);
  }
  function resume() { last = 0; if (visible && !document.hidden && !frame) frame = requestAnimationFrame(render); }
  const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (!visible) { cancelAnimationFrame(frame); frame = 0; } else resume(); });
  observer.observe(document.querySelector('.hero'));
  document.addEventListener('visibilitychange', () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else resume(); });
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); cancelAnimationFrame(frame); frame = 0; document.documentElement.classList.remove('webgl-ready'); });
  canvas.addEventListener('webglcontextrestored', resume);
  window.addEventListener('pagehide', () => { cancelAnimationFrame(frame); observer.disconnect(); resize.disconnect(); environment.dispose(); bump.dispose(); tint.dispose(); labelTexture.dispose(); renderer.dispose(); }, { once: true });
  resume();
}
