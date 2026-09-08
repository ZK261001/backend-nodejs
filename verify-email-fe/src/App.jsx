import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const query = new URLSearchParams(location.search);
    const token = query.get("token");
    const sentRef = useRef(false);

    const getCurrentUser = () => {
        const accessToken = localStorage.getItem("accessToken");

        fetch("http://localhost:3000/api/auth/me", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((result) => setCurrentUser(result.data));
    };

    useEffect(() => {
        // Không có token thì không cần gọi API
        if (!token) return;

        // StrictMode chạy effect 2 lần ở dev, chỉ cho gửi request 1 lần
        if (sentRef.current) return;
        sentRef.current = true;

        fetch("http://localhost:3000/api/auth/verify-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
        })
            .then((res) => {
                if (!res.ok) throw res;
                return res.json();
            })
            .then(() => {
                console.log("Xac minh tai khoan thanh cong");
                getCurrentUser();
                // Chuyen huong sang trang dang nhap
            })
            .catch(() => console.log("lien ket da het han hoac khong hop le"));
    }, [token]);

    useEffect(() => {
        getCurrentUser();
    }, []);

    const handleResendEmail = () => {
        const accessToken = localStorage.getItem("accessToken");

        fetch("http://localhost:3000/api/auth/resend-verify-email", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                if (!res.ok) throw res;
                return res.json();
            })
            .then(() => {
                console.log("Gui lai email xac thuc thanh cong");
                // Chuyen huong sang trang dang nhap
            })
            .catch((error) => console.log("loi ", error));
    };

    if (!currentUser) return <div>Loading...</div>;

    return (
        <>
            {!currentUser.verified_at && (
                <p>
                    Chúng tôi đã gửi email xác thực tới {currentUser.email}. Vui
                    lòng kiểm tra inbox hoặc spam để xác thực.
                    <a href="#!" onClick={handleResendEmail}>
                        Gửi lại
                    </a>
                </p>
            )}
            <h1>Home page</h1>
        </>
    );
}

export default App;
