# VCRS Visualizer ❄️

An interactive, 3D Vapor Compression Refrigeration Cycle (VCRS) web simulator developed for mechanical engineering thermodynamics students.

See how a refrigerator works in 3D: inspect components, manipulate evaporator and condenser temperatures in real time, observe the live animated phase flow loop, analyze the dynamically updating thermodynamic pressure-enthalpy (p-h) Mollier diagram, and validate theoretical Coefficient of Performance (COP) calculations against standard engineering textbook problems.

---

## 🎓 Physics Explanation (For Course Presentations)

> *"The Vapor Compression Refrigeration Cycle (VCRS) operates as a reverse heat engine that extracts heat ($q_e$) from a low-temperature cold refrigerated space and rejects it ($q_{out}$) to a higher-temperature ambient environment by performing net work input ($w_c$) on a circulating refrigerant. In the ideal cycle, low-pressure saturated vapor enters the compressor at State 1 and undergoes isentropic compression ($s_2 = s_1$) to condenser pressure at State 2 as superheated vapor. It then rejects sensible and latent heat at constant pressure in the condenser until it reaches saturated liquid at State 3. Passing through an expansion valve (throttling device), it undergoes an isenthalpic expansion ($h_4 = h_3$) where sudden depressurization causes partial liquid flashing, dropping both temperature and pressure. Finally, in the evaporator, the two-phase mixture absorbs latent heat of vaporization from the space being cooled at constant pressure until fully evaporated back to saturated vapor at State 1, completing the thermodynamic cycle with an actual Coefficient of Performance defined as $\text{COP} = q_e / w_c$."*

*Note: Property values are simplified pedagogical approximations for teaching purposes.*

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18+ or v20+)
- npm (v9+)

### Installation & Launch
```bash
# Clone or enter the project directory
cd vcrs-visualizer

# Install dependencies
npm install

# Start development server
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

### Build for Production
```bash
npm run build
```
This generates the optimized, production-ready static assets in the `/dist` folder.

---

## 🌐 How to Deploy

Because this app is client-side only (no database, no backend server, no API keys required), it can be deployed to any static host in seconds:

### Deploy to Vercel
1. Push this repository to GitHub.
2. In [Vercel](https://vercel.com), click **Add New Project** and select your repository.
3. Keep default settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Click **Deploy**.

### Deploy to GitHub Pages
1. In `vite.config.ts`, ensure `base: './'` or `base: '/<repo-name>/'`.
2. Add a GitHub Actions workflow `.github/workflows/deploy.yml` with:
   - Step: `npm ci && npm run build`
   - Action: `actions/upload-pages-artifact@v3` with path `./dist`
   - Action: `actions/deploy-pages@v4`
3. In GitHub repo settings, go to **Pages** → Source: **GitHub Actions**.

### Deploy to Netlify
1. Connect repository in Netlify.
2. Set Build Command: `npm run build` and Publish Directory: `dist`.
3. Click **Deploy site**.

---

## 🛠️ Tech Stack & Key Features

- **React 19 + TypeScript + Vite**: Ultra-fast component lifecycle and type safety.
- **Three.js + React Three Fiber + Drei**: Interactive 3D scene with custom procedural models (hermetic compressor with spinning rotor, finned condenser coil with axial fan, brass TXV expansion valve, and frost-rimmed evaporator bundle), floating HTML state badges, and animated glowing particle flows.
- **Plotly.js**: Dynamic pressure-enthalpy (p-h) Mollier diagram plotting the saturation dome and real-time 1→2→3→4 cycle loop.
- **Framer Motion**: Smooth numerical metric transitions for $q_e$, $w_c$, and COP.
- **Tailwind CSS**: Glassmorphism cards, dark theme, and responsive mobile-to-desktop layout.
- **Validation Engine**: Interactive textbook verification against Çengel & Boles and Moran & Shapiro benchmark problems.
