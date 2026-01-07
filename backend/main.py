import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# LLM Imports
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage

# 1. Load Environment Variables
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY is missing. Please check your .env file.")

# 2. Initialize FastAPI
app = FastAPI(title="AI Chatbot Backend")

# 3. CORS Configuration (Crucial for connecting to React)
# This allows your frontend (running on localhost:5173 or 3000) to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://ai-chatbot-1-tryf.onrender.com", 
        "http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Initialize the LLM Model
# Temperature 0.7 = Creative but focused. 0 = Robot-like. 1 = Very creative.
llm = ChatGoogleGenerativeAI(
    model="gemini-flash-latest", 
    google_api_key=GOOGLE_API_KEY,
    temperature=0.7
)

# 5. Define the Data Structure
class ChatRequest(BaseModel):
    message: str

# 6. The API Endpoint
@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        # Define the system personality (Optional)
        system_instruction = SystemMessage(content="You are a helpful, professional AI assistant built for a corporate dashboard.")
        user_message = HumanMessage(content=request.message)
        
        # Get response from LLM
        response = llm.invoke([system_instruction, user_message])
        
        return {"response": response.content}
    
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# 7. Health Check (To test if server is running)
@app.get("/")
def home():
    return {"status": "Backend is running!"}