import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

function Tickets({ role }) {
  const [tickets, setTickets] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [error, setError] = useState("");

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

  return (
    <div>
      <h2>New ticket</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Describe the problem"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button type="submit">Submit ticket</button>
      </form>
      {error && <p>{error}</p>}

      <h2>{isAgent ? "All tickets" : "My tickets"}</h2>
      {tickets.length === 0 && <p>No tickets yet.</p>}
      <ul>
        {tickets.map((t) => (
          <li key={t.id}>
            <strong>{t.title}</strong> [{t.priority}]
            {isAgent && <span> from {t.profiles?.email}</span>}
            <br />
            {t.description}
            <br />
            {isAgent ? (
              <select
                value={t.status}
                onChange={(e) => updateStatus(t.id, e.target.value)}
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            ) : (
              <span>Status: {t.status}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Tickets;