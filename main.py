
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
client = openai.AsyncOpenAI(api_key=os.getenv("openai_key"))

# ---------------------------------------------------------------------------- #
def verify_firebase_user(token: str):
    try:
        decoded_token = auth.verify_id_token(token)
        user_id = decoded_token["uid"]
        return user_id
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid Firebase Token")

# ---------------------------------------------------------------------------- #
@app.get("/generate-recommendation/")
async def generate_recommendation(token: str = Depends(security)):
    user_id = verify_firebase_user(token.credentials)

    # Fetch user document
    user_doc_ref = db.collection("users").document(user_id)
    user_doc = user_doc_ref.get()

    if not user_doc.exists:
        raise HTTPException(status_code=404, detail="User attributes not found")

    user_profile = user_doc.to_dict()

    # Load available meals
    with open(MEALS_JSON_FILE, "r") as f:
        meals_data = json.load(f)

    # Prompt for AI model
    prompt = f"""
    You are a knowledgeable nutritionist and dietitian helping a student pick an optimized meal from a list of meals given their health goals and their dining points.
    Context on dining points: students have plans of 2100 dining points to spread out over 11 weeks.
    You will be given all of the user's info as a JSON object, and need to take into account their dietary goals and general profile to generate
    the best top 3 meal choices for them, including potential meal modifications.
    Format the response strictly according to the function schema.

    Here is the user's JSON profile:
    {user_profile}

    Here are the available meals:
    {meals_data}
    """

    try:
        # Call OpenAI API
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            tools=[
                {
                    "type": "function",
                    "function": {
                        "name": "generate_meal_recommendations",
                        "description": "Generate structured meal recommendations based on user attributes and meal goals.",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "LOCATION": {
                                    "type": "array",
                                    "description": "List of recommended meals for the user at a given dining location.",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "name": {
                                                "type": "string",
                                                "description": "Name of the recommended meal."
                                            },
                                            "tags": {
                                                "type": "array",
                                                "description": "1, 2, or 3 specific reasons why to pick food items specific to the user, things like 'high protein' or 'low sodium,' 'carbs,' 'cheap,' 'quick eats,' emphasis on nutritional qualities",
                                                "items": {
                                                    "type": "string"
                                                }
                                            },
                                            "modifications": {
                                                "type": "string",
                                                "description": "Pick from the listed additional modifications that would complete the meal according to the user and their eating goals."
                                            },
                                            "reason": {
                                                "type": "string",
                                                "description": "Description of the food and why it is an optimal food choice for this specific individual and their food goals."
                                            },
                                            "price": {
                                                "type": "number",
                                                "description": "The price of the meal."
                                            }
                                        },
                                        "required": ["name", "tags", "modifications", "reason", "price"]
                                    }
                                }
                            },
                            "required": ["LOCATION"]
                        }
                    }
                }
            ],
            tool_choice={"type": "function", "function": {"name": "generate_meal_recommendations"}}
        )
    except Exception as e:
        logger.error("OpenAI API call failed: " + str(e))
        return {"error": str(e)}

    raw_recommendation = response.choices[0].message.tool_calls[0].function.arguments
    # Parse the response to ensure it's valid JSON
    try:
        recommendation_data = json.loads(raw_recommendation)
    except json.JSONDecodeError as e:
        logger.error("Failed to parse recommendation data as JSON: " + str(e))
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Invalid JSON format in recommendation data",
                "raw_recommendation": raw_recommendation
            }
        )

    return recommendation_data

# ---------------------------------------------------------------------------- #
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

# ---------------------------------------------------------------------------- #
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

# ---------------------------------------------------------------------------- #
# TODO: see if I even need this as a route;
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
