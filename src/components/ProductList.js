import React, { useState, useEffect } from 'react';
import './ProductList.css';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/products');
            const data = await response.json();
            setProducts(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    };

    if (loading) return <div>Loading products...</div>;

    return (
        <div className="product-list">
            <h2>Product Management</h2>
            <div className="product-grid">
                {products.map((product) => (
                    <div key={product.Pid} className="product-card">
                        <div className="product-image">
                            {product.Pimg ? (
                                <img src={product.Pimg} width='150px' height='150px' alt={product.Pname} />
                            ) : (
                                <div className="no-image">No Image</div>
                            )}
                        </div>
                        <h3>{product.Pname}</h3>
                        <p>{product.Pdesc}</p>
                        <p>Price: ${product.Pprice}</p>
                        <p>Stock: {product.Pstock}</p>
                        <p>Category: {product.Pcat}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductList; 