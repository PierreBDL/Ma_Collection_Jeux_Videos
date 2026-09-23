from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from services.account_services import *

# Routers
from routers.account_router import router as authRouter
from routers.game_router import router as gameRouter
from routers.me_router import router as meRouter

# Hash mdp
hash_mdp()


app = FastAPI()
app.include_router(authRouter)
app.include_router(gameRouter)
app.include_router(meRouter)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)