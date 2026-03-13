from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

class RecommendationRequest(BaseModel):
    aqi: int
    noise: str
    water: str

class HealthResponse(BaseModel):
    status: str
    model: str
