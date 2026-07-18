// Cloudflare Pages Function: /api/analyze
// Server-side proxy to the Google Gemini API. The API key lives ONLY here,
// as the encrypted Pages secret GEMINI_API_KEY. It is never sent to the browser.

const MODEL = "gemini-3.5-flash";
const GEMINI_URL = (key) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`;

// Condensed digest of the Thirteen Temperaments framework (generated from atlas-data.js).
const FRAMEWORK = {"regions":[{"n":"I","name":"Arousal & Sensory Processing","desc":"The body's baseline: how much movement, stimulation, rhythm, and sensory detail the system runs on."},{"n":"II","name":"Approach, Reward & Connection","desc":"The pull toward the world: novelty, pleasure, and the warmth of other people."},{"n":"III","name":"Threat, Frustration & Loss","desc":"The protective systems: three distinct alarms for danger, for blocked goals, and for loss."},{"n":"IV","name":"Attention & Intentional Regulation","desc":"The steering wheel: what captures attention, and how well it can be placed, held, and redirected."}],"dims":[{"id":"engine","name":"Motor Activity","region":"Arousal & Sensory Processing","poles":["Still and deliberate","Ceaseless motion"],"metaphor":"The Running River","gifts":["Momentum","Embodied thinking","Composure in stillness","Deliberateness"],"edges":["Restlessness read as defiance","Difficulty with enforced stillness","Depletion mistaken for reluctance"],"virtue":"Diligence, ordered energy","concert":[{"with":"Behavioral Regulation","note":"High motion with developing regulation is a body ahead of its brakes. Grow the brakes; do not dampen the motion."},{"with":"Attentional Capture","note":"High movement plus high capture reads as chaos, and is often simply a system built for input, needing structure rather than correction."}]},{"id":"dynamo","name":"Stimulation Need","region":"Arousal & Sensory Processing","poles":["Calm and steady","Hungry for intensity"],"metaphor":"The Furnace","gifts":["Drive and range","Creative restlessness","Deep steadiness","Contentment"],"edges":["Manufactured drama","Follow-through in the flat stretches","Overwhelm read as fragility"],"virtue":"Temperance, zeal rightly aimed","concert":[{"with":"Novelty & Reward Approach","note":"High stimulation need plus high approach seeks the edge of experience. Thrilling, and in need of a governor."},{"with":"Sensory Sensitivity","note":"A person can crave intensity and be overwhelmed by it at once, wanting the loud room and paying for it after. Name both."}]},{"id":"metronome","name":"Biological Rhythmicity","region":"Arousal & Sensory Processing","poles":["Improvised rhythms","Clockwork regularity"],"metaphor":"The Tide","gifts":["Reliability","Early warning","Flexibility","Improvisation"],"edges":["Rigidity under disruption","Missed signals","Regularity mistaken for virtue"],"virtue":"Faithfulness, stewardship of the body","concert":[{"with":"Motor Activity","note":"Regular rhythm plus high motion thrives on a predictable active routine, and struggles when both are denied."},{"with":"Behavioral Regulation","note":"Low rhythmicity leans hard on regulation; external structure does the work the body's clock does not."}]},{"id":"attuned","name":"Sensory Sensitivity","region":"Arousal & Sensory Processing","poles":["Needs strong input","Notices everything"],"metaphor":"The Seismograph","gifts":["Perception","Depth of experience","Endurance in intensity","Attunement to others"],"edges":["Overload read as drama","Depletion after intensity","Missed cues"],"virtue":"Attentiveness, reverent wonder","concert":[{"with":"Sadness & Loss Sensitivity","note":"High sensitivity feeding high sadness produces someone who feels the world deeply and needs help carrying it without drowning."},{"with":"Attentional Capture","note":"When sensitivity meets high capture, complex settings overwhelm fast. The fix is a calmer environment, not a sterner correction."}]},{"id":"pioneer","name":"Novelty & Reward Approach","region":"Approach, Reward & Connection","poles":["Watches first","Steps through the door"],"metaphor":"The Open Door","gifts":["Initiative","Learning by doing","Prudence","Considered commitment"],"edges":["Leaping before looking","Restless with deliberation","Missed opportunity"],"virtue":"Courage tempered by prudence","concert":[{"with":"Threat Sensitivity","note":"These two are near-opposites and make the sharpest inner tension and the best partnerships. Approach opens; vigilance checks."},{"with":"Behavioral Regulation","note":"High approach with developing regulation is the classic bold child. Grow the pause; keep the boldness."}]},{"id":"kindler","name":"Positive Affect & Pleasure","region":"Approach, Reward & Connection","poles":["Quiet, inward delight","Bright, visible joy"],"metaphor":"The Rising Sun","gifts":["Contagious warmth","Hope","Depth over display","Savoring"],"edges":["Joy mistaken for shallowness","The cheerful mask","Coolness misread as unhappiness"],"virtue":"Gratitude, joy","concert":[{"with":"Affiliation & Social Reward","note":"High joy plus high affiliation makes a natural gatherer, the warmth others orbit toward."},{"with":"Sadness & Loss Sensitivity","note":"A person can run high on both delight and sorrow, feeling the whole range vividly. This is depth, not instability."}]},{"id":"kindred","name":"Affiliation & Social Reward","region":"Approach, Reward & Connection","poles":["Rewarded by solitude","Rewarded by closeness"],"metaphor":"The Hearth","gifts":["Bond-building","Warmth and loyalty","Self-possession","Depth over breadth"],"edges":["Closeness that can smother","Fear of the empty room","Distance mistaken for coldness"],"virtue":"Love, communion held with healthy boundaries","concert":[{"with":"Sadness & Loss Sensitivity","note":"High affiliation with high loss sensitivity produces strong attachment and sharp pain after conflict or exclusion. Repair matters enormously."},{"with":"Frustration & Anger","note":"When the connection-seeker also runs hot with frustration, closeness and conflict tangle; the same intensity that bonds can wound."}]},{"id":"sentinel","name":"Threat Sensitivity","region":"Threat, Frustration & Loss","poles":["Slow to alarm","Quick to vigilance"],"metaphor":"The Watchtower","gifts":["Foresight","Conscientiousness","Steadiness under fire","Calm in the unknown"],"edges":["Alarm that outlives the danger","Avoidance that narrows life","Blind spots"],"virtue":"Courage, discernment","concert":[{"with":"Novelty & Reward Approach","note":"Vigilance and approach are the two halves of good judgment. Alone, one freezes and one leaps; together they weigh, then move."},{"with":"Sadness & Loss Sensitivity","note":"High threat plus high sadness produces a tender, careful soul who needs proactive warmth and gentle exposure, not toughening."}]},{"id":"forge","name":"Frustration & Anger","region":"Threat, Frustration & Loss","poles":["Slow to kindle","Quick to protest"],"metaphor":"The Forge-Fire","gifts":["Drive against obstacles","A sense of justice","Forbearance","Even temper"],"edges":["Heat that harms","The long grudge","The unspoken boundary"],"virtue":"Righteous anger disciplined into gentleness","concert":[{"with":"Behavioral Regulation","note":"Fast frustration with a strong pause becomes force under control; without the pause, the heat leads."},{"with":"Affiliation & Social Reward","note":"When that heat burns near the people a person loves most, closeness and conflict entangle. Repair is the whole work."}]},{"id":"tender","name":"Sadness & Loss Sensitivity","region":"Threat, Frustration & Loss","poles":["Recovers quickly","Feels loss deeply"],"metaphor":"The Deep Well","gifts":["Compassion","Depth and loyalty","Resilience","Perspective"],"edges":["Sinking under the weight","Grief that isolates","Moving on too fast"],"virtue":"Compassion, hope","concert":[{"with":"Sensory Sensitivity","note":"High sensitivity feeding high sadness makes a soul who feels everything and needs help carrying it. Protect and accompany."},{"with":"Affiliation & Social Reward","note":"Deep loss sensitivity plus strong affiliation means exclusion and conflict cut deep. Repair and reassurance are essential."}]},{"id":"lightning","name":"Attentional Capture","region":"Attention & Intentional Regulation","poles":["Hard to divert","Easily drawn"],"metaphor":"The Weathervane","gifts":["Wide awareness","Creative association","Deep absorption","Immovable focus"],"edges":["The protected goal that slips","Interruption that costs","Missed cues"],"virtue":"Recollection, the discipline of attention","concert":[{"with":"Effortful Attentional Control","note":"Capture is the pull; effortful control is the counterweight. One person can have a strong pull and a strong hand, or a strong pull and a developing one."},{"with":"Motor Activity","note":"High capture plus high motion reads as chaos, and is often a nervous system built for input, needing structure rather than correction."}]},{"id":"lantern","name":"Effortful Attentional Control","region":"Attention & Intentional Regulation","poles":["Structure-dependent","Self-directed focus"],"metaphor":"The Lantern","gifts":["Directed focus","Flexible agency","Honest dependence","Immersion"],"edges":["The stuck light","The wandering light","Structure mistaken for weakness"],"virtue":"Self-mastery, single-heartedness","concert":[{"with":"Attentional Capture","note":"The pull and the hand. Strong control tames strong capture into vivid, usable attention; weak control leaves it scattered."},{"with":"Behavioral Regulation","note":"Attention placed and behavior governed are the two arms of self-regulation, and they grow together."}]},{"id":"steward","name":"Behavioral Regulation","region":"Attention & Intentional Regulation","poles":["Impulse-led","Purpose-governed"],"metaphor":"The Helm","gifts":["Responsible freedom","Perseverance","Spontaneity","Honest limits"],"edges":["Impulse ahead of intention","The task that will not start","Rigid persistence"],"virtue":"Self-control, the fruit of a governed life","concert":[{"with":"Novelty & Reward Approach","note":"Bold approach with developing regulation is the classic spirited child. The plan is never to dim the boldness, only to grow the brakes."},{"with":"Frustration & Anger","note":"Fast frustration governed by strong regulation becomes force under control. The same heat, without the helm, simply leads."}]}]};

const DIM_BY_ID = Object.fromEntries(FRAMEWORK.dims.map((d) => [d.id, d]));

function bandWord(s) {
  if (s >= 5.5) return "markedly toward";
  if (s >= 4.7) return "toward";
  if (s > 3.3) return "balanced between";
  if (s > 2.5) return "toward";
  return "markedly toward";
}
function bandPole(d, s) {
  if (s > 3.3 && s < 4.7) return `${d.poles[0]} / ${d.poles[1]}`;
  return s >= 4.7 ? d.poles[1] : d.poles[0];
}

function profileToText(p, i) {
  const lines = [];
  const label = p.name ? p.name : `Person ${i + 1}`;
  const role = p.role ? ` (${p.role})` : "";
  lines.push(`### ${label}${role}${p.mode ? " — " + p.mode + "-report" : ""}`);
  if (p.scores && Object.keys(p.scores).length) {
    for (const d of FRAMEWORK.dims) {
      const s = p.scores[d.id];
      if (s === undefined || s === null) continue;
      lines.push(
        `- ${d.name} (${d.metaphor}): ${Number(s).toFixed(1)}/7 — ${bandWord(s)} "${bandPole(d, s)}"`
      );
    }
  } else if (p.notes) {
    lines.push(p.notes);
  }
  return lines.join("\n");
}

