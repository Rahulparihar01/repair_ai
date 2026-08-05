
from db.models.auth import User, Signin_with_google,User_profile
from typing import Union
from fastapi import  Depends, HTTPException,UploadFile,File,Form
from sqlalchemy.orm import Session
from api.auth.util import  get_current_user
from db.crud.get_profile import UserProfile
from api.User_profile.update_image import update_profile
from api.User_profile.delete_profile import delete_image
from fastapi import APIRouter
from db.utils import get_session
from db.base import Base
from db.utils import engine
import os
from uuid import uuid4

Base.metadata.create_all(engine)

router = APIRouter()

@router.get('/get_profile')
async def get_user_profile(user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    print(user)
    profile = UserProfile(session)
    print(profile)
    user_data = profile.get_user_data_with_profile(user)
    print(user_data)
    if user_data:
        return user_data
    else:
        raise HTTPException(status_code=401, detail="User not found")


# @router.patch("/update_Image")
# async def upload_avatar(user_id: int = Form(...), current_user: User = Depends(get_current_user),
#                         avatar: UploadFile = File(...), session: Session = Depends(get_session)):
#     profile_update = update_profile(session)
#     email = current_user.email
#     print("sfs",email)
#     avatar_filename = avatar.filename
#     avatar = await avatar.read()

#     return profile_update.update_avatar(user_id,email, avatar, avatar_filename)


UPLOAD_DIR="profile_images"

@router.patch("/update_Image")
async def upload_avatar(
    user_id: int = Form(...),
    current_user: User = Depends(get_current_user),
    avatar: UploadFile = File(...),
    session: Session = Depends(get_session)
):
    user_id1 = current_user.id
    existing_user = session.query(User_profile).filter_by(user_id=user_id1).first()

    # Read image data
    image_data = await avatar.read()

    # Generate a unique filename using UUID
    image_uuid = str(uuid4())
    image_extension = avatar.filename.split('.')[-1]
    image_filename = f"{image_uuid}.{image_extension}"
    image_path = os.path.join(UPLOAD_DIR, image_filename)
    with open(image_path, "wb") as f:
        f.write(image_data)

    # Delete old image if it exists
    if existing_user and existing_user.image:
        old_image_path = os.path.join(UPLOAD_DIR, existing_user.image)
        if os.path.exists(old_image_path):
            os.remove(old_image_path)

    # Update or create User_profile record
    if existing_user:
        existing_user.image = image_filename
    else:
        new_image = User_profile(
            image=image_filename,
            user_id=user_id1
        )
        session.add(new_image)
        session.commit()
    session.refresh(existing_user if existing_user else new_image)

    full_image_path = f"{UPLOAD_DIR}/{image_filename}"

   
    return {
        "image_url": full_image_path
    }



@router.delete('/delete_profile')
async def delete_data(user_id: int = Form(...), current_user: Union[Signin_with_google, User] = Depends(get_current_user),
                      session: Session = Depends(get_session)):
    delete_data = delete_image(session)
    return delete_data.delete_profile(current_user.id, user_id)

