/**
 * Procedurally-authored SVG "maps" for demo mode. No external or copyrighted
 * art — pure vector shapes so the map canvas always has something believable
 * to render even with zero configuration.
 */

function svgToDataUri(svg: string) {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function wrap(width: number, height: number, defs: string, body: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${defs}${body}</svg>`;
}

const tavern = wrap(
  1200,
  800,
  `<defs>
    <radialGradient id="g" cx="50%" cy="35%" r="75%">
      <stop offset="0%" stop-color="#5b3a22"/>
      <stop offset="60%" stop-color="#3a2414"/>
      <stop offset="100%" stop-color="#1c130b"/>
    </radialGradient>
  </defs>`,
  `<rect width="1200" height="800" fill="url(#g)"/>
   <circle cx="600" cy="380" r="120" fill="#7a4a20" opacity="0.5"/>
   <circle cx="600" cy="380" r="90" fill="#8a5a2a" opacity="0.6"/>
   ${[[260,180],[940,180],[260,600],[940,600],[600,650]].map(([x,y]) => `<g><ellipse cx="${x}" cy="${y}" rx="70" ry="45" fill="#6b4526" stroke="#3a2414" stroke-width="6"/></g>`).join("")}
   <rect x="40" y="40" width="240" height="90" rx="10" fill="#4a2f18" stroke="#2a1a0d" stroke-width="4"/>
   <circle cx="150" cy="60" r="18" fill="#e8b563" opacity="0.8"/>
   <rect x="1080" y="700" width="90" height="70" fill="#2a1a0d"/>`,
);

const forest = wrap(
  1200,
  800,
  `<defs>
    <radialGradient id="g" cx="50%" cy="20%" r="90%">
      <stop offset="0%" stop-color="#2f4d34"/>
      <stop offset="60%" stop-color="#1c3320"/>
      <stop offset="100%" stop-color="#0e1c12"/>
    </radialGradient>
  </defs>`,
  `<rect width="1200" height="800" fill="url(#g)"/>
   ${Array.from({ length: 26 }).map((_, i) => {
     const x = (i * 173) % 1200;
     const y = (i * 289) % 800;
     const r = 40 + ((i * 37) % 60);
     return `<circle cx="${x}" cy="${y}" r="${r}" fill="#284d2e" opacity="0.55"/>`;
   }).join("")}
   <path d="M0 500 Q 300 440 600 520 T 1200 480" stroke="#3d6b46" stroke-width="60" fill="none" opacity="0.35"/>`,
);

const crypt = wrap(
  1200,
  800,
  `<defs>
    <radialGradient id="g" cx="50%" cy="40%" r="80%">
      <stop offset="0%" stop-color="#3b2f52"/>
      <stop offset="60%" stop-color="#241c33"/>
      <stop offset="100%" stop-color="#12101c"/>
    </radialGradient>
  </defs>`,
  `<rect width="1200" height="800" fill="url(#g)"/>
   <rect x="520" y="330" width="160" height="220" rx="8" fill="#5b4a7a" stroke="#241c33" stroke-width="6"/>
   ${[[180,180],[1020,180],[180,620],[1020,620]].map(([x,y]) => `<rect x="${x-50}" y="${y-70}" width="100" height="140" fill="#3d3355" stroke="#1a1526" stroke-width="4"/>`).join("")}
   <circle cx="600" cy="200" r="60" fill="#7c3aed" opacity="0.25"/>`,
);

const cyberAlley = wrap(
  1200,
  800,
  `<defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0d1b2e"/>
      <stop offset="100%" stop-color="#05070d"/>
    </linearGradient>
  </defs>`,
  `<rect width="1200" height="800" fill="url(#g)"/>
   ${[120,340,560,780,1000].map((x, i) => `<rect x="${x}" y="${100 + (i%2)*40}" width="140" height="${600 - (i%3)*80}" fill="#101826" stroke="#1c2a3d" stroke-width="3"/>`).join("")}
   <rect x="0" y="700" width="1200" height="100" fill="#0a0f18"/>
   ${[200,460,720,980].map((x) => `<rect x="${x}" y="705" width="4" height="90" fill="#ff2fb0" opacity="0.8"/>`).join("")}
   ${[300,600,900].map((x) => `<rect x="${x}" y="120" width="6" height="480" fill="#2de1ff" opacity="0.6"/>`).join("")}`,
);

const lab = wrap(
  1200,
  800,
  `<defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#123a3a"/>
      <stop offset="100%" stop-color="#081f1f"/>
    </linearGradient>
  </defs>`,
  `<rect width="1200" height="800" fill="url(#g)"/>
   ${[[200,200],[600,200],[1000,200],[200,600],[600,600],[1000,600]].map(([x,y]) => `<rect x="${x-70}" y="${y-40}" width="140" height="80" rx="6" fill="#1c4d4d" stroke="#0d2b2b" stroke-width="4"/>`).join("")}
   <circle cx="600" cy="400" r="90" fill="#2de1ff" opacity="0.12"/>`,
);

const spaceship = wrap(
  1200,
  800,
  `<defs>
    <radialGradient id="g" cx="50%" cy="50%" r="80%">
      <stop offset="0%" stop-color="#1a2338"/>
      <stop offset="100%" stop-color="#05070d"/>
    </radialGradient>
  </defs>`,
  `<rect width="1200" height="800" fill="url(#g)"/>
   ${Array.from({ length: 60 }).map((_, i) => {
     const x = (i * 97) % 1200;
     const y = (i * 233) % 800;
     return `<circle cx="${x}" cy="${y}" r="${1 + (i % 3)}" fill="#ffffff" opacity="0.6"/>`;
   }).join("")}
   <ellipse cx="600" cy="420" rx="360" ry="160" fill="#232e4a" stroke="#3a4a70" stroke-width="6"/>
   <rect x="540" y="360" width="120" height="120" rx="16" fill="#101828" stroke="#3a4a70" stroke-width="4"/>`,
);

const villa = wrap(
  1200,
  800,
  `<defs>
    <radialGradient id="g" cx="50%" cy="30%" r="85%">
      <stop offset="0%" stop-color="#3d1f2e"/>
      <stop offset="60%" stop-color="#26141d"/>
      <stop offset="100%" stop-color="#120a0f"/>
    </radialGradient>
  </defs>`,
  `<rect width="1200" height="800" fill="url(#g)"/>
   <rect x="150" y="700" width="900" height="60" fill="#4a1f2e" opacity="0.7"/>
   ${[260,460,660,860].map((x) => `<rect x="${x-30}" y="150" width="60" height="520" fill="#2e1620" stroke="#120a0f" stroke-width="4"/>`).join("")}
   ${[260,460,660,860].map((x) => `<ellipse cx="${x}" cy="220" rx="26" ry="34" fill="#6b2b40" opacity="0.7"/>`).join("")}
   <rect x="500" y="360" width="200" height="120" fill="#3d1f2e" stroke="#6b2b40" stroke-width="4"/>`,
);

export const DEMO_MAPS = {
  tavern: svgToDataUri(tavern),
  forest: svgToDataUri(forest),
  crypt: svgToDataUri(crypt),
  cyberAlley: svgToDataUri(cyberAlley),
  lab: svgToDataUri(lab),
  spaceship: svgToDataUri(spaceship),
  villa: svgToDataUri(villa),
} as const;
