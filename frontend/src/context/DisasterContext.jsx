import React, { createContext, useContext, useState, useEffect } from 'react';
import { DISASTER_SCENARIOS, EMERGENCY_ALERTS, SHELTERS, SAFE_ROUTES, AI_KNOWLEDGE_BASE } from '../data/mockData';

const DisasterContext = createContext();

export const DisasterProvider = ({ children }) => {
  const [scenarioKey, setScenarioKey] = useState('cyclone-surge');
  const [activeTab, setActiveTab] = useState('map');
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [sosActive, setSosActive] = useState(false);
  const [sosPayload, setSosPayload] = useState(null);
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState([]);
  const [audioSirenEnabled, setAudioSirenEnabled] = useState(false);

  // AI Chat State
  const [aiMessages, setAiMessages] = useState([
    {
      id: 'init-1',
      sender: 'assistant',
      text: 'Hello! I am **ResQ AI**, your real-time emergency and disaster safety assistant. I monitor live mesh sensors, storm surges, high-ground shelters, and evacuation corridors. How can I assist you right now?',
      timestamp: 'Just now',
      suggestions: [
        'Where is the safest shelter near me?',
        'What is the safest evacuation route right now?',
        'Emergency checklist: What should I pack in my Go-Bag?',
        'What should I do if water is entering my ground floor?'
      ]
    }
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);

  const scenario = DISASTER_SCENARIOS[scenarioKey] || DISASTER_SCENARIOS['cyclone-surge'];

  // Filter alerts by current scenario or general critical alerts
  const currentAlerts = EMERGENCY_ALERTS.filter(
    (a) => a.scenarioId === scenarioKey || a.scenarioId === 'cyclone-surge'
  );

  const acknowledgeAlert = (alertId) => {
    if (!acknowledgedAlerts.includes(alertId)) {
      setAcknowledgedAlerts((prev) => [...prev, alertId]);
    }
  };

  const triggerSos = (details) => {
    setSosActive(true);
    setSosPayload({
      ...details,
      timestamp: new Date().toLocaleTimeString(),
      id: `SOS-${Math.floor(100000 + Math.random() * 900000)}`,
      coords: { lat: 18.5204 + (Math.random() - 0.5) * 0.02, lng: 73.8567 + (Math.random() - 0.5) * 0.02 },
      meshHops: 3,
      status: 'TRANSMITTING TO DISPATCH'
    });
    setSosModalOpen(false);
  };

  const cancelSos = () => {
    setSosActive(false);
    setSosPayload(null);
  };

  const switchScenario = (key) => {
    if (DISASTER_SCENARIOS[key]) {
      setScenarioKey(key);
      // Add a system notification in AI chat
      setAiMessages((prev) => [
        ...prev,
        {
          id: `sys-${Date.now()}`,
          sender: 'assistant',
          text: `⚠️ **Incident Context Switched to:** ${DISASTER_SCENARIOS[key].title}. Threat level: **${DISASTER_SCENARIOS[key].threatLevel}**. Live telemetry updated.`,
          timestamp: 'Just now'
        }
      ]);
    }
  };

  const sendAiMessage = (userPrompt) => {
    if (!userPrompt || !userPrompt.trim()) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userPrompt.trim(),
      timestamp: 'Just now'
    };

    setAiMessages((prev) => [...prev, userMsg]);
    setIsAiTyping(true);

    // Realistic intelligent response matching
    setTimeout(() => {
      const lower = userPrompt.toLowerCase();
      let reply = '';
      let suggestions = [];

      if (lower.includes('shelter') || lower.includes('safe place') || lower.includes('refuge')) {
        reply = AI_KNOWLEDGE_BASE['shelter'];
        suggestions = ['Show directions to Civic Center', 'Check St. Jude Arena capacity'];
      } else if (lower.includes('route') || lower.includes('evacuat') || lower.includes('road') || lower.includes('bridge')) {
        reply = `**Evacuation Intelligence:** The recommended evacuation path is **Corridor Alpha (North High Ground Expressway)** with a **96% Safety Score**. Victoria Bridge is submerged & closed. Avoid underpasses in Coastal Sector 4.`;
        suggestions = ['View Safe Routes map', 'Get offline route checklist'];
      } else if (lower.includes('water') || lower.includes('drink') || lower.includes('tap')) {
        reply = AI_KNOWLEDGE_BASE['water'];
        suggestions = ['Where is water distribution?', 'How to boil water safely'];
      } else if (lower.includes('pack') || lower.includes('kit') || lower.includes('bag') || lower.includes('supplies')) {
        reply = AI_KNOWLEDGE_BASE['kit'];
        suggestions = ['First-aid tips', 'Pet evacuation advice'];
      } else if (lower.includes('flood') || lower.includes('ground floor') || lower.includes('trapped') || lower.includes('mud')) {
        reply = AI_KNOWLEDGE_BASE['flood'];
        suggestions = ['Trigger Emergency SOS', 'Find highest elevation nearby'];
      } else if (lower.includes('first aid') || lower.includes('bleed') || lower.includes('burn') || lower.includes('injury') || lower.includes('hypothermia')) {
        reply = AI_KNOWLEDGE_BASE['firstaid'];
        suggestions = ['Request paramedic unit', 'Nearest medical triage'];
      } else if (lower.includes('sos') || lower.includes('panic') || lower.includes('rescue')) {
        reply = AI_KNOWLEDGE_BASE['sos'];
        suggestions = ['Open Emergency SOS Panel', 'Report trapped neighbors'];
      } else {
        reply = `**ResQ Operations Guidance:** For incident **${scenario.title}**, prioritize moving to elevation above 25m. Stay tuned to ResQ Mesh radio channels. Current wind gusts are **${scenario.weather.windGusts}** with **${scenario.weather.rainfallRate}** precipitation. Let me know if you need specific shelter locations, evacuation routing, or first-aid protocols.`;
        suggestions = ['Where is the nearest shelter?', 'View safe evacuation route', 'Emergency kit checklist'];
      }

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: 'Just now',
        suggestions
      };

      setAiMessages((prev) => [...prev, botMsg]);
      setIsAiTyping(false);
    }, 600);
  };

  return (
    <DisasterContext.Provider
      value={{
        scenarioKey,
        scenario,
        switchScenario,
        activeTab,
        setActiveTab,
        currentAlerts,
        shelters: SHELTERS,
        safeRoutes: SAFE_ROUTES,
        acknowledgedAlerts,
        acknowledgeAlert,
        sosActive,
        sosPayload,
        sosModalOpen,
        setSosModalOpen,
        triggerSos,
        cancelSos,
        audioSirenEnabled,
        setAudioSirenEnabled,
        aiMessages,
        isAiTyping,
        sendAiMessage
      }}
    >
      {children}
    </DisasterContext.Provider>
  );
};

export const useDisaster = () => {
  const context = useContext(DisasterContext);
  if (!context) {
    throw new Error('useDisaster must be used within a DisasterProvider');
  }
  return context;
};
