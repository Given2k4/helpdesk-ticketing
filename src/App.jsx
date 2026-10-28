import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./Auth";

function App() {
  const [session, setSession] = useState(null);

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

  if (!session) return <Auth />;

  return (
    <div>
      <h1>Helpdesk Ticketing</h1>
      <p>Signed in as {session.user.email}</p>
      <button onClick={() => supabase.auth.signOut()}>Sign out</button>
    </div>
  );
}

export default App;