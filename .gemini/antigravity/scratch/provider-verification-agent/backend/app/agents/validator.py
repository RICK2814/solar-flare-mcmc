import re
import random
from datetime import datetime
from app.models import Provider, ValidationLog
from sqlalchemy.orm import Session

class DataValidationAgent:
    def __init__(self, db: Session):
        self.db = db

    def validate_provider(self, provider_id: int):
        provider = self.db.query(Provider).filter(Provider.id == provider_id).first()
        if not provider:
            return

        logs = []
        
        # 1. Validate Phone Format
        phone_valid = bool(re.match(r"^\d{3}-\d{3}-\d{4}$", provider.phone))
        if not phone_valid:
            logs.append(ValidationLog(
                provider_id=provider.id,
                source="ValidationAgent",
                action="FLAGGED_PHONE",
                details=f"Invalid phone format: {provider.phone}"
            ))
            provider.confidence_score = max(0, provider.confidence_score - 20)
        else:
            logs.append(ValidationLog(
                provider_id=provider.id,
                source="ValidationAgent",
                action="VERIFIED_PHONE",
                details="Phone format valid"
            ))

        # 2. Mock NPI Registry Check
        # In real life, we'd call the CMS API. Here we simulate it.
        if provider.npi.startswith("12345678"):
            logs.append(ValidationLog(
                provider_id=provider.id,
                source="NPI Registry",
                action="VERIFIED_NPI",
                details="NPI found and active"
            ))
            provider.confidence_score = min(100, provider.confidence_score + 10)
        else:
            logs.append(ValidationLog(
                provider_id=provider.id,
                source="NPI Registry",
                action="FLAGGED_NPI",
                details="NPI not found"
            ))
            provider.confidence_score = max(0, provider.confidence_score - 50)

        # Update Provider
        provider.last_verified_at = datetime.now()
        provider.verification_status = "VERIFIED" if provider.confidence_score > 80 else "NEEDS_REVIEW"
        
        self.db.add_all(logs)
        self.db.commit()
        
        return {"status": "success", "logs": len(logs)}
