from sqlalchemy.orm import Session
from db.crud.update_profile_img import update_profile
from fastapi import UploadFile

class update_profile:
    def __init__(self, session: Session):
        self.session = session
        self.crud_user_profile = update_profile(session)

    def update_avatar(self, user_id: int, avatar: UploadFile):
        user_id1 = user_id
        image_data = avatar.file.read()
        full_image_path = self.crud_user_profile.update_avatar(user_id1, image_data, avatar.filename)

        return {
            "status": True,
            "image_path": full_image_path
        }
