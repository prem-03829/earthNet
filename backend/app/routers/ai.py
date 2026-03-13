from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.schemas.ai import ChatRequest, ChatResponse, HealthResponse, RecommendationRequest
from app.services.gemini_service import GeminiService, MODEL_NAME

router = APIRouter(prefix="/api/ai", tags=["ai"])

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    reply = await GeminiService.generate_response(request.message)
    if reply.startswith("Error:"):
        raise HTTPException(status_code=503, detail=reply)
    return ChatResponse(reply=reply)

@router.post("/recommendations", response_model=ChatResponse)
async def recommendations(request: RecommendationRequest):
    reply = await GeminiService.get_ai_analysis(request.aqi, request.noise, request.water)
    if reply.startswith("Error:"):
        raise HTTPException(status_code=503, detail=reply)
    return ChatResponse(reply=reply)

@router.post("/stream")
async def stream_chat(request: ChatRequest):
    return StreamingResponse(
        GeminiService.stream_response(request.message),
        media_type="text/event-stream"
    )

@router.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(status="ok", model=MODEL_NAME)
