// ConfirmationPage.jsx - Booking confirmation and receipt

import { useLocation, useNavigate } from 'react-router-dom';

function ConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { appointment, patient, doctor, slot } = location.state || {};

  // If no data, redirect to home
  if (!appointment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No booking information found</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        
        {/* Success Message */}
        <div className="bg-green-100 border-2 border-green-500 rounded-lg p-6 mb-6 text-center">
          <div className="text-5xl mb-3">✅</div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-green-700">
            Your appointment has been successfully booked
          </p>
        </div>

        {/* Appointment Details Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          
          {/* Booking ID */}
          <div className="border-b pb-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Booking ID</p>
            <p className="text-2xl font-bold text-blue-600">
              #{appointment.appointment_id.toString().padStart(6, '0')}
            </p>
          </div>

          {/* Patient Information */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-3">Patient Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{patient.full_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{patient.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date of Birth</p>
                <p className="font-medium">{new Date(patient.date_of_birth).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Gender</p>
                <p className="font-medium">{patient.gender}</p>
              </div>
              {patient.email && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{patient.email}</p>
                </div>
              )}
            </div>
          </div>

          {/* Appointment Details */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-3">Appointment Details</h2>
            <div className="bg-blue-50 rounded-lg p-4 space-y-3">
              <div className="flex items-start">
                <span className="text-2xl mr-3">👨‍⚕️</span>
                <div>
                  <p className="text-sm text-gray-600">Doctor</p>
                  <p className="font-bold text-gray-800">{doctor.full_name}</p>
                  <p className="text-sm text-blue-600">{doctor.category_name}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <span className="text-2xl mr-3">📅</span>
                <div>
                  <p className="text-sm text-gray-600">Date & Time</p>
                  <p className="font-bold text-gray-800">{formatDate(appointment.appointment_date)}</p>
                  <p className="text-blue-600">{formatTime(appointment.appointment_time)}</p>
                </div>
              </div>

              <div className="flex items-start">
                <span className="text-2xl mr-3">📍</span>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium text-gray-800">Main Hospital Building</p>
                  <p className="text-sm text-gray-600">{doctor.category_name} Department</p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-bold text-yellow-800 mb-2">Important Notes:</h3>
            <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
              <li>Please arrive 15 minutes before your appointment time</li>
              <li>Bring your ID and any relevant medical records</li>
              <li>Keep this booking ID for reference</li>
              <li>To cancel or reschedule, contact us at least 24 hours in advance</li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-2">For any queries, contact:</p>
            <p className="font-medium">📞 Hospital Reception: +123-456-7890</p>
            <p className="font-medium">📧 Email: appointments@hospital.com</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handlePrint}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            🖨️ Print Receipt
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition font-medium"
          >
            Book Another Appointment
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationPage;