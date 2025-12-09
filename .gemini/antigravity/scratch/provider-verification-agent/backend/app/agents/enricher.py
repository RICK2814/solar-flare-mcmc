from app.models import Provider, ValidationLog
from sqlalchemy.orm import Session
import random

class InformationEnrichmentAgent:
    def __init__(self, db: Session):
        self.db = db

    def enrich_provider(self, provider_id: int):
        provider = self.db.query(Provider).filter(Provider.id == provider_id).first()
        if not provider:
            return

        # Mock finding education data
        if not provider.educations:
            new_education = {
                "school": "University of Medicine",
                "degree": "MD",
                "year": "2010"
            }
            provider.educations = [new_education]
            
            self.db.add(ValidationLog(
                provider_id=provider.id,
                source="EnrichmentAgent",
                action="ADDED_EDUCATION",
                details="Found education history"
            ))
            
        self.db.commit()
        return {"status": "enriched"}
