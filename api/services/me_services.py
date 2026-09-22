from fastapi import Depends, HTTPException, status
from models.account_model import *
from data.account_data import *


# Mise à jour des favoris
async def update_of_favorites(updateInfos: AccountInputUpdateFavorite):
    for i in account:
        if updateInfos.name == i["name"]:
            i["favorites"] = updateInfos.favorites
            return True
    return False