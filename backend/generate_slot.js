// generate-slots.js - Auto-generate time slots for next 30 days

const pool = require('./db');
require('dotenv').config();

// Define fixed time slots for each doctor
const doctorTimeSlots = {
  1: ['09:00:00', '10:00:00', '11:00:00', '14:00:00', '15:00:00'], // Dr. Sarah Johnson
  2: ['10:00:00', '11:00:00', '15:00:00', '16:00:00'], // Dr. Michael Chen
  3: ['09:30:00', '11:30:00', '14:30:00', '16:00:00'], // Dr. Emily Rodriguez
  4: ['08:00:00', '09:00:00', '10:00:00', '13:00:00'], // Dr. James Wilson
  5: ['09:00:00', '10:30:00', '14:00:00', '15:30:00'], // Dr. Lisa Anderson
  6: ['11:00:00', '13:00:00', '15:00:00', '16:30:00'], // Dr. David Kim
};

async function generateTimeSlots() {
  try {
    console.log(' Starting time slot generation...');

    // Step 1: Clear existing future slots
    await pool.query('DELETE FROM time_slots WHERE slot_date >= CURRENT_DATE');
    console.log('Cleared old time slots');

    // Step 2: Generate slots for next 30 days
    let totalSlots = 0;
    
    for (const [doctorId, times] of Object.entries(doctorTimeSlots)) {
      for (let dayOffset = 1; dayOffset <= 30; dayOffset++) {
        for (const time of times) {
          await pool.query(
            `INSERT INTO time_slots (doctor_id, slot_date, slot_time, is_available) 
             VALUES ($1, CURRENT_DATE + INTERVAL '${dayOffset} days', $2, TRUE)`,
            [doctorId, time]
          );
          totalSlots++;
        }
      }
    }

    console.log(`Generated ${totalSlots} time slots for the next 30 days`);
    console.log('Time slot generation complete!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error generating time slots:', error);
    process.exit(1);
  }
}

generateTimeSlots();