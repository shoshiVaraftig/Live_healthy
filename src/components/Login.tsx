// src/components/Login.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService"; // ייבוא שירות האימות שלנו

// ייבוא קובץ ה-CSS החדש
import './Login.css';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false); // הוספת מצב טעינה
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true); // התחל טעינה

        // Validation
        if (!username || !password) {
            setError("יש למלא שם משתמש וסיסמה.");
            setLoading(false);
            return;
        }

        try {
            // קריאה לפונקציית ההתחברות בשירות האימות
            // ה-authService יטפל בקריאת ה-API ובעדכון ה-Zustand store (שמירת טוקן, פרטי משתמש וכו')
            await authService.login({ username, password });
            console.log(username);
            alert('התחברות מוצלחת!');
            navigate("/personal-area"); // ניתוב לאזור האישי
        } catch (err: any) { // שינוי ל-any כדי לטפל ב-Error אובייקטים
            console.error("Login error:", err);
            setError("התחברות נכשלה. אנא בדוק את פרטי ההתחברות שלך.");
        } finally {
            setLoading(false); // סיים טעינה
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="login-page-wrapper">
            <div className="login-container">
                <div className="login-header">
                    <h2 className="login-title">
                        התחברות לProDiet
                    </h2>
                </div>
                
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username" className="form-label">
                            שם משתמש
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="form-input"
                            placeholder="הכנס שם משתמש"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            סיסמה
                        </label>
                        <div className="password-input-wrapper">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-input"
                                placeholder="הכנס סיסמה"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="toggle-password-button"
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="error-message" role="alert">
                            <span className="error-message-text">{error}</span>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading} // כפתור מנוטרל בזמן טעינה
                            className="submit-button"
                        >
                            {loading ? ( // הצג ספינר בזמן טעינה
                                <svg className="loading-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : "התחבר"}
                        </button>
                    </div>
                </form>
                
                <div className="register-link-container">
                    <p className="register-link-text">
                        אין לך חשבון?{" "}
                        <Link to="/register" className="register-link">
                            הירשם עכשיו
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;