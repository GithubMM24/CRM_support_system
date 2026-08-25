import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  ArrowLeft,
  Ticket,
  Users,
  Clock3,
  CheckCircle2,
  Mail,
  Calendar,
  Save,
  Send,
  RefreshCw,
  X,
} from "lucide-react";
import {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
} from "./api";

const STATUSES = ["Open", "In Progress", "Closed"];

const STATUS_CLASS = {
  Open: "status-open",
  "In Progress": "status-progress",
  Closed: "status-closed",
};

const STAT_CARDS = [
  { label: "Total Tickets", icon: Ticket, key: "total" },
  { label: "Open", icon: Users, key: "open" },
  { label: "In Progress", icon: Clock3, key: "progress" },
  { label: "Closed", icon: CheckCircle2, key: "closed" },
];

function StatusBadge({ status }) {
  return (
    <span className={`status-badge ${STATUS_CLASS[status] || ""}`}>
       <span>{status || "Open"}</span>
    </span>
  );
}

function formatDate(date) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(date) {
  if (!date) return "-";

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const openTicket = (ticketId) => {
    setSelectedTicketId(ticketId);
    setPage("details");
  };

  const goDashboard = () => {
    setSelectedTicketId(null);
    setPage("dashboard");
  };

  return (
    <div className="app">
      <header className="header">
        <div className="brand" onClick={goDashboard}>
          <div className="brand-icon">
            <Ticket size={20} />
          </div>

          <div>
            <h1>SupportDesk</h1>
            <p>Customer Support CRM</p>
          </div>
        </div>

        <div className="header-actions">
          <button
            className={`nav-button ${page === "dashboard" ? "active" : ""}`}
            onClick={goDashboard}
          >
            Dashboard
          </button>

          <button className="primary-button" onClick={() => setPage("create")}>
            <Plus size={18} />
            New Ticket
          </button>
        </div>
      </header>

      <main className="main-content">
        {page === "dashboard" && <Dashboard openTicket={openTicket} />}

        {page === "create" && (
          <CreateTicket goBack={goDashboard} onSuccess={goDashboard} />
        )}

        {page === "details" && (
          <TicketDetails
            ticketId={selectedTicketId}
            goBack={goDashboard}
          />
        )}
      </main>
    </div>
  );
}

