from sqlalchemy.orm import Session
from db.models.auth import User_profile

class delete_profile:
    def __init__(self, session: Session):
        self.session = session

    def delete_profile_by_image_id(self, user_id: int, image_id: int):
        existing_user = self.session.query(User_profile).filter_by(user_id=user_id).first()

        if existing_user and existing_user.image_id == image_id:
            self.session.delete(existing_user)
            self.session.commit()
            return True
        return False