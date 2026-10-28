import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./Auth";
import Tickets from "./Tickets";

function App() {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState("user");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single()
      .then(({ data }) => {
        if (data) setRole(data.role);
      });
  }, [session]);

  if (!session) return <Auth />;

  return (
    <div>
      <h1>Helpdesk Ticketing</h1>
      <p>
        Signed in as {session.user.email} ({role})
      </p>
      <button onClick={() => supabase.auth.signOut()}>Sign out</button>
      <Tickets key={role} role={role} />
    </div>
  );
}

export default App;