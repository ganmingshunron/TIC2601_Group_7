import React, { useState, useEffect } from 'react';
import './VendorList.css';

function VendorList() {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/vendors');
            const data = await response.json();
            setVendors(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching vendors:', error);
            setLoading(false);
        }
    };

    if (loading) return <div>Loading vendors...</div>;

    return (
        <div className="vendor-list">
            <h2>Vendor Management</h2>
            <div className="vendor-grid">
                {vendors.map((vendor) => (
                    <div key={vendor.Vid} className="vendor-card">
                        <h3>{vendor.Vname}</h3>
                        <p>{vendor.Vdesc}</p>
                        <p>Address: {vendor.Vaddress}</p>
                        <div className="product-count">
                            Products: {vendor.Products?.length || 0}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default VendorList; 