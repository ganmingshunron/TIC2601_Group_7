import { Link } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
        <ul>
          <li><Link to="/vendors">Vendors</Link></li>
          <li><Link to="/products">Products</Link></li>
          <li><Link to="/customers">Customers</Link></li>
        </ul>
    </div>
  );
}