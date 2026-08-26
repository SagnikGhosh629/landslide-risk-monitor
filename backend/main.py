from fastapi import FastAPI
import joblib
from pathlib import Path
from pydantic import BaseModel
import pandas as pd

app = FastAPI(
    title="NER Landslide Risk Monitoring API",
    description="AI-based early warning and landslide risk monitoring system",
    version="1.0.0"
)

# Get the project root directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Path to the saved ML model
MODEL_PATH = BASE_DIR / "ml" / "models" / "landslide_risk_model.pkl"

# Load the ML model
model = joblib.load(MODEL_PATH)

print("ML model loaded successfully!")

# Input data structure for prediction
class LandslideInput(BaseModel):
    latitude: float
    longitude: float
    event_month: int
    admin_division_name: str
    landslide_trigger: str
    landslide_category: str
    landslide_setting: str

@app.get("/")
def home():
    return {
        "message": "NER Landslide Risk Monitoring API is running!"
    }


@app.get("/health")



def health():
    return {
        "status": "healthy",
        "model_loaded": True
    }

@app.post("/predict")
def predict_risk(data: LandslideInput):

    # Convert input into DataFrame
    input_df = pd.DataFrame([{
        "latitude": data.latitude,
        "longitude": data.longitude,
        "event_month": data.event_month,
        "admin_division_name": data.admin_division_name,
        "landslide_trigger": data.landslide_trigger,
        "landslide_category": data.landslide_category,
        "landslide_setting": data.landslide_setting
    }])

    # Get probability of High Risk
    probability = float(model.predict_proba(input_df)[0][1])

    # Convert probability into risk level
    if probability >= 0.70:
        risk_level = "HIGH"
    elif probability >= 0.40:
        risk_level = "MODERATE"
    else:
        risk_level = "LOW"

    return {
        "risk_percentage": round(probability * 100, 2),
        "risk_level": risk_level
    }