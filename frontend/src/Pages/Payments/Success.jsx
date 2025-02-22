import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const Success = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const navigate = useNavigate();

    useEffect(() => {
        const processPayment = async () => {
            if (!sessionId) {
                console.error("No session_id found");
                return;
            }

            try {
                const response = await fetch("http://127.0.0.1:8000/api/stripe/success", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ session_id: sessionId }),
                });

                const data = await response.json();

                if (data.success_url) {
                    navigate("/payment/complete"); // 成功画面へ遷移
                } else if (data.failure_url) {
                    navigate("/payment/failure"); // 失敗画面へ遷移
                }
            } catch (error) {
                console.error("Error processing payment:", error);
            }
        };

        processPayment();
    }, [sessionId, navigate]);

    return <div>Payment was successful!</div>
};

export default Success;
