// BookingPage.jsx - Time slot selection and patient details form

import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getTimeSlots, createPatient, createAppointment } from '../api';

function BookingPage() {
  const { doctorId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const doctor = location.state?.doctor;

  // State for time slots
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);

  // State for patient form
  const [patientData, setPatientData] = useState({
    full_name: '',
    date_of_birth: '',
    gender: '',
    phone: '',
    email: '',
    address: '',
    notes: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch time slots when page loads
  useEffect(() => {
    fetchTimeSlots();
  }, [doctorId]);

  const fetchTimeSlots = async () => {
    try {
      setLoading(true);
      const data = await getTimeSlots(doctorId);
      setTimeSlots(data);
    } catch (err) {
      setError('Failed to load available time slots.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format time for display
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Group time slots by date
  const groupedSlots = timeSlots.reduce((acc, slot) => {
    const date = slot.slot_date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(slot);
    return acc;
  }, {});

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!selectedSlot) {
      setError('Please select a time slot');
      return;
    }

    if (!patientData.full_name || !patientData.date_of_birth || 
        !patientData.gender || !patientData.phone) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Step 1: Create patient record
      const patient = await createPatient({
        full_name: patientData.full_name,
        date_of_birth: patientData.date_of_birth,
        gender: patientData.gender,
        phone: patientData.phone,
        email: patientData.email || null,
        address: patientData.address || null
      });

      // Step 2: Create appointment
      const appointment = await createAppointment({
        patient_id: patient.patient_id,
        doctor_id: parseInt(doctorId),
        slot_id: selectedSlot.slot_id,
        appointment_date: selectedSlot.slot_date,
        appointment_time: selectedSlot.slot_time,
        notes: patientData.notes || null
      });

      // Step 3: Navigate to confirmation page
      navigate('/confirmation', {
        state: {
          appointment,
          patient,
          doctor,
          slot: selectedSlot
        }
      });

    } catch (err) {
      setError(err.response?.data?.error || 'Failed to book appointment. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Doctor information not found</p>
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

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-blue-600 text-white py-8">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 text-blue-100 hover:text-white flex items-center"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold">Book Appointment</h1>
          <p className="text-blue-100 mt-2">with {doctor.full_name}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Doctor Info & Time Slots */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Doctor Information Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Doctor Information</h2>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center text-3xl flex-shrink-0">
                  👨‍⚕️
                </div>
                <div>
                  <h3 className="text-lg font-bold">{doctor.full_name}</h3>
                  <p className="text-blue-600">{doctor.category_name}</p>
                  <p className="text-gray-600 text-sm">{doctor.qualification}</p>
                  <p className="text-gray-500 text-sm">Experience: {doctor.experience_years} years</p>
                </div>
              </div>
            </div>

            {/* Time Slots Selection */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Select Time Slot</h2>
              
              {loading && (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-600">Loading available slots...</p>
                </div>
              )}

              {!loading && timeSlots.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No available time slots at the moment.</p>
                  <p className="text-sm mt-2">Please check back later or contact the hospital.</p>
                </div>
              )}

              {!loading && Object.keys(groupedSlots).map((date) => (
                <div key={date} className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-3">
                    {formatDate(date)}
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {groupedSlots[date].map((slot) => (
                      <button
                        key={slot.slot_id}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition ${
                          selectedSlot?.slot_id === slot.slot_id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {formatTime(slot.slot_time)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Patient Details Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Patient Details</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={patientData.full_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={patientData.date_of_birth}
                    onChange={handleInputChange}
                    required
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={patientData.gender}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={patientData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+1234567890"
                  />
                </div>

                {/* Email (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={patientData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="john@example.com"
                  />
                </div>

                {/* Address (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={patientData.address}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Street, City, Country"
                  />
                </div>

                {/* Notes (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    value={patientData.notes}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Any special requirements or symptoms..."
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
                    {error}
                  </div>
                )}

                {/* Selected Slot Info */}
                {selectedSlot && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-blue-800">Selected Slot:</p>
                    <p className="text-sm text-blue-600">
                      {formatDate(selectedSlot.slot_date)} at {formatTime(selectedSlot.slot_time)}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting || !selectedSlot}
                  className={`w-full py-3 rounded-lg font-medium transition ${
                    submitting || !selectedSlot
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {submitting ? 'Booking...' : 'Confirm Booking'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;