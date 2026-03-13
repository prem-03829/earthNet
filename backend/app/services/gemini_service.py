import google.generativeai as genai
import os
import json
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY")
MODEL_NAME = "gemini-1.5-flash"

# Enforced conciseness in system prompt
SYSTEM_PROMPT = (
    "You are an environmental monitoring assistant. "
    "Provide concise, precise answers limited to 3-4 sentences max. "
    "Avoid long explanations and excessive formatting."
)

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    gemini_model = genai.GenerativeModel(MODEL_NAME, system_instruction=SYSTEM_PROMPT)
else:
    logger.warning("GOOGLE_API_KEY is not set.")
    gemini_model = None

class GeminiService:
    @staticmethod
    async def generate_response(message: str) -> str:
        if not GEMINI_API_KEY or not gemini_model:
             return "Error: GOOGLE_API_KEY is not configured. Please add it to backend/.env"
        
        try:
            response = await gemini_model.generate_content_async(message)
            return response.text.strip()
        except Exception as e:
            logger.error(f"Error calling Gemini: {str(e)}")
            return f"Error: {str(e)}"

    @staticmethod
    async def get_ai_analysis(aqi, noise, water):
        if not GEMINI_API_KEY or not gemini_model:
             return "Error: GOOGLE_API_KEY is not configured. Please add it to backend/.env"

        prompt = f"""
    Environmental monitoring report:

    Air Quality Index: {aqi}
    Noise Level: {noise}
    Water Quality: {water}

    Provide a short environmental risk analysis and recommendations for citizens and authorities.
    """
        try:
            response = await gemini_model.generate_content_async(prompt)
            return response.text.strip()
        except Exception as e:
            logger.error(f"Error in get_ai_analysis: {str(e)}")
            return f"Error: {str(e)}"

    @staticmethod
    async def stream_response(message: str):
        if not GEMINI_API_KEY or not gemini_model:
             yield f"data: {json.dumps({'error': 'GOOGLE_API_KEY is not configured'})}\n\n"
             return

        try:
            response = await gemini_model.generate_content_async(message, stream=True)
            async for chunk in response:
                if chunk.text:
                    yield f"data: {json.dumps({'text': chunk.text})}\n\n"
        except Exception as e:
            logger.error(f"Error streaming from Gemini: {str(e)}")
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
