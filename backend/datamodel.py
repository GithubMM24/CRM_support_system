from datetime import datetime
from typing import Literal

from pydantic import BaseModel


# =========================
# POST /api/tickets
# =========================

class PostTicketBody(BaseModel):
    customer_name: str
    customer_email: str
    subject: str
    description: str


class ResponsePost(BaseModel):
    ticket_id: str
    created_at: datetime


# =========================
# GET /api/tickets
# =========================

class ResponseGetBody(BaseModel):
    id:int
    ticket_id: str
    customer_name: str
    customer_email: str
    subject: str
    status: str
    created_at: datetime


# =========================
# GET /api/tickets/{ticket_id}
# =========================

class NoteResponse(BaseModel):
    note_text: str
    created_at: datetime


class ResponseGetOneBody(BaseModel):
    ticket_id: str
    customer_name: str
    customer_email: str
    subject: str
    description: str
    status: str
    notes: list[NoteResponse]


# =========================
# PUT /api/tickets/{ticket_id}
# =========================

class PutBody(BaseModel):
    status: Literal["Open", "In Progress", "Closed"]
    notes: str


class ResponsePutBody(BaseModel):
    success: bool
    updated_at: datetime
    
class BulkTicketBody(BaseModel):
    tickets: list[PostTicketBody]