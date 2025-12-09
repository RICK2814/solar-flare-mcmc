from app.database import SessionLocal, engine, Base
from app.models import Provider
import random

# Create tables
Base.metadata.create_all(bind=engine)

def seed_data():
    db = SessionLocal()
    
    # Check if data exists
    if db.query(Provider).count() > 0:
        print("Data already seeded.")
        return

    specialties = ["Cardiology", "Dermatology", "Family Medicine", "Internal Medicine", "Pediatrics"]
    cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"]
    
    providers = []
    for i in range(1, 21): # Seed 20 providers
        first_name = f"Doctor{i}"
        last_name = f"Smith{i}"
        specialty = random.choice(specialties)
        city = random.choice(cities)
        
        # Introduce some "errors" for validation
        phone = f"555-01{i:02d}" if i % 3 != 0 else "Invalid Phone"
        
        provider = Provider(
            npi=f"12345678{i:02d}",
            first_name=first_name,
            last_name=last_name,
            specialty=specialty,
            address=f"{i * 10} Main St",
            city=city,
            state="NY" if city == "New York" else "CA",
            zip_code=f"1000{i}",
            phone=phone,
            email=f"dr{i}@example.com",
            website=f"https://dr{i}practice.com",
            verification_status="PENDING",
            confidence_score=random.randint(50, 90)
        )
        providers.append(provider)
    
    db.add_all(providers)
    db.commit()
    print("Seeded 20 providers.")
    db.close()

if __name__ == "__main__":
    seed_data()
