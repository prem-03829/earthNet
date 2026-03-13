import joblib
import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

air_model = joblib.load(BASE_DIR / "models" / "air_model.pkl")
noise_model = joblib.load(BASE_DIR / "models" / "noise_model.pkl")
water_model = joblib.load(BASE_DIR / "models" / "water_model.pkl")


def predict_environment(air, noise, water):

    air_df = pd.DataFrame([air])
    air_df.rename(columns={"PM2_5": "PM2.5"}, inplace=True)

    noise_df = pd.DataFrame([noise])
    water_df = pd.DataFrame([water])

    air_prediction = float(air_model.predict(air_df)[0])
    noise_prediction = float(noise_model.predict(noise_df)[0])
    water_prediction = float(water_model.predict(water_df)[0])

    return {
        "air_quality_index": float(air_prediction),
        "noise_level": noise_prediction,
        "water_quality": water_prediction
    }