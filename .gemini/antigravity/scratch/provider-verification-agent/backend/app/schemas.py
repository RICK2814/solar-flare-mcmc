from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime

class ValidationLogBase(BaseModel):
    source: str
    action: str
    details: str

class ValidationLogCreate(ValidationLogBase):
    pass

class ValidationLog(ValidationLogBase):
    id: int
    provider_id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class ProviderBase(BaseModel):
    npi: str
    first_name: str
    last_name: str
    specialty: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    is_verified: bool = False
    verification_status: str = "PENDING"
    confidence_score: int = 0
    licenses: List[Any] = []
    educations: List[Any] = []

class ProviderCreate(ProviderBase):
    pass

class Provider(ProviderBase):
    id: int
    last_verified_at: Optional[datetime] = None
    validation_logs: List[ValidationLog] = []

    class Config:
        from_attributes = True
