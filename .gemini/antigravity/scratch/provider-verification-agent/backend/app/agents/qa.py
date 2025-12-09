from app.models import Provider
from sqlalchemy.orm import Session

class QualityAssuranceAgent:
    def __init__(self, db: Session):
        self.db = db

    def assess_quality(self, provider_id: int):
        provider = self.db.query(Provider).filter(Provider.id == provider_id).first()
        if not provider:
            return

        # Simple logic: if score is low, flag for manual review
        if provider.confidence_score < 60:
            provider.verification_status = "FLAGGED"
        
        self.db.commit()
        return {"current_score": provider.confidence_score, "status": provider.verification_status}
