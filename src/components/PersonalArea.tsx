import React, { useEffect, useState } from "react";

interface User {
  username: string;
  email: string;
  age: number;
  gender: string;
  height: number;
  currentWeight: number;
  goalWeight: number;
  programLevel: string;
  dietaryPreferences: string;
  chatPersonality: string;
}

const PersonalArea: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // כאן תשלב את ה-API שלך
    fetch("/api/user/me") // כתובת לדוגמה, תעדכן לפי השרת שלך
      .then((res) => {
        if (!res.ok) throw new Error("שגיאה בטעינת נתוני משתמש");
        return res.json();
      })
      .then(setUser)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>טוען...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!user) return <div>לא נמצאו נתונים</div>;

  return (
    <section className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow text-right">
      <h2 className="text-2xl font-bold mb-4">שלום, {user.username}!</h2>
      <ul className="space-y-2">
        <li><strong>אימייל:</strong> {user.email}</li>
        <li><strong>גיל:</strong> {user.age}</li>
        <li><strong>מין:</strong> {user.gender}</li>
        <li><strong>גובה:</strong> {user.height} ס"מ</li>
        <li><strong>משקל נוכחי:</strong> {user.currentWeight} ק"ג</li>
        <li><strong>משקל יעד:</strong> {user.goalWeight} ק"ג</li>
        <li><strong>רמת תוכנית:</strong> {user.programLevel}</li>
        <li><strong>העדפות תזונה:</strong> {user.dietaryPreferences}</li>
        <li><strong>אופי הצ'אט:</strong> {user.chatPersonality}</li>
      </ul>
      <button className="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
        ערוך פרטים
      </button>
    </section>
  );
};

export default PersonalArea;