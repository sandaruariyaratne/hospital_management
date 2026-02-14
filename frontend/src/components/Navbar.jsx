// Navbar.jsx - Navigation Bar Component

import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-blue-300 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-4xl font-bold">
            🏥 Hospital Management
          </Link>
          <div className="space-x-6">
            <Link to="/" className="hover:text-blue-200 transition">
              Home
            </Link>
            <Link to="/" className="hover:text-blue-200 transition">
              Book Appointment
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;