const ANALYSIS_SCHEMA = {
  type: "object",
  properties: {
    flowScore: { type: "integer", description: "Ease-of-flow 0-100. Higher = more natural, low-friction connection." },
    flowLabel: { type: "string", description: "3-5 word label for the score, e.g. 'Strong natural flow'." },
    flowRationale: { type: "string", description: "1-2 sentences explaining the score honestly." },
    headline: { type: "string", description: "One warm, specific sentence naming the heart of this relationship." },
    connection: {
      type: "array", description: "Points of natural connection.",
      items: { type: "object", properties: { title: { type: "string" }, detail: { type: "string" } }, required: ["title", "detail"] }
    },
    gifts: {
      type: "array", description: "The gifts each person naturally flows to when connecting; what each brings the other.",
      items: { type: "object", properties: { title: { type: "string" }, detail: { type: "string" } }, required: ["title", "detail"] }
    },
    contention: {
      type: "array", description: "Points of contention or friction, named honestly but without blame.",
      items: { type: "object", properties: { title: { type: "string" }, detail: { type: "string" } }, required: ["title", "detail"] }
    },
    practices: {
      type: "array", description: "Concrete, doable practices to increase ease of flow, fitted to this specific pairing.",
      items: { type: "object", properties: { title: { type: "string" }, detail: { type: "string" } }, required: ["title", "detail"] }
    }
  },
  required: ["flowScore", "flowLabel", "flowRationale", "headline", "connection", "gifts", "contention", "practices"]
};

