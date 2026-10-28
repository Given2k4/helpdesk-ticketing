function Dashboard({ tickets }) {
  const count = (field, value) =>
    tickets.filter((t) => t[field] === value).length;

  const stats = [
    { label: "Total", value: tickets.length },
    { label: "Open", value: count("status", "open") },
    { label: "In Progress", value: count("status", "in_progress") },
    { label: "Resolved", value: count("status", "resolved") },
    { label: "High priority", value: count("priority", "high") },
    { label: "Medium priority", value: count("priority", "medium") },
    { label: "Low priority", value: count("priority", "low") },
  ];

  return (
    <div className="stats">
      {stats.map((s) => (
        <div className="stat-card" key={s.label}>
          <div className="stat-value">{s.value}</div>
          <div className="stat-label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;