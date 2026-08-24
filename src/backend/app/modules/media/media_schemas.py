from typing import List, Optional
from pydantic import BaseModel


class MediaItem(BaseModel):
    filename: str
    size_bytes: int
    size_kb: float
    width: Optional[int] = None
    height: Optional[int] = None
    format: str
    url: str


class MediaListResponse(BaseModel):
    total_files: int
    total_size_mb: float
    budget_mb: float
    budget_remaining_mb: float
    items: List[MediaItem]


class MediaUploadResponse(BaseModel):
    filename: str
    original_name: str
    size_bytes: int
    size_kb: float
    width: Optional[int] = None
    height: Optional[int] = None
    format: str
    url: str
    message: str


class MediaDeleteResponse(BaseModel):
    filename: str
    message: str
