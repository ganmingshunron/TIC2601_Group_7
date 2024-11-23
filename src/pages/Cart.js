import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";

export default function Cart() {
    const location = useLocation();
    const userID = location.state?.userID || 0;
    const [data, setData] = useState([]);
    const [Cname, setCname] = useState(""); // Track Cname; Mainly for aesthetics
    const [showPopUp, setShowPopUp] = useState(false); // Track Popup Logic
    const [transactionMessage, setTransactionMessage] = useState(""); // Custom msg

    // Fetch data
    const fetchData = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:3001/cart?Cid=${userID}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            console.log(`http://localhost:3001/cart?Cid=${userID}`);

            setData(result.resultCart || []);
            if (result.resultCart && result.resultCart.length > 0) {
                setCname(result.resultCart[0].Cname);
            }
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    }, [userID]);

    // Checkout Function; Translate to backend
    const handleCheckout = async () => {
        try {
            const response = await fetch("http://localhost:3001/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ Cid: userID, cartItems: data })
            });

            const result = await response.json();

            if (result!==null) {
                setTransactionMessage("Transaction successful!");
                setShowPopUp(true); 
                setData([]);

            } else {
                setTransactionMessage("Transaction failed! Please try again.");
                setShowPopUp(true);
            }

        } catch (error) {
            console.error("Error during checkout:", error);
            setTransactionMessage("An error occurred. Please try again later.");
            setShowPopUp(true);
        }
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <>
            <header>
                <div className="inline">
                    <a href="/"><button>Home</button></a>
                </div>
                <div className="inline">
                    <h1>{Cname ? `${Cname}'s Cart` : `${userID}'s Cart`}</h1>
                </div>
            </header>

            <main>
                {data.length === 0 ? (
                    <p>Your cart is empty!</p>
                ) : (
                    <ul>
                        {data.map((item, index) => (
                            <li key={index}>
                                <h2>{item.Pname}</h2>
                                <p>Price: ${item.Pprice}</p>
                                <p>Quantity: {item.Quantity}</p>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Checkout possible only if cart not empty */}
                {data.length > 0 && (
                    <button onClick={handleCheckout}>Checkout</button>
                )}

                {showPopUp && (
                    <div className="pop-up">
                        <p>{transactionMessage}</p>
                        <button onClick={() => setShowPopUp(false)}>Close</button>
                    </div>
                )}
            </main>
        </>
    );
}

