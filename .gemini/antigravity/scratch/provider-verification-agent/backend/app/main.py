from fastapi import FastAPI
from app.auth import router as auth_router
from app.api.providers import router as provider_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Provider Verification Agent API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, tags=["Authentication"])
app.include_router(provider_router, prefix="/api", tags=["Providers"])

@app.get("/")
def read_root():
    return {"message": "Provider Verification Agent API is running"}
