# Circuit Lab

A 3D browser-based circuit simulator with SPICE analysis, Arduino/Raspberry Pi emulation, and real-time collaboration.

![Circuit Lab](https://img.shields.io/badge/status-alpha-yellow)

## Features

- **3D Breadboard** — Realistic 3D breadboard with drag-and-drop component placement
- **SPICE Simulation** — Modified Nodal Analysis engine with DC and transient analysis
- **50+ Components** — Resistors, capacitors, LEDs, transistors, op-amps, 555 timers, logic gates, and more
- **Arduino Emulation** — Cycle-accurate ATmega328P emulation. Write C++ code in the built-in Monaco editor
- **ESP32 Support** — ESP32 microcontroller support with WiFi simulation
- **Raspberry Pi Pico & Pi 4** — GPIO simulation with Python scripting via WebAssembly
- **Real-time Collaboration** — Socket.IO-based live editing with Google OAuth
- **Oscilloscope & Probes** — Drag voltage/current probes onto any wire for live waveform viewing
- **Dual View** — Switch between 3D breadboard and 2D schematic views
- **Save & Share** — Save projects to the cloud, share with collaborators

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, React Three Fiber, Three.js |
| Code Editor | Monaco Editor (VS Code) |
| Backend | Node.js, Express, Socket.IO |
| Auth | Passport.js, Google OAuth 2.0 |
| Database | SQLite (better-sqlite3) |
| Simulation | Custom MNA solver (WASM-ready) |
| Microcontroller | AVR8js (Arduino), Pyodide (Raspberry Pi) |

## Project Structure

```
circuit-lab/
├── packages/
│   ├── client/              # React + Three.js frontend
│   │   └── src/
│   │       ├── components/  # 3D breadboard, editor, panels
│   │       ├── pages/       # Landing, Editor
│   │       ├── services/    # Socket, simulation, microcontrollers
│   │       └── stores/      # Zustand state management
│   ├── server/              # Express + Socket.IO backend
│   │   └── src/
│   │       ├── collab/      # Real-time collaboration
│   │       ├── db/          # SQLite database
│   │       ├── routes/      # Auth, Projects API
│   │       └── services/    # Passport OAuth
│   ├── simulator-core/      # Circuit simulation engine
│   │   └── src/
│   │       ├── components/  # Component library (50+ types)
│   │       ├── engine/      # Netlist builder, simulator
│   │       └── solver/      # MNA matrix solver
│   └── shared/              # Shared TypeScript types
│       └── src/
│           ├── types/       # Circuit project types
│           └── schemas/     # Default configs
```

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/circuit-lab.git
cd circuit-lab

# Install dependencies
npm install

# Build TypeScript
npx tsc -b
```

### Configuration

1. Copy the server environment file:

```bash
cp packages/server/.env.example packages/server/.env
```

2. Edit `packages/server/.env` with your Google OAuth credentials:

```
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
SESSION_SECRET=your-secret-key
```

Get credentials at: https://console.cloud.google.com/apis/credentials

### Development

```bash
# Start backend server (port 3001)
cd packages/server && npm run dev

# Start frontend (port 5173) — in another terminal
cd packages/client && npm run dev
```

Open http://localhost:5173

### Production Build

```bash
# Build all packages
npm run build

# Start production server
cd packages/server && npm start
```

## WASM Optimization

The MNA solver can be compiled to WebAssembly for better performance on large circuits:

```bash
cd packages/simulator-core
# Install prerequisites: https://rustup.rs
# Install wasm-pack: cargo install wasm-pack
npm run build:wasm
```

See `packages/simulator-core/BUILD_WASM.md` for details.

## Example Circuits

Build these circuits to test the simulator:

1. **LED Blink** — Resistor + LED + Battery
2. **Voltage Divider** — Two resistors in series
3. **555 Astable** — 555 timer with R1=1kΩ, R2=10kΩ, C1=10µF
4. **Arduino LED** — Arduino Uno with LED on pin 13
5. **RGB LED** — Three transistors driving an RGB LED
6. **RC Filter** — Low-pass filter with R=1kΩ, C=1µF

## License

MIT