function Dashboard({ openTicket }) {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const Datapack = [
  {
    id: 1,
    ticket_id: "TKTON65a4wJ",
    customer_name: "Aarav Sharma",
    customer_email: "aarav.sharma@example.com",
    subject: "Unable to log in",
    status: "Open",
    created_at: "2026-08-23T13:40:03"
  },
  {
    id: 2,
    ticket_id: "TKTveQbuGgS",
    customer_name: "Priya Patel",
    customer_email: "priya.patel@example.com",
    subject: "Payment failed",
    status: "Open",
    created_at: "2026-08-23T13:40:03"
  },
  {
    id: 3,
    ticket_id: "TKTwj5GsPmE",
    customer_name: "Rahul Verma",
    customer_email: "rahul.verma@example.com",
    subject: "Account locked",
    status: "Open",
    created_at: "2026-08-23T13:40:03"
  },
  {
    id: 4,
    ticket_id: "TKTtuj09H03",
    customer_name: "Sneha Kapoor",
    customer_email: "sneha.kapoor@example.com",
    subject: "Incorrect billing amount",
    status: "Open",
    created_at: "2026-08-23T13:40:03"
  },
  {
    id: 5,
    ticket_id: "TKT1QGhYLwO",
    customer_name: "Vikram Singh",
    customer_email: "vikram.singh@example.com",
    subject: "Password reset email not received",
    status: "Open",
    created_at: "2026-08-23T13:40:03"
  },
  {
    id: 6,
    ticket_id: "TKTJOkJ8GuM",
    customer_name: "Ananya Iyer",
    customer_email: "ananya.iyer@example.com",
    subject: "Cannot update profile",
    status: "Open",
    created_at: "2026-08-23T13:40:03"
  },
  {
    id: 7,
    ticket_id: "TKT560guZqg",
    customer_name: "Rohan Mehta",
    customer_email: "rohan.mehta@example.com",
    subject: "Application is slow",
    status: "Open",
    created_at: "2026-08-23T13:40:03"
  },
  {
    id: 8,
    ticket_id: "TKTSBjZYcD9",
    customer_name: "Kavya Nair",
    customer_email: "kavya.nair@example.com",
    subject: "Feature request",
    status: "Open",
    created_at: "2026-08-23T13:40:03"
  },
  {
    id: 9,
    ticket_id: "TKTbZe6M51O",
    customer_name: "Arjun Reddy",
    customer_email: "arjun.reddy@example.com",
    subject: "Subscription cancellation issue",
    status: "Open",
    created_at: "2026-08-23T13:40:03"
  },
  {
    id: 10,
    ticket_id: "TKT78VfpbOj",
    customer_name: "Neha Joshi",
    customer_email: "neha.joshi@example.com",
    subject: "Notification problem",
    status: "Open",
    created_at: "2026-08-23T13:40:03"
  },
  {
    id: 11,
    ticket_id: "TKT4mjzMoBb",
    customer_name: "hank",
    customer_email: "hank@gmail.com",
    subject: "cannot see the content",
    status: "Closed",
    created_at: "2026-08-24T15:32:43"
  }
]


  useEffect(() => {
    const timeout = setTimeout(loadTickets, 300);
    return () => clearTimeout(timeout);
  }, [search, status]);

  async function loadTickets() {
    try {
      setLoading(true);
      setError("");

      const data = await getTickets(search, status);
      setTickets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.detail ||
          error.message ||
          "Unable to load tickets."
      );
    } finally {
      setLoading(false);
    }
  }

  const counts = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "Open").length,
    progress: tickets.filter((t) => t.status === "In Progress").length,
    closed: tickets.filter((t) => t.status === "Closed").length,
  };

  return (
    <>
      <section className="page-heading">
        <div>
          <p className="eyebrow">SUPPORT MANAGEMENT</p>
          <h2>Support Tickets</h2>
          <p>Track, manage and resolve customer support requests.</p>
        </div>

        <button
          className="refresh-button"
          onClick={loadTickets}
          disabled={loading}
        >
          <RefreshCw size={17} className={loading ? "spin" : ""} />
          Refresh
        </button>
      </section>

      <section className="stats-grid">
        {STAT_CARDS.map(({ label, icon: Icon, key }) => (
          <div className="stat-card" key={key}>
            <div className="stat-icon">
              <Icon size={20} />
            </div>

            <div>
              <p>{label}</p>
              <h3>{counts[key]}</h3>
            </div>
          </div>
        ))}
      </section>

      <section className="toolbar">
        <div className="search-wrapper">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search by name, email, ticket ID or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <button
              className="clear-search"
              onClick={() => setSearch("")}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Statuses</option>
          {STATUSES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </section>

      {error && (
        <div className="error-box">
          <strong>Unable to load tickets.</strong>
          <span>{error}</span>
          <button onClick={loadTickets}>Try Again</button>
        </div>
      )}

      {loading && (
        <div className="loading-state">
          <div className="loader" />
          <p>Loading tickets...</p>
        </div>
      )}
      {!loading && !error && (
        <section className="table-card">
          <div className="table-header">
            <h3>All Tickets</h3>
            <p>
              {tickets.length} ticket{tickets.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {
            tickets.length === 0 ? (
            <div className="empty-state">
              <Ticket size={34} />
              <h3>No tickets found</h3>
              <p>Try changing your search or status filter.</p>
            </div>
          ) :(
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Index</th>
                    <th>Ticket ID</th>
                    <th>Customer</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                {tickets.map((ticket, index) => (
                  <tr key={ticket.ticket_id}>
                    
                    <td className="index-cell" data-label="Index">
                      <span className="ticket-id">
                        {ticket.id}
                      </span>
                    </td>

                    <td data-label="Ticket ID">
                      <span className="ticket-id">
                        {ticket.ticket_id}
                      </span>
                    </td>

                    <td data-label="Customer">
                      <div className="customer-cell">
                        <strong>{ticket.customer_name}</strong>

                        {ticket.customer_email && (
                          <span>{ticket.customer_email}</span>
                        )}
                      </div>
                    </td>

                    <td className="subject-cell" data-label="Subject">
                      {ticket.subject}
                    </td>

                    <td data-label="Status">
                      <StatusBadge status={ticket.status} />
                    </td>

                    <td className="date-cell" data-label="Created">
                      {formatDate(ticket.created_at)}
                    </td>

                    <td className="action-cell">
                      <button
                        className="view-button"
                        onClick={() => openTicket(ticket.ticket_id)}
                      >
                        View
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          )
          
          
          }
        </section>
      )}
    </>
  );
}

function CreateTicket({ goBack, onSuccess }) {
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    subject: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = ({ target: { name, value } }) => {
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const result = await createTicket(formData);

      setSuccess(
        `Ticket ${result.ticket_id || ""} created successfully.`
      );

      setTimeout(onSuccess, 1000);
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.detail ||
          error.message ||
          "Unable to create ticket."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="form-page">
      <button className="back-button" onClick={goBack}>
        <ArrowLeft size={17} />
        Back to Tickets
      </button>

      <div className="form-container">
        <div className="page-heading">
          <div>
            <p className="eyebrow">CREATE SUPPORT REQUEST</p>
            <h2>Create New Ticket</h2>
            <p>Add a new customer support request to the system.</p>
          </div>
        </div>

        <form className="ticket-form" onSubmit={handleSubmit}>
          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}

          <div className="form-grid">
            <div className="form-group">
              <label>Customer Name</label>
              <input
                required
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                placeholder="Enter customer name"
              />
            </div>

            <div className="form-group">
              <label>Customer Email</label>
              <input
                required
                type="email"
                name="customer_email"
                value={formData.customer_email}
                onChange={handleChange}
                placeholder="customer@example.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Issue Title</label>
            <input
              required
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Briefly describe the issue"
            />
          </div>

          <div className="form-group">
            <label>Issue Description</label>
            <textarea
              required
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the customer's issue in detail..."
              rows="7"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="secondary-button" onClick={goBack}>
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              <Send size={17} />
              {loading ? "Creating..." : "Create Ticket"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function TicketDetails({ ticketId, goBack }) {
  const [ticket, setTicket] = useState([]);
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadTicket();
  }, [ticketId]);

  async function loadTicket() {
    try {
      setLoading(true);
      setError("");

      const data = await getTicketById(ticketId);

      setTicket(data);
      setStatus(data.status || "Open");
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.detail ||
          error.message ||
          "Unable to load ticket details."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const result = await updateTicket(ticketId, {
        status,
        notes: note,
      });

      setTicket((previous) => ({
        ...previous,
        status,
        updated_at: result.updated_at || previous.updated_at,
      }));

      setNote("");
      setMessage("Ticket updated successfully.");

      await loadTicket();
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.detail ||
          error.message ||
          "Unable to update ticket."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loader" />
        <p>Loading ticket details...</p>
      </div>
    );
  }

  if (error && !ticket) {
    return (
      <>
        <BackButton onClick={goBack} />

        <div className="error-box">
          <strong>Ticket could not be loaded.</strong>
          <span>{error}</span>
        </div>
      </>
    );
  }

  const customerInfo = [
    { label: "Name", value: ticket.customer_name, icon: Users },
    { label: "Email", value: ticket.customer_email, icon: Mail },
    {
      label: "Created",
      value: formatDateTime(ticket.created_at),
      icon: Calendar,
    },
  ];

  return (
    <section className="details-page">
      <BackButton onClick={goBack} />

      <div className="details-layout">
        <div className="details-main">
          <section className="detail-card">
            <div className="ticket-detail-header">
              <div>
                <span className="ticket-id">{ticket.ticket_id}</span>
                <h2>{ticket.subject}</h2>
              </div>

              <StatusBadge status={ticket.status} />
            </div>

            <div className="detail-divider" />

            <h3>Issue Description</h3>
            <p className="description">{ticket.description}</p>
          </section>

          <section className="detail-card">
            <h3>Notes & Comments</h3>

            {!ticket.notes || ticket.notes.length === 0 ? (
              <div className="no-notes">
                No notes or comments have been added yet.
              </div>
            ) : (
              <div className="notes-list">
                {ticket.notes.map((item, index) => (
                  <div className="note-item" key={item.id || index}>
                    {/* <p>{item.note_text || item.notes || item}</p> */}
                    <p>{item.note_text}</p>

                    {item.created_at && (
                      <span>{formatDateTime(item.created_at)}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="details-sidebar">
          <section className="sidebar-card">
            <h3>Customer Information</h3>

            {customerInfo.map(({ label, value, icon: Icon }) => (
              <div className="info-row" key={label}>
                <div className="info-icon">
                  <Icon size={18} />
                </div>

                <div>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              </div>
            ))}
          </section>

          <section className="sidebar-card">
            <h3>Update Ticket</h3>

            {message && (
              <div className="form-success small-message">{message}</div>
            )}

            {error && (
              <div className="form-error small-message">{error}</div>
            )}

            <div className="form-group">
              <label>Ticket Status</label>

              <select className="selectop"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Add Note / Comment</label>

              <textarea
                rows="5"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Write an internal note or update..."
              />
            </div>

            <button
              className="primary-button save-button"
              onClick={handleSave}
              disabled={saving}
            >
              <Save size={17} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </section>
        </aside>
      </div>
    </section>
  );
}

function BackButton({ onClick }) {
  return (
    <button className="back-button" onClick={onClick}>
      <ArrowLeft size={17} />
      Back to Tickets
    </button>
  );
}