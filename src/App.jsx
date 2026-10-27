import { supabase } from "./supabaseClient";

function App() {
  return (
    <div>
      <h1>Helpdesk Ticketing</h1>
      <p>Supabase connected: {supabase ? "Yes" : "No"}</p>
    </div>
  );
}

export default App;