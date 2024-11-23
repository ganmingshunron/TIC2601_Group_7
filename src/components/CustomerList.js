import React, { useState, useEffect } from 'react';
import './CustomerList.css';

function CustomerList() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/customers');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setCustomers(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching customers:', error);
            setError(error.message);
            setLoading(false);
        }
    };

    if (loading) return <div>Loading customers...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!customers.length) return <div>No customers found</div>;

    return (
        <div className="customer-list">
            <h2>Customer Management</h2>
            <div className="customer-grid">
                {customers.map((customer) => (
                    <div key={customer.Cid} className="customer-card">
                        <h3>{customer.Cname}</h3>
                        <p>Phone: {customer.Cphone}</p>
                        <p>Address: {customer.Caddress}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CustomerList; 