const SYSTEM = `You are the Temperament Atlas Companion, a warm, perceptive guide who analyzes how people connect through the lens of the Thirteen Temperaments framework.

The framework maps temperament across 13 dimensions grouped in 4 regions. Regions I-III are REACTIVITY (how strongly the system fires: arousal/sensory, approach/reward/connection, threat/frustration/loss). Region IV is REGULATION (attention and intentional self-governance). Health lives in the CALIBRATION between reactivity and regulation, never in one pole being "good."

FRAMEWORK REFERENCE (each dimension has two poles, gifts when honored, edges when strained, its guiding virtue, and "concert" notes on how it interacts with other dimensions):
${JSON.stringify(FRAMEWORK)}

CORE PRINCIPLES:
- No pole is better than the other. Every trait is a gift and a cost. Never pathologize.
- Difference is not deficit. Two people far apart on a dimension are not incompatible; they are complementary and, in the strained moments, in tension. Name both.
- Similarity is not automatic ease. Two people who both run hot on Frustration, or both high on Threat Sensitivity, can amplify each other.
- Ground every claim in the actual scores and the framework's own language (use the metaphors, poles, gifts, edges, and concert notes). Do not invent traits.
- Honor the relationship context. What "ease of flow" means for spouses differs from coworkers, from a parent and child, from friends.
- Warm, relational, concrete voice. Second person where natural. No jargon dumps, no corporate tone, no em dashes.
- If profiles come from an uploaded PDF, read the person's scores/results from it faithfully.

EASE-OF-FLOW METER (flowScore 0-100): estimate how much natural, low-friction ease this pairing has BEFORE deliberate effort. Weigh complementary strengths, shared wavelengths, and the number and depth of friction points. Be honest: a loving, worthwhile relationship can still be hard-flowing (a lower score just means it rewards intention). Anchor: 80-100 unusually easy; 60-79 strong with a few edges; 40-59 real friction alongside real connection; 20-39 hard-flowing, rewards deliberate work; 0-19 highly abrasive without structure.`;

