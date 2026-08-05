from typing import TypeVar

from sqlalchemy.ext.declarative import declarative_base


T = TypeVar("T", bound="Base")

Base = declarative_base()
