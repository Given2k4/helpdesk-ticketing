import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Dashboard from "./Dashboard";

const STATUS_LABELS = {
  open: "Open",
  in_progress: "In progress",
  resolved: "Resolved",
};

function Tickets({ role }) {
  const [tickets, setTickets] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  async function loadTickets() {
    const { data, error } = await supabase
      .from("tickets")
      .select("*, profiles(email)")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setTickets(data);
  }

  useEffect(() => {
    loadTickets();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const { error } = await supabase
      .from("tickets")
      .insert({ title, description, priority });
    if (error) {
      setError(error.message);
      return;
    }
    setTitle("");
    setDescription("");
    setPriority("medium");
    loadTickets();
  }

  async function updateStatus(id, status) {
    setError("");
    const { error } = await supabase
      .from("tickets")
      .update({ status })
      .eq("id", id);
    if (error) setError(error.message);
    loadTickets();
  }

  const isAgent = role === "agent";

  const visibleTickets = tickets.filter(
    (t) =>
      (statusFilter === "all" || t.status === statusFilter) &&
      (priorityFilter === "all" || t.priority === priorityFilter)
  );

  return (
    <div>
      <Dashboard tickets={tickets} />

      <div className="columns">
        <form className="panel new-ticket" onSubmit={handleSubmit}>
          <h2>New ticket</h2>
          <label>
            Title
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What is not working?"
              required
            />
          </label>
          <label>
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What happened, and what have you tried?"
            />
          </label>
          <label>
            Priority
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
          <button className="primary" type="submit">
            Submit ticket
          </button>
          {error && <p className="error">{error}</p>}
        </form>

        <section>
          <div className="section-head">
            <h2>{isAgent ? "All tickets" : "My tickets"}</h2>
            <div className="filters">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All statuses</option>
                <option value="open">Open</option>
                <option value="in_progress">In progress</option>
                <option value="resolved">Resolved</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all">All priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          <p className="muted small">
            Showing {visibleTickets.length} of {tickets.length} tickets
          </p>

          {tickets.length === 0 && (
            <p className="muted" style={{ marginTop: 16 }}>
              No tickets yet. Submit one using the form.
            </p>
          )}
          {tickets.length > 0 && visibleTickets.length === 0 && (
            <p className="muted" style={{ marginTop: 16 }}>
              No tickets match these filters. Set them back to "All" to see
              everything.
            </p>
          )}

          <ul className="ticket-list">
            {visibleTickets.map((t) => (
              <li key={t.id} className={`ticket priority-${t.priority}`}>
                <div className="ticket-top">
                  <h3>{t.title}</h3>
                  <span className="priority-tag">{t.priority} priority</span>
                </div>
                {isAgent && (
                  <p className="muted small">From {t.profiles?.email}</p>
                )}
                {t.description && <p className="desc">{t.description}</p>}
                <div className="ticket-foot">
                  <span className="muted small">
                    {new Date(t.created_at).toLocaleDateString()}
                  </span>
                  {isAgent ? (
                    <select
                      className={`status-select status-${t.status}`}
                      value={t.status}
                      onChange={(e) => updateStatus(t.id, e.target.value)}
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  ) : (
                    <span className={`pill status-${t.status}`}>
                      {STATUS_LABELS[t.status]}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default Tickets;