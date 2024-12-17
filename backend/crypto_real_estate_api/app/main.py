from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import psycopg
from .core.database import engine, Base
from .routes import properties, users, auth, transactions
import logging

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(title="Crypto Real Estate API")

@app.on_event("startup")
async def startup_event():
    Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(properties.router, prefix="/api/properties", tags=["properties"])
app.include_router(transactions.router, prefix="/api/transactions", tags=["transactions"])

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}
