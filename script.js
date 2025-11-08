const particlesRoot = document.getElementById('particles');
const count = 30;
for(let i=0;i<count;i++){
  const d = document.createElement('div');
  d.className = 'particle' + (Math.random()>0.7 ? ' alt' : '');
  const left = Math.random() * 100;
  const speed = (Math.random() * 14 + 8).toFixed(2) + 's';
  const delay = (Math.random() * -8).toFixed(2) + 's';
  const size = Math.round(Math.random() * 8 + 4) + 'px';
  const dx = Math.round((Math.random() * 120) - 60) + 'px';
  const vy = Math.round((Math.random() * 8) - 4) + 'vh';

  d.style.left = left + '%';
  d.style.width = size; d.style.height = size;
  d.style.setProperty('--dur', speed);
  d.style.setProperty('--delay', delay);
  d.style.setProperty('--x', (Math.random()*80 - 40) + 'px');
  d.style.setProperty('--dx', dx);
  d.style.setProperty('--vy', vy);
  d.style.setProperty('--size', size);
  d.style.opacity = 0;
  particlesRoot.appendChild(d);
}

document.querySelectorAll('.tile').forEach(tile => {
  const color = tile.dataset.color || '#7f8c8d';
  const glow = document.createElement('div');
  glow.style.position = 'absolute';
  glow.style.inset = '0';
  glow.style.borderRadius = getComputedStyle(tile).borderRadius;
  glow.style.pointerEvents = 'none';
  glow.style.opacity = '0';
  glow.style.transition = 'opacity .22s ease, box-shadow .22s ease, transform .22s ease';
  glow.style.boxShadow = `0 10px 30px ${hexToRgba(color,0.18)}, inset 0 0 30px ${hexToRgba(color,0.06)}`;
  tile.appendChild(glow);

  tile.addEventListener('mouseenter', () => {
    tile.classList.add('hovered');
    glow.style.opacity = '1';
    tile.style.setProperty('--tile-border-color', color);
    tile.style.transform = 'translateY(-10px)';
    tile.style.boxShadow = `0 18px 40px ${hexToRgba(color,0.14)}`;
    tile.style.outline = `1.8px solid ${hexToRgba(color,0.14)}`;
    tile.style.outlineOffset = '0px';
  });
  tile.addEventListener('mouseleave', () => {
    tile.classList.remove('hovered');
    glow.style.opacity = '0';
    tile.style.transform = '';
    tile.style.boxShadow = '';
    tile.style.outline = 'none';
  });
});

const prog = document.querySelector('.progress > i');
setTimeout(()=> { prog.style.width = '62%'; }, 600);

function hexToRgba(hex, alpha=1){
  const h = hex.replace('#','');
  const bigint = parseInt(h.length===3 ? h.split('').map(s=>s+s).join('') : h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

document.querySelectorAll('.tile').forEach(t=>{
  if(t.tagName.toLowerCase() === 'a'){ t.setAttribute('tabindex','0'); }
});
