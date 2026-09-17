from models.account_model import *
from data.account_data import *

# Login
async def test_login(user: AccountInput):
    for i in account:
        if i["email"] == user.email and i["password"] == user.password:
            return True
    return False
    