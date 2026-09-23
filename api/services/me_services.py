from models.account_model import *
from data.account_data import *

# Mise à jour des favoris
async def update_of_favorites(updateInfos: AccountInputUpdateFavorite):
    for i in account:
        if updateInfos.name == i["name"]:
            i["favorites"] = updateInfos.favorites
            return True
    return False

# Chercher et envoyer favoris
async def get_favoris_logic (name: str) :
    for i in account:
        if i["name"] == name:
            return i["favorites"]
    return None