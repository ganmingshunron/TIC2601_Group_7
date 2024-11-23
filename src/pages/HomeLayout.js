import { useEffect, useState, useRef } from "react";
import Header from "../components/Header";

export default function HomeLayout() {
    const [data, setData] = useState([]);
    const [productsPerPage] = useState(8); // Specify no. of products per page
    const [sortBy, setSortBy] = useState(''); // Sort by: Price, Vendor, Alphabetical
    const [sortOrder, setSortOrder] = useState('asc'); // Sort by: Asc/Desc
    const [currentPage, setCurrentPage] = useState(1); // Track current page
    const [totalPages, setTotalPages] = useState(0); // Total no. pages from backend
    const searchInputRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch data
    const fetchData = async () => {
    try {
        const response = await fetch(
        `http://localhost:3001/?page=${currentPage}&limit=${productsPerPage}&sortBy=${sortBy}&sortOrder=${sortOrder}&q=${searchQuery}`
        );
        
        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setData(data.items || []);
        setTotalPages(data.totalPages || 0);
        setCurrentPage(data.currentPage || 1);

    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    }
  };

    // Fetch new data
    useEffect(() => {
        fetchData();
    }, [currentPage, sortBy, sortOrder, searchQuery]);

    // Update sorting type
    const sortData = (type) => {
        setSortBy(type); // Update sort
        setCurrentPage(1); // Make user go back to first page
        console.log(`Sorting by: ${type}, Order: ${sortOrder}`);
        fetchData(); // Fetch data with new sorting
    };
    
    // Toggle Sort (asc/desc)
    const toggleSortOrder = () => {
        const newOrder = sortOrder === "asc" ? "desc" : "asc";
        setSortOrder(newOrder);
        console.log(`Toggled sorting order to: ${newOrder}`);
        fetchData(); // Fetch data with new toggle
    };

    // Pagination
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        console.log(`Page changed to: ${pageNumber}`);
    };

    // Search Address/Bar
    const handleSearch = () => {
        const searchValue = searchInputRef.current.value;
        setSearchQuery(searchValue);
        setCurrentPage(1);
        console.log(`Search initiated for: "${searchValue}"`);
    };

    return (
        <>
            <header>
                <Header/>
            </header>

            {/* Search and Sort button Cotainer*/}
            <div className="search-sort-container">
                <input type="text" ref={searchInputRef} placeholder="Search products"/>
                <button onClick={handleSearch}>Search</button>

                <div className="sort-buttons-container">
                    <button onClick={() => sortData("Pprice")}>SORT BY PRICE</button>
                    <button onClick={() => sortData("Vname")}>SORT BY VENDOR</button>
                    <button onClick={() => sortData("Pname")}>SORT BY ALPHABET</button>
                    <button onClick={toggleSortOrder}>
                        ({sortOrder === "asc" ? "Ascending" : "Descending"})
                    </button>
                </div>

            </div>

            {/* Tiles Container for Products */}
            <section className="tiles-container">
                {data && data.length > 0 ? (
                    data.map((product) => (
                    <div className="tile" key={product.Pname}>
                        <img src={product.Pimg} width="150px" height="150px" alt={product.Pname} />
                        <h2>{product.Pname}</h2>
                        <div className="inline-tile">
                            <p>Price: ${product.Pprice}</p>
                            <p>Stock: {product.Pstock}</p>
                        </div>
                        <p>Sold by: {product.Vname}</p>
                    </div>
                    ))
                ) : (
                    <p>No products found.</p>
                )}
            </section>

            {/* Pagination Buttons */}
            <div className="page-numbers">
                {Array.from({ length: totalPages }, (_, index) => (
                <button
                    key={index + 1}
                    onClick={() => paginate(index + 1)}
                    className={currentPage === index + 1 ? "active" : ""}
                >
                    {index + 1}
                </button>
                ))}
            </div>
        </>
    );
}
