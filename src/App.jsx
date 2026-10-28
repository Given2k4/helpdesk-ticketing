import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./Auth";
import Tickets from "./Tickets";

function App() {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        if (!newSession) setRole(null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    setRole(null);
    supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single()
      .then(({ data }) => {
        setRole(data?.role ?? "user");
      });
  }, [session]);

  if (!session) return <Auth />;

  if (!role) {
    return <p className="muted" style={{ padding: 24 }}>Loading...</p>;
  }

  return (
    <div className="shell">
      <header className="topbar">
        <h1>Helpdesk</h1>
        <div className="user">
          <span className="email">{session.user.email}</span>
          <span className={`role role-${role}`}>{role}</span>
          <button className="ghost" onClick={() => supabase.auth.signOut()}>
            Sign out
          </button>
        </div>
      </header>
      <Tickets key={role} role={role} />
    </div>
  );
}

export default App;