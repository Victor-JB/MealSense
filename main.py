
# for using envs
import os
from dotenv import load_dotenv

import logging

# for getting menu from transact api
import requests
import json
from datetime import datetime

# fast api imports
from fastapi import FastAPI, Depends, HTTPException, Body
from fastapi.security import HTTPBearer

# chat api
import openai

# firebase auth
import firebase_admin
from firebase_admin import auth, credentials, firestore

# Load environment variables from .env (for local development)
load_dotenv()

app = FastAPI() # This is what will be refrenced in config

logging.basicConfig(level=logging.WARNING, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

MEALS_JSON_FILE = "current_meals.json"
# need the actual transact api url; public-facing one doesn't exist :(
DINING_API_URL = "https://example.com/dining-hall/meals"

# Retrieve Firebase credentials from environment variables
firebase_config = {
    "type": os.getenv("type"),
    "project_id": os.getenv("project_id"),
    "private_key_id": os.getenv("private_key_id"),
    "private_key": os.getenv("private_key").replace("\\n", "\n"),  # Fix formatting
    "client_email": os.getenv("client_email"),
    "client_id": os.getenv("client_id"),
    "auth_uri": os.getenv("auth_uri"),
    "token_uri": os.getenv("token_uri"),
    "auth_provider_x509_cert_url": os.getenv("auth_provider_x509_cert_url"),
    "client_x509_cert_url": os.getenv("client_x509_cert_url"),
    "universe_domain": os.getenv("universe_domain"),
}

# Initialize Firebase Admin SDK
if not firebase_admin._apps:
    cred = credentials.Certificate(firebase_config)
    firebase_admin.initialize_app(cred)

db = firestore.client()

security = HTTPBearer()

# OpenAI API Key
openai.api_key = os.getenv("openai_key")

def verify_firebase_user(token: str):
    try:
        decoded_token = auth.verify_id_token(token)
        user_id = decoded_token["uid"]
        return user_id
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid Firebase Token")

@app.get("/generate-recommendation/")
async def generate_recommendation(token: str = Depends(security)):
    user_id = verify_firebase_user(token.credentials)
    # logger.warning("user_id" + user_id)

    # Fetch user document
    user_doc_ref = db.collection("users").document(user_id)
    logger.warning("user_doc_ref" + user_doc_ref)
    user_doc = user_doc_ref.get()

    logger.warning("user_doc" + user_doc)

    if not user_doc.exists:
        raise HTTPException(status_code=404, detail="User attributes not found")

    user_profile = user_doc.to_dict()
    logger.warning("user_profile" + user_profile)

    # Load available meals
    with open(MEALS_JSON_FILE, "r") as f:
        meals_data = json.load(f)
    logger.warning("meals" + meals_data)

    # Prompt for AI model
    prompt = f"""
    You are a knowledgeable nutritionist and dietician that is helping a student pick an optimized meal from a list of meals given their health goals.
    You will be given all of the user's info as a json object, and need to take into account their dietary goals and their general profile to generate the
    best top 3 meal choices for them.
    Format the response strictly according to the function schema.
    Here is the user's json profile:\n\n{user_profile}\n\n
    Here are the available meals:\n\n{meals_data}\n
    """
    logger.warning("prompt" + prompt)

    # Structured response from OpenAI
    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        functions=[{
            "name": "generate_meal_recommendations",
            "description": "Generate structured meal recommendations based on user attributes and meal goals.",
            "parameters": {
                "type": "object",
                "properties": {
                    "recommendations": {
                        "type": "array",
                        "description": "List of recommended meals with details.",
                        "items": {
                            "type": "object",
                            "properties": {
                                "meal_name": {"type": "string", "description": "Name of the recommended meal"},
                                "description": {"type": "string", "description": "Short description of the meal"},
                                "nutritional_attributes": {
                                    "type": "array",
                                    "items": {"type": "string"}
                                }
                            }
                        }
                    }
                },
                "required": ["recommendations"]
            }
        }],
        function_call={"name": "generate_meal_recommendations"}
    )
    logger.warning("response" + response)

    recommendation_data = response["choices"][0]["message"]["function_call"]["arguments"]

    return json.loads(recommendation_data)

@app.post("/set-user-data/")
async def set_user_data(token: str = Depends(security), user_data: dict = Body(...)):
    """
    Accepts a Firebase user token and a dictionary of user field data.
    It creates or updates the user's document in Firestore.
    """
    user_id = verify_firebase_user(token.credentials)

    # Reference to the user's document
    user_doc_ref = db.collection("users").document(user_id)

    try:
        # Use set() with merge=True to update or create the document
        user_doc_ref.set(user_data, merge=True)
        return {"status": "success", "message": "User data updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update user data: {str(e)}")

@app.get("/get-user-data/")
async def get_user_data(token: str = Depends(security)):
    """
    Retrieves user profile data from Firestore using the provided Firebase token.
    """
    user_id = verify_firebase_user(token.credentials)

    # Reference to the user's document
    user_doc_ref = db.collection("users").document(user_id)
    user_doc = user_doc_ref.get()

    if not user_doc.exists:
        raise HTTPException(status_code=404, detail="User data not found")

    return {"status": "success", "user_data": user_doc.to_dict()}

@app.get("/update-meals/")
def update_meals():
    """Fetch new meals and update JSON file."""
    try:
        response = requests.get(DINING_API_URL)
        if response.status_code == 200:
            meals_data = response.json()
            with open(MEALS_JSON_FILE, "w") as f:
                json.dump(meals_data, f, indent=4)
            return {"status": "success", "message": "Meals updated successfully"}
        else:
            return {"status": "error", "message": f"Failed to fetch meals: {response.status_code}"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
