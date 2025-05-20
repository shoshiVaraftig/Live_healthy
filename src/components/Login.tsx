import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // כאן תשלב קריאה ל-API שלך
    if (!username || !password) {
      setError("יש למלא שם משתמש וסיסמה");
      return;
    }
    // דוגמה: התחברות מוצלחת
    login(username);
    navigate("/personal-area");
  };

  return (
    <div>
      <h2>התחברות</h2>
      <form onSubmit={handleSubmit}>
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="שם משתמש" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="סיסמה" />
        <button type="submit">התחבר</button>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </form>
      <Link to="/register">להרשמה</Link>
    </div>
  );
};

export default Login;