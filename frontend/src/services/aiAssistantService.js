// AI Assistant Service
// Manages offline LLM knowledge base answers, suggested prompts, and simulated emergency copilot queries.

export const mockAiKnowledgeBase = {
  'shelter': 'The nearest safe high-ground shelter is **North Central Civic Center** (1.2 km away, 420 beds available, full medical staff & backup generator). Route Alpha is clear with a 96% safety score. Would you like direct navigation?',
  'food': 'Emergency rations and hot meals are currently being served at **North Central Civic Center** and **St. Jude Memorial Arena**. Both locations have infant formula and bottled water supplies.',
  'water': 'Tap water in flooded sectors is currently contaminated. Drink ONLY sealed bottled water or boil for at least 3 minutes. Clean water supply tankers are stationed at North High School Shelter (Gate 2).',
  'kit': 'Essential Emergency Go-Bag Checklist:\n1. 3-day supply of sealed water (3L/person/day) & non-perishable food.\n2. Prescriptions, medications & mini first aid kit.\n3. Waterproof pouch for ID, insurance & documents.\n4. Flashlight, extra batteries & portable power bank.\n5. Sturdy waterproof footwear & warm emergency blanket.\n6. Whistle (for signaling rescue crews without exhausting voice).',
  'flood': 'Flash Flood Survival Protocol:\n- **Never walk or drive through moving water** (just 15 cm of moving water can knock you down, and 30 cm can sweep away a car).\n- Disconnect electrical circuit breakers if safe to do so before water enters.\n- Move to the highest level of your building. If trapped on the roof, signal using bright clothing or a flashlight—do NOT enter a closed attic without roof access.\n- Trigger the ResQ Mesh Emergency SOS beacon if immediate extraction is required.',
  'firstaid': 'Emergency First-Aid Quick Guide:\n- **Bleeding:** Apply firm direct pressure with clean cloth. Elevate wound if possible.\n- **Hypothermia:** Remove wet clothing immediately, wrap in dry blankets/foil sheet, provide warm sweet liquids if conscious.\n- **Burns:** Cool under clean cold running water for 10-15 mins. Cover loosely with sterile dressing—never apply ice or oil.',
  'sos': 'If you or someone nearby is in immediate life-threatening danger, click the **EMERGENCY SOS** button in the top bar or sidebar. ResQ Mesh broadcasts your coordinates across local mesh relay nodes directly to emergency dispatchers even in weak cell signal areas.'
};

export const mockDefaultPrompts = [
  'Where is the safest shelter near me?',
  'What is the safest evacuation route right now?',
  'Emergency checklist: What should I pack in my Go-Bag?',
  'What should I do if water is entering my ground floor?',
  'How do I treat hypothermia or severe bleeding in a flood?',
  'Is tap water safe to drink in coastal sector 4?'
];

/**
 * Fetch default starter prompt suggestions
 * @returns {Promise<Array<string>>}
 */
export async function getDefaultAiPrompts() {
  // TODO: replace with real API call, e.g.:
  // const res = await fetch('/api/ai/prompts');
  // return res.json();

  return new Promise((resolve) => {
    resolve([...mockDefaultPrompts]);
  });
}

/**
 * Query the AI emergency copilot
 * @param {string} userPrompt
 * @param {Object} [currentScenario]
 * @returns {Promise<{reply: string, suggestions: Array<string>}>}
 */
export async function queryAiAssistant(userPrompt, currentScenario = null) {
  // TODO: replace with real API call, e.g.:
  // const res = await fetch('/api/ai/chat', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ prompt: userPrompt, scenario: currentScenario })
  // });
  // return res.json();

  return new Promise((resolve) => {
    setTimeout(() => {
      const lower = userPrompt.toLowerCase();
      let reply = '';
      let suggestions = [];

      if (lower.includes('shelter') || lower.includes('safe place') || lower.includes('refuge')) {
        reply = mockAiKnowledgeBase['shelter'];
        suggestions = ['Show directions to Civic Center', 'Check St. Jude Arena capacity'];
      } else if (lower.includes('route') || lower.includes('evacuat') || lower.includes('road') || lower.includes('bridge')) {
        reply = `**Evacuation Intelligence:** The recommended evacuation path is **Corridor Alpha (North High Ground Expressway)** with a **96% Safety Score**. Victoria Bridge is submerged & closed. Avoid underpasses in Coastal Sector 4.`;
        suggestions = ['View Safe Routes map', 'Get offline route checklist'];
      } else if (lower.includes('water') || lower.includes('drink') || lower.includes('tap')) {
        reply = mockAiKnowledgeBase['water'];
        suggestions = ['Where is water distribution?', 'How to boil water safely'];
      } else if (lower.includes('pack') || lower.includes('kit') || lower.includes('bag') || lower.includes('supplies')) {
        reply = mockAiKnowledgeBase['kit'];
        suggestions = ['First-aid tips', 'Pet evacuation advice'];
      } else if (lower.includes('flood') || lower.includes('ground floor') || lower.includes('trapped') || lower.includes('mud')) {
        reply = mockAiKnowledgeBase['flood'];
        suggestions = ['Trigger Emergency SOS', 'Find highest elevation nearby'];
      } else if (lower.includes('first aid') || lower.includes('bleed') || lower.includes('burn') || lower.includes('injury') || lower.includes('hypothermia')) {
        reply = mockAiKnowledgeBase['firstaid'];
        suggestions = ['Request paramedic unit', 'Nearest medical triage'];
      } else if (lower.includes('sos') || lower.includes('panic') || lower.includes('rescue')) {
        reply = mockAiKnowledgeBase['sos'];
        suggestions = ['Open Emergency SOS Panel', 'Report trapped neighbors'];
      } else {
        const title = currentScenario?.title || 'Active Emergency';
        const windGusts = currentScenario?.weather?.windGusts || '55 km/h';
        const rainfall = currentScenario?.weather?.rainfallRate || '25 mm/hr';
        reply = `**ResQ Operations Guidance:** For incident **${title}**, prioritize moving to elevation above 25m. Stay tuned to ResQ Mesh radio channels. Current wind gusts are **${windGusts}** with **${rainfall}** precipitation. Let me know if you need specific shelter locations, evacuation routing, or first-aid protocols.`;
        suggestions = ['Where is the nearest shelter?', 'View safe evacuation route', 'Emergency kit checklist'];
      }

      resolve({ reply, suggestions });
    }, 400);
  });
}
