function Dashboard({ tickets }) {
  const count = (field, value) =>
    tickets.filter((t) => t[field] === value).length;

  const total = tickets.length;

  const statuses = [
    { key: "open", label: "open", color: "var(--open)" },
    { key: "in_progress", label: "in progress", color: "var(--progress)" },
    { key: "resolved", label: "resolved", color: "var(--resolved)" },
  ];

  const priorities = [
    { key: "high", label: "high", color: "var(--high)" },
    { key: "medium", label: "medium", color: "var(--medium)" },
    { key: "low", label: "low", color: "var(--low)" },
  ];

  return (
    <section className="overview">
      <div className="overview-head">
        <div>
          <div className="total">{total}</div>
          <div className="muted">
            {total === 1 ? "ticket" : "tickets"} in total
          </div>
        </div>
        <div className="priority-list">
          {priorities.map((p) => (
            <span key={p.key}>
              <span className="dot" style={{ background: p.color }} />
              {count("priority", p.key)} {p.label}
            </span>
          ))}
        </div>
      </div>

      <div className="workload" aria-label="Tickets by status">
        {statuses.map((s) => {
          const n = count("status", s.key);
          return n > 0 ? (
            <div
              key={s.key}
              style={{ flex: n, background: s.color }}
              title={`${n} ${s.label}`}
            />
          ) : null;
        })}
      </div>

      <div className="legend">
        {statuses.map((s) => (
          <span key={s.key}>
            <span className="dot" style={{ background: s.color }} />
            {count("status", s.key)} {s.label}
          </span>
        ))}
      </div>
    </section>
  );
}

export default Dashboard;