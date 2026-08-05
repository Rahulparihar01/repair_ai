"""Application entry point for the V2I authentication API.

Run from this project directory:

    uvicorn main:app --reload
"""

from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Import models before creating tables so SQLAlchemy has every model registered.
from db.base import Base
from db.models import auth as auth_models  # noqa: F401
from db.utils import engine
from api.auth.view import router as auth_router
from api.User_profile.view import router as profile_router
from api.bookings.view import router as bookings_router
from api.ai.view import router as ai_router
from api.subscriptions.view import router as subscriptions_router


PROFILE_IMAGES_DIR = Path("profile_images")


@asynccontextmanager
async def lifespan(_: FastAPI):
    """Prepare the local storage directory and database schema at startup."""
    PROFILE_IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="RepairAI Core Platform API",
    version="2.0.0",
    description="Authentication, User Profile, Bookings, AI Triage, and Subscriptions API.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict this to trusted frontend origins in production.
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount(
    "/profile_images",
    StaticFiles(directory=PROFILE_IMAGES_DIR),
    name="profile_images",
)

app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(profile_router, prefix="/profile", tags=["User profile"])
app.include_router(bookings_router, prefix="/bookings", tags=["Bookings"])
app.include_router(ai_router, prefix="/ai", tags=["AI Triage & Diagnostics"])
app.include_router(subscriptions_router, prefix="/subscriptions", tags=["Subscriptions"])


@app.get("/health", tags=["Health"])
async def health_check() -> dict[str, str]:
    """Return a lightweight liveness response for deployments and monitoring."""
    return {"status": "ok"}
