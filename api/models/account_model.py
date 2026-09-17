from pydantic import BaseModel, EmailStr, Field

class AccountInput(BaseModel):
    email: EmailStr = Field(...)
    password: str = Field(..., min_length=8, description="Le mot de passe doit contenir 8 caractères")

class AccountOutput(AccountInput):
    id: int