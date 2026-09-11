from fastapi import FastAPI
from pydantic import BaseModel
import re

app = FastAPI(title="ResQ-Mesh AI Dispatch Engine")

class SOSRequest(BaseModel):
    text: str

DISASTER_RULES = {
    "Flood": ["flood", "water", "drowning", "submerged", "boat", "river", "overflow"],
    "Fire": ["fire", "smoke", "trapped", "burn", "explosion", "blaze"],
    "Medical": ["bleeding", "injured", "fracture", "unconscious", "heart", "oxygen", "casualty", "patient"],
    "Earthquake/Collapse": ["rubble", "collapse", "debris", "trapped", "building", "earthquake"]
}

@app.post("/predict")
def classify_sos(req: SOSRequest):
    content = req.text.lower()
    
    detected_tags = []
    for category, keywords in DISASTER_RULES.items():
        if any(k in content for k in keywords):
            detected_tags.append(category)
            
    if not detected_tags:
        detected_tags.append("General SOS")

    count_match = re.search(r'(\d+)\s*(survivor|people|person|victim|trapped|injured)', content)
    victim_count = int(count_match.group(1)) if count_match else 1

    high_urgency_tokens = ["trapped", "critical", "immediate", "drowning", "unconscious", "explosion", "emergency"]
    is_urgent = any(token in content for token in high_urgency_tokens)

    if victim_count >= 5 or ("critical" in content) or ("immediate" in content and is_urgent):
        priority = "Critical"
    elif is_urgent or victim_count > 1:
        priority = "High"
    elif len(detected_tags) > 1:
        priority = "Medium"
    else:
        priority = "Low"

    return {
        "priority": priority,
        "tags": detected_tags,
        "survivor_count": victim_count,
        "status": "AI_INFERRED"
    }

@app.get("/health")
def health():
    return {"status": "online", "service": "ResQ-Mesh AI Node"}
