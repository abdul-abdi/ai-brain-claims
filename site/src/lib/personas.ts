export type PersonaId =
  | "karpathy"
  | "bach"
  | "hickey"
  | "carmack"
  | "victor"
  | "cantrill"
  | "ayanokoji"
  | "pg"
  | "taleb";

export interface Persona {
  id: PersonaId;
  name: string;
  cue: string;
  blurb: string;
  quote: string;
}

export const PERSONAS: Persona[] = [
  {
    id: "karpathy",
    name: "Karpathy",
    cue: "tokenizer",
    blurb:
      "ML/transformer internals; reasons in tokens; debugs at the embedding layer.",
    quote: "If you can't show me the activations, you don't have a claim.",
  },
  {
    id: "bach",
    name: "Joscha Bach",
    cue: "loop",
    blurb:
      "Computational consciousness; functionalism; agents that contain agents.",
    quote: "An agent without a self-model is a thermostat with extra steps.",
  },
  {
    id: "hickey",
    name: "Hickey",
    cue: "state",
    blurb: "Values over places; identity over time; simple over easy.",
    quote: "Statefulness isn't a feature. It's an apology.",
  },
  {
    id: "carmack",
    name: "Carmack",
    cue: "perf",
    blurb: "Frame-time discipline; benchmarks before opinions.",
    quote: "Latency is a load-bearing wall. Stop drilling holes in it.",
  },
  {
    id: "victor",
    name: "Bret Victor",
    cue: "handle",
    blurb: "Ideas you can grasp; representations you can manipulate.",
    quote: "If the reader can't drag the parameter, they can't see the claim.",
  },
  {
    id: "cantrill",
    name: "Bryan Cantrill",
    cue: "scope",
    blurb: "Production observability is the only ground truth.",
    quote: "I don't trust your benchmark. I trust your flame graph.",
  },
  {
    id: "ayanokoji",
    name: "Ayanokōji",
    cue: "mask",
    blurb: "What an agent withholds is louder than what it says.",
    quote: "The most powerful claim is the one you decline to make.",
  },
  {
    id: "pg",
    name: "pg",
    cue: "question",
    blurb: "Naive questions; first-principle taste; essay-shaped thinking.",
    quote:
      "What if the obvious thing nobody is doing is the right thing?",
  },
  {
    id: "taleb",
    name: "Taleb",
    cue: "fattail",
    blurb: "Tail risk, optionality; mediocristan vs extremistan.",
    quote: "Your average is fine. Your variance will eat you.",
  },
];

export const PERSONAS_BY_ID: Record<PersonaId, Persona> = Object.fromEntries(
  PERSONAS.map((p) => [p.id, p]),
) as Record<PersonaId, Persona>;

const NAME_TO_ID: Record<string, PersonaId> = {
  karpathy: "karpathy",
  "joscha bach": "bach",
  bach: "bach",
  hickey: "hickey",
  carmack: "carmack",
  "bret victor": "victor",
  victor: "victor",
  "bryan cantrill": "cantrill",
  cantrill: "cantrill",
  ayanokoji: "ayanokoji",
  ayanokōji: "ayanokoji",
  pg: "pg",
  "paul graham": "pg",
  taleb: "taleb",
};

export function personaIdFromName(name: string): PersonaId | null {
  const k = name.toLowerCase().trim();
  return NAME_TO_ID[k] ?? null;
}

// Roundtable script — 4 personas × 2 rounds. From the design.
export interface RTRound1Card { p: PersonaId; text: string; }
export interface RTRound2Card { from: PersonaId; to: PersonaId; kind: "dismantle" | "steelman" | "shift"; text: string; }
export interface Roundtable { topic: string; r1: RTRound1Card[]; r2: RTRound2Card[]; }

export const ROUNDTABLE: Roundtable = {
  topic:
    "Should the v1 product expose persona-pair selection to the user?",
  r1: [
    {
      p: "carmack",
      text: "Hide it. Two personas, fixed, profiled, frozen. Users can't make the latency budget if you let them stack five lenses.",
    },
    {
      p: "victor",
      text: "Show it as a knob. The whole pitch is that a persona changes what gets seen. Not letting the user feel that is a self-defeating product.",
    },
    {
      p: "hickey",
      text: "Personas are values. Selection is a place. Users want stable identities they can name and reuse, not a freeform constructor every turn.",
    },
    {
      p: "ayanokoji",
      text: "Show none. The product is more honest if it presents one voice and discloses the lenses in an audit panel after the answer.",
    },
  ],
  r2: [
    {
      from: "victor",
      to: "carmack",
      kind: "dismantle",
      text: "Frozen pairs don't ship a research product, they ship a chatbot. Latency is a real cost; making the knob invisible doesn't pay it, it hides it.",
    },
    {
      from: "carmack",
      to: "victor",
      kind: "steelman",
      text: "Fine — expose it, but with a meter showing the latency cost in milliseconds before the user commits. Then it's an informed choice, not a vibe.",
    },
    {
      from: "hickey",
      to: "ayanokoji",
      kind: "shift",
      text: "Audit-after is honest but defeats the point. People reason about lenses better when they pick them. I'll move: named-pair presets, no freeform, audit panel still there.",
    },
    {
      from: "ayanokoji",
      to: "hickey",
      kind: "steelman",
      text: "Presets are the compromise that survives. The system declares its bias up front; the user accepts or rejects it. The mask is the contract.",
    },
  ],
};

// Pre-computed observatory data, cloned from the design.
// dims: window ∈ {8,16,32,64} × needles ∈ {4,8,16} × seed ∈ 0..7
function buildObs() {
  const W = [8, 16, 32, 64];
  const N = [4, 8, 16];
  const SEEDS = 8;
  const halflives = [1, 2, 4, 8, 16];
  const data: Record<string, number[][] | null> = {};
  function seeded(s: number) {
    let x = (s + 1) * 9301;
    return () => (x = (x * 9301 + 49297) % 233280) / 233280;
  }
  for (const w of W) {
    for (const n of N) {
      if (w === 64 && n === 16) {
        data[`${w}_${n}`] = null;
        continue;
      }
      const seeds: number[][] = [];
      for (let s = 0; s < SEEDS; s++) {
        const r = seeded(s + w * 7 + n * 13);
        const base =
          0.92 - Math.log2(w / 8) * 0.08 - Math.log2(n / 4) * 0.07;
        const points = halflives.map((h) => {
          const peak = 2 + Math.log2(w / 8) * 1.2;
          const dist = Math.abs(Math.log2(h) - Math.log2(peak));
          const noise = (r() - 0.5) * 0.05;
          const v = base - dist * 0.04 - 0.02 * Math.log2(n / 4) + noise;
          return Math.max(0.2, Math.min(0.98, +v.toFixed(3)));
        });
        seeds.push(points);
      }
      data[`${w}_${n}`] = seeds;
    }
  }
  return { W, N, SEEDS, halflives, data };
}

export const OBS = buildObs();
