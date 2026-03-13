from fastapi import APIRouter
from app.services.environment_service import predict_environment
from app.services.gemini_service import GeminiService

router = APIRouter()

@router.post("/predict")
async def predict(data: dict):
    # Get standard predictions from ML models via service
    result = predict_environment(
        data["air"],
        data["noise"],
        data["water"]
    )

    air_prediction = result["air_quality"]
    noise_prediction = result["noise_level"]
    water_prediction = result["water_quality"]

    # Generate AI analysis using Gemini dedicated method
    ai_analysis = await GeminiService.get_ai_analysis(
        air_prediction,
        noise_prediction,
        water_prediction
    )

    # Return consolidated response as requested
    return {
        "air_quality": float(air_prediction),
        "noise_level": noise_prediction,
        "water_quality": water_prediction,
        "ai_analysis": ai_analysis
    }