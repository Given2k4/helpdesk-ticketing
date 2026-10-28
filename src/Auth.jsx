import { useState } from "react";
import { supabase } from "./supabaseClient";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSignIn(e) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setMessage(error.message);
  }

  async function handleSignUp() {
    const { error } = await supabase.auth.signUp({ email, password });
    setMessage(error ? error.message : "Account created. You are signed in.");
  }

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={handleSignIn}>
        <h1>Helpdesk</h1>
        <p className="muted">Sign in to report a problem or work the queue.</p>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            required
          />
        </label>
        <div className="auth-actions">
          <button className="primary" type="submit">
            Sign in
          </button>
          <button className="ghost" type="button" onClick={handleSignUp}>
            Create account
          </button>
        </div>
        {message && <p className="auth-message">{message}</p>}
      </form>
    </div>
  );
}

export default Auth;