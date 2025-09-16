import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService"; // ייבוא שירות האימות שלנו
import type { PersonalArea } from "../types/personal"; // ייבוא PersonalArea

// ייבוא קובץ ה-CSS החדש
import './Register.css';

const Register: React.FC = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState<PersonalArea & { confirmPassword?: string }>({
        id: 0, 
        username: "",
        password: "",
        email: "",
        phone: "",
        gender: 0,
        birthDate: "2000-01-01T00:00:00.000Z",
        programLevel: 0,
        startWeight: 0,
        goalWeight: 0,
        goalDate: "2025-12-31T00:00:00.000Z",
        startDate: new Date().toISOString(),
        weightTracing: {
            id: 0,
            userId: 0,
            weight: 0,
            date: new Date().toISOString()
        },
        dietaryPreference: {
            id: 0,
            userId: 0,
            foodName: "",
            like: 0
        },
        chatPersonality: "",
        confirmPassword: "", 
    });

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value,
        }));
    };

    const handleDateChange = (name: keyof PersonalArea, date: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: date,
        }));
    };

    const handleNestedChange = (
        parentName: keyof PersonalArea,
        childName: string,
        value: string | number
    ) => {
        setFormData((prev) => ({
            ...prev,
            [parentName]: {
                ...(prev[parentName] as object), 
                [childName]: value,
            },
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
                throw new Error("יש למלא את כל השדות הבסיסיים.");
            }

            if (formData.password !== formData.confirmPassword) {
                throw new Error("הסיסמאות אינן תואמות.");
            }

            const dataToSend: PersonalArea = {
                id: formData.id,
                username: formData.username,
                password: formData.password,
                email: formData.email,
                phone: formData.phone,
                gender: formData.gender,
                birthDate: formData.birthDate,
                programLevel: formData.programLevel,
                startWeight: formData.startWeight,
                goalWeight: formData.goalWeight,
                goalDate: formData.goalDate,
                startDate: formData.startDate,
                weightTracing: formData.weightTracing,
                dietaryPreference: formData.dietaryPreference,
                chatPersonality: formData.chatPersonality,
            };
            
            console.log("dataToSend object:", dataToSend);
            console.log("Email value in dataToSend:", dataToSend.email);
            
            await authService.register(dataToSend);

            alert('הרשמה והתחברות מוצלחות!');
            navigate("/personal-area");

        } catch (err: any) {
            console.error("Registration error:", err);
            if (err.message.includes("409")) {
                setError("שם המשתמש או האימייל כבר קיימים.");
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("אירעה שגיאה בתהליך ההרשמה.");
            }
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="register-page-wrapper">
            <div className="register-container">
                <div className="register-header">
                    <h2 className="register-title">הרשמה לProDiet</h2>
                    <p className="register-subtitle">צור חשבון חדש והתחל את המסע שלך</p>
                </div>

                <form className="register-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username" className="form-label">
                            שם משתמש
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            value={formData.username}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="הכנס שם משתמש"
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            כתובת אימייל
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="your@email.com"
                            autoComplete="off"
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
                                value={formData.password}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="הכנס סיסמה"
                                autoComplete="new-password"
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

                    <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label">
                            אימות סיסמה
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            required
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="הכנס סיסמה שוב"
                            autoComplete="new-password"
                        />
                    </div>

                    {error && (
                        <div className="error-message" role="alert">
                            <span className="error-message-text">{error}</span>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="submit-button"
                        >
                            {loading ? (
                                <svg className="loading-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : "הירשם"}
                        </button>
                    </div>
                </form>

                <div className="login-link-container">
                    <p className="login-link-text">
                        כבר יש לך חשבון?{" "}
                        <Link to="/login" className="login-link">
                            התחבר כאן
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;