import axios from "axios";




const api = axios.create({
  baseURL: "https://crm-support-system-v5v4.onrender.com/api",
  headers: { "Content-Type": "application/json" },
});



export const getTickets = async (search = "", status = "") => {
  const { data } = await api.get("/tickets", {
    params: { search, status },
  });
  return data;
};

export const getTicketById = async (ticketId) => {
  const { data } = await api.get(`/tickets/${ticketId}`);
  return data;
};

export const createTicket = async (ticketData) => {
  const { data } = await api.post("/tickets", ticketData);
  return data;
};

export const updateTicket = async (ticketId, data) => {
  const { data: result } = await api.put(`/tickets/${ticketId}`, data);
  return result;
};