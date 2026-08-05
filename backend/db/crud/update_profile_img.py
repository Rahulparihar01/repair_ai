# crud.py
import os
from uuid import uuid4
from db.models.auth import User_profile,User
from sqlalchemy.orm import Session

UPLOAD_DIR = "profile_images"

# class update_profile:
#     def __init__(self, session: Session):
#         self.session = session

#     def update_avatar(self, user_id: int,email:str, avatar_data: bytes, avatar_filename: str):
#         existing_user = self.session.query(User_profile).filter_by(email=email).first()
#         # Generate a unique filename using UUID
#         image_uuid = str(uuid4())
#         image_extension = avatar_filename.split('.')[-1]
#         image_filename = f"{image_uuid}.{image_extension}"
#         image_path = os.path.join(UPLOAD_DIR, image_filename)

#         # Save the new image to the upload directory
#         with open(image_path, "wb") as f:
#             f.write(avatar_data)

#         # Delete old image if it exists
#         if existing_user and existing_user.image:
#             old_image_path = os.path.join(UPLOAD_DIR, existing_user.image)
#             if os.path.exists(old_image_path):
#                 os.remove(old_image_path)

#         # Update or create User_profile record
#         if existing_user:
#             existing_user.image = image_filename
#         else:
#             new_image = User_profile(
#                 image=image_filename,
#                 user_id=user_id,
#                 email=email  # Ensure email is stored in the new record
#             )
#             self.session.add(new_image)

#         self.session.commit()

#         full_image_path = f"{UPLOAD_DIR}/{image_filename}"

#         return {
#             "image_url": full_image_path
#         }

from sqlalchemy.exc import IntegrityError

class update_profile:
    def __init__(self, session: Session):
        self.session = session

    def update_avatar(self, user_id: int, email: str, avatar_data: bytes, avatar_filename: str):
        # Check if the user exists in the newuser table
        existing_user = self.session.query(User_profile).filter_by(id=user_id).first()
        if not existing_user:
            # Create a new user if the user does not exist
            new_user = User_profile(id=user_id, email=email)
            self.session.add(new_user)
            try:
                self.session.commit()
            except IntegrityError as e:
                self.session.rollback()
                print(f"Error creating new user: {e.orig}")
                raise e

        existing_profile = self.session.query(User_profile).filter_by(email=email).first()
        
        # Generate a unique filename using UUID
        image_uuid = str(uuid4())
        image_extension = avatar_filename.split('.')[-1]
        image_filename = f"{image_uuid}.{image_extension}"
        image_path = os.path.join(UPLOAD_DIR, image_filename)

        # Save the new image to the upload directory
        with open(image_path, "wb") as f:
            f.write(avatar_data)

        # Delete old image if it exists
        if existing_profile and existing_profile.image:
            old_image_path = os.path.join(UPLOAD_DIR, existing_profile.image)
            if os.path.exists(old_image_path):
                os.remove(old_image_path)

        # Update or create User_profile record
        if existing_profile:
            existing_profile.image = image_filename
        else:
            new_profile = User_profile(
                image=image_filename,
                user_id=user_id,
                email=email  # Ensure email is stored in the new record
            )
            self.session.add(new_profile)

        try:
            self.session.commit()
        except IntegrityError as e:
            self.session.rollback()
            print(f"IntegrityError: {e.orig}")
            raise e

        full_image_path = f"{UPLOAD_DIR}/{image_filename}"

        return {
            "image_url": full_image_path
        }
# class update_profile:
    # def __init__(self, session: Session):
    #     self.session = session

    # def update_avatar(self, user_id: int, email: str, avatar_data: bytes, avatar_filename: str):
    #     existing_user = self.session.query(User_profile).filter_by(email=email).first()
   
    #     image_uuid = str(uuid4())
    #     image_extension = avatar_filename.split('.')[-1]
    #     image_filename = f"{image_uuid}.{image_extension}"
    #     image_path = os.path.join(UPLOAD_DIR, image_filename)
    #     with open(image_path, "wb") as f:
    #         f.write(avatar_data)
    #     if existing_user and existing_user.image:
    #         old_image_path = os.path.join(UPLOAD_DIR, existing_user.image)
    #         if os.path.exists(old_image_path):
    #             os.remove(old_image_path)

    #     # Update or create User_profile record
    #     if existing_user:
    #         existing_user.image = image_filename
    #     else:
    #         new_image = User_profile(
    #             image=image_filename,
    #             user_id=user_id,
    #             email=email  # Ensure email is stored in the new record
    #         )
    #         self.session.add(new_image)

    #     self.session.commit()

    #     full_image_path = f"{UPLOAD_DIR}/{image_filename}"

    #     return {
    #         "image_url": full_image_path
    #     }