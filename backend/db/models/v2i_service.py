from sqlalchemy import Column, Integer, String, DateTime, Boolean, BIGINT, ForeignKey, JSON,LargeBinary,BigInteger
from sqlalchemy.orm import relationship
from db.base import Base
import datetime



class Image(Base):
    __tablename__ = 'image_datastore'
    id = Column(Integer, primary_key=True, index=True)
    image_data = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    user_id = Column(Integer, ForeignKey('newuser.id'), nullable=False)
    user_email = Column(String, nullable=False)
    user = relationship("User", back_populates="images")
