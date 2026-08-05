from sqlalchemy.orm import Session
from db.models.auth import User, Signin_with_google, User_profile,Image_count
from pathlib import Path
from db.base import Base
from db.utils import engine

Base.metadata.create_all(engine)
UPLOAD_DIR = "profile_images" 
Path(UPLOAD_DIR).mkdir(parents=True, exist_ok=True)

class UserProfile:
    def __init__(self, session: Session):
        self.session = session

    def get_user_profile(self, user):
        video_count=self.session.query(Image_count).filter_by(user_email=user.email).first()
        if isinstance(user, User):
            user_profile = self.session.query(User_profile).filter_by(user_id=user.id).first()
        elif isinstance(user, Signin_with_google):
            user_profile = self.session.query(User_profile).filter_by(email=user.email).first()
        else:
            return None
        
        return user_profile,video_count
    def get_user_data_with_profile(self, user):
        # Initialize user_data based on the user type
        if isinstance(user, User):
            user_data = {
                "id": str(user.id),
                "name": user.name,
                "number": user.number,
                "email": user.email,
                "role": user.role,
                "subscription_plan": user.subscription_plan,
                "selectedOption": user.subscription_period,
                "image_url": None,
                "video_count": None  # Default to 0
            }
        elif isinstance(user, Signin_with_google):
            user_data = {
                "id": str(user.authid),
                "name": user.name,
                "email": user.email,
                "number": None,
                "role": user.role,
                "subscription_plan": user.subscription_plan,
                "selectedOption": user.subscription_period,
                "image_url": None,
                "video_count": None  # Default to 0
            }
        else:
            return None

        # Retrieve the user's profile and video count
        user_profile, video_count = self.get_user_profile(user)
        
        # Set the image URL if the user has a profile image
        if user_profile:
            if user_profile.image:
                user_data["image_url"] = f"{UPLOAD_DIR}/{user_profile.image}"
        else:
            user_data["image_url"] = None

        if video_count:
            user_data["video_count"] = video_count.video_count
        else:
            user_data["video_count"] = 0  # Or some default value if no count is found

        return user_data
