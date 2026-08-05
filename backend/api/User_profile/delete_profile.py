from sqlalchemy.orm import Session
from db.crud.delete_profile_image import delete_profile
from fastapi import HTTPException

class delete_image:
    def __init__(self, session: Session):
        self.session = session
        self.crud_user_profile = delete_profile(session)

    def delete_profile(self, user_id: int, image_id: int):
        deleted = self.crud_user_profile.delete_profile_by_image_id(user_id, image_id)
        if deleted:
            return {"status": True}
        else:
            raise HTTPException(status_code=404, detail="User profile with provided image_id not found")