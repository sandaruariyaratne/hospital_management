// DoctorCard.jsx - Displays a single doctor card

import { useNavigate } from 'react-router-dom';

function DoctorCard({ doctor }) {
  const navigate = useNavigate();

  const handleBooking = () => {
    // Navigate to booking page with doctor info
    navigate(`/booking/${doctor.doctor_id}`, {
      state: { doctor }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 border-2 border-gray-200">
      <div className="flex items-start space-x-4">
        {/* Doctor Avatar */}
        <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center text-3xl flex-shrink-0">
          👨‍⚕️
        </div>
        
        {/* Doctor Info */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800">
            {doctor.full_name}
          </h3>
          <p className="text-blue-600 font-medium">
            {doctor.category_name}
          </p>
          <p className="text-gray-600 text-sm mt-1">
            {doctor.qualification}
          </p>
          <p className="text-gray-500 text-sm">
            Experience: {doctor.experience_years} years
          </p>
          <div className="mt-2 text-sm text-gray-500">
            <p>📞 {doctor.phone}</p>
            <p>📧 {doctor.email}</p>
          </div>
        </div>
      </div>

      {/* Book Button */}
      <button
        onClick={handleBooking}
        className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium"
      >
        Book Appointment
      </button>
    </div>
  );
}

export default DoctorCard;