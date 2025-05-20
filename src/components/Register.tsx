import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
   const navigate = useNavigate();
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError("יש למלא שם משתמש וסיסמה");
      return;
    }

    setLoading(true);
    try {
          const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error("שם משתמש או סיסמה שגויים");
      // כאן אפשר לשמור טוקן ב-localStorage אם צריך
      navigate("/personal-area");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }};
    
  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">התחברות</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">שם משתמש</label>
          <input
            className="w-full border rounded px-3 py-2"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
          />
        </div>
        <div>
          <label className="block mb-1">סיסמה</label>
          <input
            className="w-full border rounded px-3 py-2"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        {error && <div className="text-red-600">{error}</div>}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          disabled={loading}
        >
          {loading ? "מתחבר..." : "התחבר"}
        </button>
      </form>
      <div className="mt-4 text-center">
        אין לך חשבון?{" "}
        <Link to="/register" className="text-blue-600 underline">
          להרשמה
        </Link>
      </div>
    </div>
  );
};

 
        export default Login;