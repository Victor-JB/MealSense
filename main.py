
# for using envs
import os
from dotenv import load_dotenv

# fast api imports
from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import HTTPBearer

# chat api
import openai

# firebase auth
import firebase_admin
from firebase_admin import auth, credentials, firestore

# Load environment variables from .env (for local development)
load_dotenv()

app = FastAPI() # This is what will be refrenced in config

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

    # Fetch user history from Firestore
    user_ref = db.collection("users").document(user_id).collection("history")
    history_docs = user_ref.stream()

    user_history = [doc.to_dict() for doc in history_docs]

    # Query ChatGPT
    prompt = f"Given the user's history: {user_history}, generate meal recommendations."
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )

    recommendation = response["choices"][0]["message"]["content"]
    return {"recommendation": recommendation}
