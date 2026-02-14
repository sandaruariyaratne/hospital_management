// DoctorsPage.jsx - Shows doctors for selected category

import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getDoctorsByCategory } from '../api';
import DoctorCard from '../components/DoctorCard';

function DoctorsPage() {
  const { categoryId } = useParams(); // Get categoryId from URL
  const location = useLocation();
  const navigate = useNavigate();
  const categoryName = location.state?.categoryName || 'Doctors';

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, [categoryId]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const data = await getDoctorsByCategory(categoryId);
      setDoctors(data);
      setError(null);
    } catch (err) {
      setError('Failed to load doctors. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white py-8">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate('/')}
            className="mb-4 text-blue-100 hover:text-white flex items-center"
          >
            ← Back to Categories
          </button>
          <h1 className="text-3xl font-bold">{categoryName} Doctors</h1>
          <p className="text-blue-100 mt-2">
            Select a doctor to book an appointment
          </p>
        </div>
      </div>

      {/* Doctors List */}
      <div className="container mx-auto px-4 py-12">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading doctors...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-2xl mx-auto">
            <p className="font-bold">Error</p>
            <p>{error}</p>
            <button
              onClick={fetchDoctors}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* Doctors Grid */}
        {!loading && !error && doctors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.doctor_id} doctor={doctor} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && doctors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No doctors available in this category.
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Browse Other Categories
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorsPage;