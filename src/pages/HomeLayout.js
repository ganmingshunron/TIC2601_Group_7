import { useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";

/* Refresh Function */ 
const handleRefresh = () => {
    window.location.reload();  // Reloads the entire page
  };

/* Generate Header Function */ 
function Header(){
    return(
        <div className = "inline">
            <button onClick={handleRefresh}>Home</button>
            <h1> Welcome to Shophee!</h1>
            <Link to='/Login'><button >Login</button></Link>
        </div>
    )
}


export default function HomeLayout(){
    const [data, setData] = useState([]);
    const [sortedData, setSortedData] = useState([]);   /* New state to hold sorted data */ 
    const [sortType, setSortType] = useState("");       /* Track the current sort type */
    const [currentPage, setCurrentPage] = useState(1);  /* Current page for pagination */
    const [productsPerPage] = useState(8);              /* Number of products per page */


    const fetchdata = async() => {
        const response = await fetch('http://localhost:3001/home');
        const data = await response.json();
        setData(data);
        setSortedData(data);    /* Set default data for initial load */
        console.log(data);
    }
    useEffect(() => {
        fetchdata();
    },[])

    /* Sorting Function */
    const sortData = (type) => {
    let sorted = [...data]; /* Copy data array */

    switch (type) {
        case "price":
            sorted.sort((a, b) => a.Pprice - b.Pprice); /* Sort Price */
            break;
        case "vendor":
            sorted.sort((a, b) => a.Vname.localeCompare(b.Vname)); /* Sort Vendor */
            break;
        case "alphabet":
            sorted.sort((a, b) => a.Pname.localeCompare(b.Pname)); /* Sort Name */
            break;
        default:
            break;
        }

        setSortedData(sorted); /* Set current sorted data */
        setSortType(type); /* Set current sorted data type */
    };


    /* Get current page's products */
    const indexOfLastProduct = currentPage * productsPerPage; /* index of last product */
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage; /* index of first product */
    const currentProducts = sortedData.slice(indexOfFirstProduct, indexOfLastProduct); /* get products for current page */

    /* Change page */
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    /* Pagination Controls */
    const totalPages = Math.ceil(sortedData.length / productsPerPage); /* Calculate total pages */

    return(
        <>
            <header>
                <Header />
            </header>

            <div className="sort-buttons-container">
                <button onClick={() => sortData("price")}>SORT BY PRICE</button>
                <button onClick={() => sortData("vendor")}>SORT BY VENDOR</button>
                <button onClick={() => sortData("alphabet")}>SORT BY ALPHABET</button>
            </div>

            <section className="tiles-container"> {/*Container to contain tiles*/}
                {
                    currentProducts.map(function (data) {
                        return (
                            <div className="tile" key={data.Pname}>
                                <img src={data.Pimg} width="150px" height="150px" alt={data.Pname} />
                                <h2>{data.Pname}</h2>
                                <div className="inline-tile">
                                    <p>Price: ${data.Pprice}</p>
                                    <p>Stock: {data.Pstock}</p>
                                </div>
                                <p>Sold by: {data.Vname}</p>
                            </div>
                        );
                    })
                }
            </section>

            {/* Page Number Buttons */}
            <div className="page-numbers">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button key={index + 1}
                    onClick={() => paginate(index + 1)}
                    className={currentPage === index + 1 ? 'active' : ''}>
                    {index + 1}
                    </button>
                ))}
            </div>

        </>
    )
}