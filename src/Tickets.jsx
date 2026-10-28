import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [error, setError] = useState("");

  async function loadTickets() {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
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

      <h2>My tickets</h2>
      {tickets.length === 0 && <p>No tickets yet.</p>}
      <ul>
        {tickets.map((t) => (
          <li key={t.id}>
            <strong>{t.title}</strong> [{t.priority}] ({t.status})
            <br />
            {t.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Tickets;