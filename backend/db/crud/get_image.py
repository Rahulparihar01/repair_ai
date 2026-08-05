# crud.py
from typing import List
import base64
from sqlalchemy.orm import Session
from schemas.user import UserCreate
from fastapi import HTTPException
from db.models.auth import Image

class CRUDImage:
    def get_images(self, user: UserCreate, db: Session):
        print('dfdfd:',user)
        try:
           

            image_entries = db.query(Image).filter(Image.user_id == user.id).all()

            if not image_entries:
                raise HTTPException(status_code=404, detail="No images found for this user")

            image_metadata = []
            for image_entry in image_entries:
                image_data_list = image_entry.image_data
                
                for image_data in image_data_list:
                    filename = image_data.get("filename")
                    image_base64 = image_data.get("image_data")
                    image_data_binary = base64.b64decode(image_base64)

                    # Save image locally (adjust path as needed)
                    with open(filename, "wb") as f:
                        f.write(image_data_binary)
                    
                    image_metadata.append({"filename": filename})

            if not image_metadata:
                raise HTTPException(status_code=404, detail="No images found")

            return image_metadata
        
        except HTTPException as http_err:
            raise http_err
        
        except Exception as err:
            raise HTTPException(status_code=500, detail=str(err))

