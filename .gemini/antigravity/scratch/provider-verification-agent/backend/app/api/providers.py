from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Provider
from app.schemas import Provider as ProviderSchema
from app.agents.validator import DataValidationAgent
from app.agents.enricher import InformationEnrichmentAgent
from app.agents.qa import QualityAssuranceAgent
from app.auth import get_current_user, User

router = APIRouter()

@router.get("/providers", response_model=List[ProviderSchema])
def get_providers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    providers = db.query(Provider).offset(skip).limit(limit).all()
    return providers

@router.get("/providers/{provider_id}", response_model=ProviderSchema)
def get_provider(provider_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    provider = db.query(Provider).filter(Provider.id == provider_id).first()
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")
    return provider

@router.post("/providers/{provider_id}/validate")
def validate_provider(provider_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    agent = DataValidationAgent(db)
    result = agent.validate_provider(provider_id)
    
    # Chain agents: Validate -> Enrich -> QA
    enricher = InformationEnrichmentAgent(db)
    enricher.enrich_provider(provider_id)
    
    qa = QualityAssuranceAgent(db)
    qa_result = qa.assess_quality(provider_id)
    
    return {"validation": result, "qa": qa_result}

@router.post("/providers/validate-all")
def validate_all_providers(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    providers = db.query(Provider).all()
    count = 0
    for p in providers:
        agent = DataValidationAgent(db)
        agent.validate_provider(p.id)
        count += 1
    return {"message": f"Triggered validation for {count} providers"}
