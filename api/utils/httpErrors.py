from fastapi import HTTPException, status

def http_exception (code: int, message: str):
    if code == 401:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=message)
    if code == 404:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=message)
    if code == 409:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=message)
    