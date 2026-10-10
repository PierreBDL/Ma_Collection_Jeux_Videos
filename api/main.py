from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from services.account_services import *

# Routers
from routers.account_router import router as authRouter
from routers.game_router import router as gameRouter
from routers.me_router import router as meRouter

# BDD
from database import *
from data.seed import fill_bdd

##############################################################

# Hash mdp (test compte hardcodé)
#hash_mdp()

# Remplir bdd
fill_bdd()


app = FastAPI()

# Format d'erreur du sujet
async def api_error(request, exception):
    code = getattr(exception, "status_code", 400)
    message = getattr(exception, "detail", "Paramètres invalides")
    if not isinstance(message, str):
        message = "Paramètres invalides"
    return app.router.default_response_class.value(
        status_code=code,
        content={"erreur": {"code": code, "message": message}},
        headers=getattr(exception, "headers", None)
    )

# Réutiliser les handlers déjà présents dans FastAPI
for exception_type in list(app.exception_handlers):
    if exception_type.__name__ in ("HTTPException", "RequestValidationError"):
        app.add_exception_handler(exception_type, api_error)


# Création du CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], # Accepter selon l'origine de la requête
    allow_credentials=True, # Token
    allow_methods=["*"], # Methodes CRUD
    allow_headers=["*"], # Token
)

# Routers
app.include_router(authRouter)
app.include_router(gameRouter)
app.include_router(meRouter)