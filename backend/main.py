import secrets
import string

from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import Integer, String, Column, Text, DateTime, ForeignKey,create_engine
from sqlalchemy.sql import func
from sqlalchemy.orm import  Session , sessionmaker, declarative_base, relationship
import datamodel

def generate_id(length=8):
    characters = string.ascii_letters + string.digits
    return ''.join(secrets.choice(characters) for _ in range(length))


app = FastAPI()



engine = create_engine("sqlite:///CRM_User_data.db", connect_args={'check_same_thread':False})
sesssionlocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
base = declarative_base()

app.add_middleware(
    
    CORSMiddleware,
    allow_origins=["https://crm-support-system-five.vercel.app"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"] 
)



class Ticket(base):

    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)

    ticket_id = Column(String(20), unique=True, nullable=False, index=True)

    customer_name = Column(String(255),  nullable=False)

    customer_email = Column(String(255),  nullable=False)

    subject = Column(String(255),  nullable=False)

    description = Column(Text,  nullable=False)

    status = Column(String(50),  nullable=False,  default="Open")

    created_at = Column(DateTime(timezone=True),  server_default=func.now(),  nullable=False)

    updated_at = Column(DateTime(timezone=True),  server_default=func.now(),  onupdate=func.now(),  nullable=False)

    notes = relationship("Note",  back_populates="ticket",    cascade="all, delete-orphan")


class Note(base):

    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)

    ticket_id = Column(Integer, ForeignKey("tickets.id"), nullable=False)

    note_text = Column(Text, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    ticket = relationship("Ticket", back_populates="notes")

base.metadata.create_all(engine)

def get_db():
    db = sesssionlocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/api/tickets", response_model=datamodel.ResponsePost)
def post_ticket(post_data: datamodel.PostTicketBody,db: Session = Depends(get_db)):

    count = db.query(Ticket).count()
    

    ticket_id = 'TKT'+generate_id()
    
    new_ticket = Ticket(
        ticket_id=ticket_id,
        customer_name=post_data.customer_name,
        customer_email=post_data.customer_email,
        subject=post_data.subject,
        description=post_data.description
    )

    db.add(new_ticket)

    db.commit()

    db.refresh(new_ticket)

    return {
        "ticket_id": new_ticket.ticket_id,
        "created_at": new_ticket.created_at
    }



@app.get("/api/tickets", response_model=list[datamodel.ResponseGetBody])
def get_all_tickets(status: str | None = Query(default=None),
                    search: str | None = Query(default=None),
                    db: Session = Depends(get_db)):

    query = db.query(Ticket)

    if status:
        query = query.filter(Ticket.status == status)

    if search:
        query = query.filter(Ticket.customer_name.ilike(f"%{search}%"))

    tickets = query.all()

    return tickets



@app.get("/api/tickets/{ticket_id}",response_model=datamodel.ResponseGetOneBody)
def get_one_ticket(ticket_id: str,db: Session = Depends(get_db)):

    ticket = db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()

    if not ticket:

        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    return {
        "ticket_id": ticket.ticket_id,
        "customer_name": ticket.customer_name,
        "customer_email": ticket.customer_email,
        "subject": ticket.subject,
        "description": ticket.description,
        "status": ticket.status,
        "notes": ticket.notes
    }



@app.put("/api/tickets/{ticket_id}",response_model=datamodel.ResponsePutBody)
def update_ticket(ticket_id: str, update_data: datamodel.PutBody, db: Session = Depends(get_db)):

    ticket = db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()

    if not ticket:

        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    ticket.status = update_data.status

    new_note = Note(
        ticket_id=ticket.id,
        note_text=update_data.notes
    )
    db.add(new_note)
    db.commit()
    db.refresh(ticket)

    return {
        "success": True,
        "updated_at": ticket.updated_at
    }


# # ===========================================================================
# # ===========================================================================
# # ===========================================================================

@app.delete("/api/tickets/{ticket_id}",response_model=datamodel.ResponsePutBody)
def delet(ticket_id: str, delete_data: datamodel.ResponseGetOneBody, db: Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()
    
    if not ticket:
        return "Ticket not found"
    db.delete(ticket)
    db.commit()
    db.refresh(ticket)
    return "Ticket Deleted"


@app.post("/api/tickets/bulk")
def create_bulk_tickets(data: datamodel.BulkTicketBody,db: Session = Depends(get_db)):

    created_tickets = []

    current_count = db.query(Ticket).count()

    for index, ticket_data in enumerate(data.tickets, start=1):

        ticket_number = current_count + index

        # generated_ticket_id = f"TKT-{ticket_number:03d}"
        generated_ticket_id = 'TKT'+generate_id()

        new_ticket = Ticket(
            ticket_id=generated_ticket_id,
            customer_name=ticket_data.customer_name,
            customer_email=ticket_data.customer_email,
            subject=ticket_data.subject,
            description=ticket_data.description,
            status="Open"
        )

        db.add(new_ticket)

        created_tickets.append(new_ticket)

    db.commit()

    for ticket in created_tickets:
        db.refresh(ticket)

    return {
        "success": True,
        "total_created": len(created_tickets),
        "tickets": [
            {
                "ticket_id": ticket.ticket_id,
                "created_at": ticket.created_at
            }
            for ticket in created_tickets
        ]
    }
