# 🛡️ ABHAYA SETU (अभय सेतु)

### Bridging Distress to Rescue

**A Privacy-First Intelligent Public Safety Monitoring & Emergency Response Platform**

ABHAYA SETU is a hackathon prototype designed to explore how intelligent monitoring, early distress detection, and coordinated emergency response can improve safety in public spaces.

The platform demonstrates a connected safety infrastructure that identifies potential distress events, alerts human operators, and supports faster decision-making through an interactive command dashboard.

> **Project Status:** Functional simulation MVP  
> **Category:** Public Safety | Smart Cities | AI-Assisted Monitoring | Emergency Response  
> **Development:** React-based web application

---

## 🌐 Live Demo

🚀 **Live Application:** [ABHAYA SETU](https://abhaya-setu.vercel.app/)

📂 **GitHub Repository:** [View Source Code](https://github.com/baladithyamuthireddy-hub/abhaya-setu)

**Note:** Replace the demo URL if Vercel assigns your project a different domain.

---

## 🎯 Problem Statement

Public spaces such as bus stops, railway foot-overbridges, pedestrian pathways, and isolated transit areas can present safety challenges.

Traditional emergency response systems often depend on individuals manually reporting incidents. In stressful or dangerous situations, a person may be unable to access their phone or request assistance.

Some key challenges include:

- Delayed identification of potential emergencies.
- Dependence on manual reporting and intervention.
- Limited coordination between monitoring systems and responders.
- Difficulty identifying nearby available response units.
- Privacy concerns associated with continuous surveillance.
- Lack of a unified operational view for incident management.

**ABHAYA SETU explores a proactive, privacy-conscious approach to addressing these challenges.**

---

## 💡 Proposed Solution

ABHAYA SETU proposes a network of smart public-safety nodes capable of analyzing environmental signals and identifying events that may require human attention.

The envisioned system combines:

1. **Edge-Based Distress Detection** — Analyze relevant audio and visual signals near their source.
2. **Intelligent Event Classification** — Identify possible distress, falls, crowd congestion, and other safety-related events.
3. **Human Verification** — Allow authorized operators to review incidents before dispatch.
4. **Location-Aware Response Coordination** — Identify nearby available patrol units.
5. **Emergency Alerting** — Demonstrate immediate SOS and local warning mechanisms.
6. **Privacy-First Design** — Prioritize minimal data collection and transparent monitoring.

The current web application simulates these capabilities to demonstrate the proposed operational workflow.

---

## ✨ Key Features

### 📊 1. Centralized Command Dashboard

A unified interface displaying:

- Safety-node operational status.
- Active incidents and emergency alerts.
- Available and assigned patrol units.
- Live-style operational metrics.
- Geographic distribution of safety infrastructure.
- Incident activity and response progress.

### 🧠 2. AI-Assisted Distress Detection Concept

An interactive simulation lab demonstrates potential detection scenarios, including:

- Multilingual verbal distress, including Telugu.
- Possible fall events.
- Crowd congestion.
- Non-emergency activity to demonstrate false-alarm handling.

Detection confidence values and signal visualizations are simulated for demonstration purposes.

### 🚨 3. Emergency SOS System

The dashboard includes an emergency SOS demonstration that:

- Creates a high-priority incident.
- Displays an alert in the command interface.
- Simulates local beacon and warning activation.
- Initiates an operator-review workflow.

No real emergency services are contacted.

### 🗺️ 4. Interactive Safety Map

A map-based operational interface displays:

- Simulated public-safety nodes.
- Incident locations.
- Patrol-unit positions.
- Location-aware response coordination.

The demonstration is geographically centered around **Guntur, Andhra Pradesh, India**.

### 🚓 5. Smart Patrol Dispatch Simulation

The system demonstrates:

- Finding nearby available patrol units.
- Geographic distance calculation.
- Estimated response times.
- Patrol assignment.
- Incident and responder status updates.

Dispatch recommendations are based on simulated patrol information and geographic calculations.

### 🔄 6. Incident Management Lifecycle

Incidents move through a structured workflow:

`DETECTED → PENDING_REVIEW → VERIFIED → ASSIGNED → RESPONDING → RESOLVED`

Operators can also dismiss incidents when appropriate.

Human verification is required before simulated patrol dispatch.

### 📈 7. Analytics & Monitoring

The analytics module presents operational insights, including:

- Incident trends.
- Detection categories.
- Response-related metrics.
- Safety-node activity.
- System performance indicators.

### 🔐 8. Privacy & Transparency

The project emphasizes privacy-aware system design through:

- Edge-processing concepts.
- Data-minimization principles.
- Human-in-the-loop decisions.
- Transparent simulation labels.
- Avoidance of facial emotion classification.
- Responsible handling of safety-related alerts.

---

## 🏗️ System Architecture

```text
Public Safety Environment
          |
          v
Smart Safety Nodes (Concept)
          |
          v
Audio / Visual Event Analysis
          |
          v
Potential Distress Detection
          |
          v
Incident Generation
          |
          v
Central Command Dashboard
          |
          v
Human Verification
          |
          v
Patrol Selection & Dispatch
          |
          v
Response Tracking & Resolution
```

**Implementation note:** The current MVP simulates the detection, safety-node, alerting, and responder workflows within a web application.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend application |
| Vite | Development and production builds |
| JavaScript | Application logic |
| Tailwind CSS | Responsive user interface |
| React Leaflet | Interactive mapping |
| OpenStreetMap | Geographic map data |
| Recharts | Analytics visualizations |
| Browser Local Storage | Demo data persistence |
| Vitest | Automated testing |
| Git & GitHub | Version control |
| Vercel | Web deployment |

---

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm
- Git
- Modern web browser

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/baladithyamuthireddy-hub/abhaya-setu.git
```

**2. Open the project directory**

```bash
cd abhaya-setu
```

**3. Install dependencies**

```bash
npm install
```

**4. Start the development server**

```bash
npm run dev
```

**5. Open the local development URL**

Vite normally displays:

```text
http://localhost:5173/
```

### Production Build

```bash
npm run build
```

### Run Automated Tests

```bash
npm run test
```

---

## 🎬 Demonstration Workflow

The suggested evaluation demonstration follows these steps:

**Step 1 — Command Dashboard**

Introduce the operational dashboard, simulated safety nodes, incidents, and patrol availability.

**Step 2 — Distress Detection Lab**

Select a distress scenario and demonstrate how the platform generates a possible safety event.

**Step 3 — Incident Review**

Open the incident and explain the importance of human verification.

**Step 4 — Patrol Dispatch**

Verify the incident and assign a nearby available simulated patrol unit.

**Step 5 — Response Tracking**

Demonstrate the incident's progress through responding and resolution.

**Step 6 — Emergency SOS**

Trigger the simulated SOS function and explain the emergency-alert workflow.

**Step 7 — Analytics & Privacy**

Highlight operational analytics and the project's privacy-first design.

---

## 🌍 Real-World Applications

The proposed system could be adapted for:

- Public transportation hubs.
- Bus stops and terminals.
- Railway station access routes.
- College and university campuses.
- Pedestrian pathways.
- Smart-city public infrastructure.
- Large public gatherings.

Real-world implementation would require validated detection models, suitable hardware, reliable communications, privacy safeguards, and integration with authorized emergency-response organizations.

---

## 🔮 Future Enhancements

- Integration with physical IoT safety nodes.
- Real edge-based audio event detection.
- Privacy-preserving computer vision for safety events.
- Additional Indian-language distress recognition.
- Secure communication with authorized emergency responders.
- Real-time patrol availability and GPS integration.
- Offline and low-bandwidth emergency communication.
- Field testing to measure accuracy, latency, and false-alarm rates.
- Security audits and privacy impact assessments.

---

## ⚠️ Important Disclaimer

ABHAYA SETU is an **educational and hackathon demonstration prototype**.

The current application uses simulated sensor readings, distress-detection scores, incident scenarios, and patrol operations. It is **not connected to live police, ambulance, or emergency dispatch systems**.

The application must not be relied upon for real-world emergency assistance.

---

## 💙 Our Vision

**Safety should not depend solely on someone's ability to ask for help.**

ABHAYA SETU explores how intelligent infrastructure, responsible technology, and coordinated human response can help bridge the gap between detecting distress and delivering assistance.

### 🛡️ ABHAYA SETU — Bridging Distress to Rescue

---

## 👨‍💻 Project Repository

Developed as a public-safety innovation prototype for hackathon evaluation.

**GitHub:** [baladithyamuthireddy-hub/abhaya-setu](https://github.com/baladithyamuthireddy-hub/abhaya-setu)

**Made with ❤️ for safer public spaces.**
