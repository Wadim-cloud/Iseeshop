# Future Vision

Pexos is evolving beyond a drawing platform into a **motion-based memory and interpretation engine** that understands and recreates human drawing behavior across tools, time, and mental states.

---

## Core Vision

Build a system that can **observe how you draw**, **understand the behavior behind it**, and **recreate it as if your hand were still moving**.

Not just the image — the **process**.

---

## Drawing as Performance

Most tools store drawings like photos. Pexos will store them like **performances**:

- Every movement
- Every hesitation
- Every correction
- Every tool choice

A drawing becomes a **time-based fingerprint** of your mind and body working together.

---

## Multiple Expressive Identities

You draw differently with different pens. Pexos treats tools as:

- **Behavioral modifiers**
- **Style transformers**
- **Alternate versions of your motor personality**

One artist, many expressive identities.

---

## The Lattice Concept

Instead of treating strokes as isolated lines, Pexos models them as a **lattice** — a network of motion and intent:

- Strokes influence each other
- Relationships form between movements
- Structure emerges across time

The drawing becomes **a network, not a list**.

---

## Replay, Not Just Storage

Pexos won't just show drawings. It will:

- **Replay** them — re-animate the drawing process
- **Reinterpret** them — analyze the motion behind the art
- **Generate** new ones in your style

Like a ghost of your hand that never forgets how you move.

---

## Behavioral Insight Layer

The most ambitious layer: detecting **behavioral patterns** over time.

Not by guessing emotions directly, but by analyzing **how your motion changes compared to your own baseline**:

- Mood shifts reflected in stroke patterns
- Cognitive or motor changes detected early
- Personal motion baselines tracked over time

The system becomes:

- A **mirror** — showing you how you create
- A **tracker** — measuring changes in your creative process
- An **early signal system** — detecting shifts before you're aware of them

---

## Target Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│  ┌───────────────────────────────────────────────────────┐   │
│  │  Svelte (SvelteKit)                                   │   │
│  │  Captures drawing motion — the "senses"               │   │
│  │  • Stroke coordinates, pressure, velocity, timing     │   │
│  │  • Tool selection events                              │   │
│  │  • Canvas state snapshots                             │   │
│  └───────────────────────────┬───────────────────────────┘   │
└──────────────────────────────┼───────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     Go Backend                               │
│  Processes and streams movement — the "nervous system"       │
│  • Real-time stroke ingestion                                │
│  • Motion feature extraction (speed, acceleration, jitter)   │
│  • Session management and streaming                          │
│  • Behavioral baseline computation                           │
└───────────────────────────────┬──────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                   Perl Lattice Engine                         │
│  Transforms and relates strokes — the "reasoning layer"      │
│  • Stroke-to-stroke relationship mapping                     │
│  • Lattice construction from temporal sequences              │
│  • Pattern recognition across drawing sessions               │
│  • Cross-tool behavioral analysis                            │
└───────────────────────────────┬──────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                PostgreSQL / Supabase                          │
│  Stores memory over time — the "long-term brain"             │
│  • Raw stroke data with full temporal metadata               │
│  • Computed behavioral features per session                  │
│  • User baselines and drift metrics                          │
│  • Lattice structures and relationship graphs                │
│  • Tool-specific behavioral profiles                         │
└─────────────────────────────────────────────────────────────┘
```

## Data Layers

### Stroke Capture (Svelte Frontend)

Every drawing interaction will be recorded as a rich motion event:

| Field          | Description                                    |
| -------------- | ---------------------------------------------- |
| `x`, `y`       | Canvas coordinates                             |
| `pressure`     | Pen/touch pressure (if available)              |
| `timestamp`    | Millisecond-precision timing                   |
| `velocity`     | Computed speed of movement                     |
| `acceleration` | Rate of velocity change                        |
| `tool`         | Active brush/pen type                          |
| `color`        | Active color                                   |
| `stroke_id`    | Groups points into strokes (pen-down to pen-up)|
| `session_id`   | Links to drawing session                       |

### Motion Processing (Go Backend)

The backend extracts behavioral features from raw stroke data:

- **Hesitation detection** — pauses longer than a threshold
- **Correction patterns** — undo/redo and overwriting behavior
- **Pressure dynamics** — variations in force over time
- **Stroke rhythm** — timing patterns between strokes
- **Spatial coverage** — how the canvas is explored

### Lattice Construction (Perl Engine)

The lattice engine builds a relational graph from strokes:

- **Temporal edges** — strokes connected by time proximity
- **Spatial edges** — strokes connected by canvas proximity
- **Tool edges** — strokes connected by shared tool usage
- **Similarity edges** — strokes with similar motion profiles

### Long-Term Memory (PostgreSQL)

Over time, the database accumulates:

- Per-user behavioral baselines
- Session-over-session drift analysis
- Tool-specific style profiles
- Anomaly flags for significant behavioral changes

---

## Key Capabilities (Roadmap)

### Phase 1: Motion Capture
- [ ] Record full stroke motion data (coordinates, timing, pressure)
- [ ] Attach tool metadata to each stroke
- [ ] Store sessions with temporal ordering

### Phase 2: Replay Engine
- [ ] Replay drawings as animations (not just static images)
- [ ] Variable-speed playback with scrubbing
- [ ] Highlight hesitations and corrections during replay

### Phase 3: Behavioral Analysis
- [ ] Compute per-session motion features
- [ ] Build personal behavioral baselines
- [ ] Detect drift from baseline across sessions
- [ ] Generate behavioral reports

### Phase 4: Lattice & Relationships
- [ ] Construct stroke lattices from sessions
- [ ] Identify structural patterns across drawings
- [ ] Cross-reference tool-specific behaviors

### Phase 5: Generation & Prediction
- [ ] Generate new strokes in a user's style
- [ ] Predict next-stroke likelihood
- [ ] Style transfer between tool profiles

---

## The Real Goal

> Turn drawing into a measurable, replayable, and interpretable human signal.

A system that can:

1. **Learn** how you move
2. **Remember** how you think through motion
3. **Reflect** changes back to you over time

---

## In One Sentence

Pexos is building **a motion-based memory and interpretation engine that understands and recreates human drawing behavior across tools, time, and mental states**.
