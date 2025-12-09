from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Provider(Base):
    __tablename__ = "providers"

    id = Column(Integer, primary_key=True, index=True)
    npi = Column(String, unique=True, index=True, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    specialty = Column(String)
    
    # Contact Info
    address = Column(String)
    city = Column(String)
    state = Column(String)
    zip_code = Column(String)
    phone = Column(String)
    email = Column(String)
    website = Column(String)
    
    # Status
    is_verified = Column(Boolean, default=False)
    verification_status = Column(String, default="PENDING") # PENDING, VERIFIED, FLAGGED, NEEDS_REVIEW
    last_verified_at = Column(DateTime(timezone=True))
    confidence_score = Column(Integer, default=0) # 0-100
    
    # Enriched Data
    licenses = Column(JSON, default=[])
    educations = Column(JSON, default=[])
    
    validation_logs = relationship("ValidationLog", back_populates="provider")

class ValidationLog(Base):
    __tablename__ = "validation_logs"

    id = Column(Integer, primary_key=True, index=True)
    provider_id = Column(Integer, ForeignKey("providers.id"))
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    source = Column(String) # e.g., "NPI Registry", "Scraper", "Google Maps"
    action = Column(String) # e.g., "VERIFIED_ADDRESS", "FLAGGED_MISMATCH"
    details = Column(Text)
    
    provider = relationship("Provider", back_populates="validation_logs")