async function callGemini(key, payload) {
  const res = await fetch(GEMINI_URL(key), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message || `Gemini HTTP ${res.status}`);
  }
  const cand = data?.candidates?.[0];
  const text = cand?.content?.parts?.map((p) => p.text).filter(Boolean).join("") || "";
  return text;
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const key = env.GEMINI_API_KEY;
  if (!key) return json({ error: "Server is not configured with a Gemini API key." }, 500);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  const mode = body.mode === "chat" ? "chat" : "analyze";
  const profiles = Array.isArray(body.profiles) ? body.profiles : [];
  const relationship = (body.relationship || "").toString().slice(0, 600);
  const pdfs = Array.isArray(body.pdfs) ? body.pdfs.slice(0, 6) : [];

  // Build the shared context block.
  const ctxParts = [];
  if (relationship) ctxParts.push(`RELATIONSHIP CONTEXT: ${relationship}`);
  if (profiles.length) {
    ctxParts.push(
      `PROFILES (${profiles.length}), scores are 1-7 where 1 = first pole, 7 = second pole, ~4 = balanced:\n\n` +
        profiles.map((p, i) => profileToText(p, i)).join("\n\n")
    );
  }
  const contextText = ctxParts.join("\n\n");

  // Attach any uploaded PDFs as inline data.
  const pdfParts = pdfs
    .filter((f) => f && f.data)
    .map((f) => ({
      inlineData: {
        mimeType: f.mimeType || "application/pdf",
        data: f.data.includes(",") ? f.data.split(",").pop() : f.data
      }
    }));

  try {
    if (mode === "analyze") {
      if (!profiles.length && !pdfParts.length) {
        return json({ error: "Add at least one profile or upload a results PDF." }, 400);
      }
      const userParts = [];
      let instruction =
        "Analyze the connection between the people below. If any details come from attached PDF result documents, read each person's temperament results from them.\n\n" +
        contextText +
        "\n\nReturn your analysis as JSON matching the required schema. Make 'connection', 'gifts', 'contention', and 'practices' each 2-4 items, specific to these people. Vary length naturally.";
      userParts.push({ text: instruction });
      for (const pp of pdfParts) userParts.push(pp);

      const payload = {
        systemInstruction: { parts: [{ text: SYSTEM }] },
        contents: [{ role: "user", parts: userParts }],
        generationConfig: {
          temperature: 0.75,
          topP: 0.95,
          maxOutputTokens: 4096,
          responseMimeType: "application/json",
          responseSchema: ANALYSIS_SCHEMA
        }
      };
      const text = await callGemini(key, payload);
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        return json({ error: "The analysis came back malformed. Please try again." }, 502);
      }
      // clamp score
      parsed.flowScore = Math.max(0, Math.min(100, Math.round(Number(parsed.flowScore) || 0)));
      return json({ analysis: parsed });
    }

    // chat mode: free-form follow-up grounded in the same context + prior analysis
    const question = (body.question || "").toString().slice(0, 4000);
    if (!question) return json({ error: "Empty question." }, 400);
    const history = Array.isArray(body.history) ? body.history.slice(-12) : [];
    const priorText = body.priorAnalysis ? `\n\nEARLIER ANALYSIS (for continuity):\n${JSON.stringify(body.priorAnalysis).slice(0, 6000)}` : "";

    const contents = [];
    // seed the model with the profile context as the first user turn
    const seedParts = [{ text: `CONTEXT FOR THIS CONVERSATION:\n\n${contextText}${priorText}\n\nAnswer the user's follow-up questions about this relationship in warm, plain prose grounded in the framework and the scores. Keep answers focused and practical. No em dashes.` }];
    for (const pp of pdfParts) seedParts.push(pp);
    contents.push({ role: "user", parts: seedParts });
    contents.push({ role: "model", parts: [{ text: "Understood. I have their profiles and context in view. What would you like to explore?" }] });
    for (const m of history) {
      const role = m.role === "user" ? "user" : "model";
      contents.push({ role, parts: [{ text: (m.text || "").toString().slice(0, 4000) }] });
    }
    contents.push({ role: "user", parts: [{ text: question }] });

    const payload = {
      systemInstruction: { parts: [{ text: SYSTEM }] },
      contents,
      generationConfig: { temperature: 0.8, topP: 0.95, maxOutputTokens: 2048 }
    };
    const text = await callGemini(key, payload);
    return json({ reply: text.trim() });
  } catch (err) {
    return json({ error: String(err.message || err) }, 502);
  }
}

export async function onRequestGet() {
  return json({ ok: true, service: "analyze", model: MODEL });
}
