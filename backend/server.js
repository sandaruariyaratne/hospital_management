// server.js - Main Backend Server

// Import required packages
const express = require('express');
const cors = require('cors');
const pool = require('./db'); // Import our database connection
const client = require('prom-client');
client.collectDefaultMetrics();
// Load environment variables
require('dotenv').config();

// Create Express application
const app = express();

// Middleware
app.use(cors()); // Allow frontend to make requests to backend
app.use(express.json()); // Parse JSON request bodies

// Server port
const PORT = process.env.PORT || 5000;

// ============================================
// API ROUTES
// ============================================

// Test route - Check if server is running
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend server is running!' });
});

// --------------------------------------------
// 1. GET ALL CATEGORIES
// --------------------------------------------
app.get('/api/categories', async (req, res) => {
  try {
    // Query database for all categories
    const result = await pool.query(
      'SELECT * FROM categories ORDER BY category_name'
    );
    
    // Send categories as JSON response
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// --------------------------------------------
// 2. GET DOCTORS BY CATEGORY
// --------------------------------------------
app.get('/api/doctors/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params; // Get categoryId from URL
    
    // Query doctors for specific category
    const result = await pool.query(
      `SELECT d.*, c.category_name 
       FROM doctors d 
       JOIN categories c ON d.category_id = c.category_id 
       WHERE d.category_id = $1 
       ORDER BY d.full_name`,
      [categoryId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

// --------------------------------------------
// 3. GET ALL DOCTORS
// --------------------------------------------
app.get('/api/doctors', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT d.*, c.category_name 
       FROM doctors d 
       JOIN categories c ON d.category_id = c.category_id 
       ORDER BY c.category_name, d.full_name`
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

// --------------------------------------------
// 4. GET AVAILABLE TIME SLOTS FOR A DOCTOR
// --------------------------------------------
app.get('/api/timeslots/:doctorId', async (req, res) => {
  try {
    const { doctorId } = req.params;
    
    // Get only available slots for future dates
    const result = await pool.query(
      `SELECT * FROM time_slots 
       WHERE doctor_id = $1 
       AND is_available = TRUE 
       AND slot_date >= CURRENT_DATE 
       ORDER BY slot_date, slot_time`,
      [doctorId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching time slots:', error);
    res.status(500).json({ error: 'Failed to fetch time slots' });
  }
});

// --------------------------------------------
// 5. CREATE NEW PATIENT
// --------------------------------------------
app.post('/api/patients', async (req, res) => {
  try {
    const { full_name, date_of_birth, gender, phone, email, address } = req.body;
    
    // Validate required fields
    if (!full_name || !date_of_birth || !gender || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Insert new patient into database
    const result = await pool.query(
      `INSERT INTO patients (full_name, date_of_birth, gender, phone, email, address) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [full_name, date_of_birth, gender, phone, email, address]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({ error: 'Failed to create patient' });
  }
});

// --------------------------------------------
// 6. CREATE NEW APPOINTMENT
// --------------------------------------------
app.post('/api/appointments', async (req, res) => {
  try {
    const { patient_id, doctor_id, slot_id, appointment_date, appointment_time, notes } = req.body;
    
    // Validate required fields
    if (!patient_id || !doctor_id || !slot_id || !appointment_date || !appointment_time) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Start a transaction (all operations succeed or all fail)
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // 1. Check if slot is still available
      const slotCheck = await client.query(
        'SELECT is_available FROM time_slots WHERE slot_id = $1',
        [slot_id]
      );
      
      if (slotCheck.rows.length === 0) {
        throw new Error('Time slot not found');
      }
      
      if (!slotCheck.rows[0].is_available) {
        throw new Error('Time slot is no longer available');
      }
      
      // 2. Create appointment
      const appointmentResult = await client.query(
        `INSERT INTO appointments (patient_id, doctor_id, slot_id, appointment_date, appointment_time, notes) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING *`,
        [patient_id, doctor_id, slot_id, appointment_date, appointment_time, notes]
      );
      
      // 3. Mark time slot as unavailable
      await client.query(
        'UPDATE time_slots SET is_available = FALSE WHERE slot_id = $1',
        [slot_id]
      );
      
      // Commit transaction
      await client.query('COMMIT');
      
      // Return the created appointment
      res.status(201).json(appointmentResult.rows[0]);
      
    } catch (error) {
      // If anything fails, rollback all changes
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: error.message || 'Failed to create appointment' });
  }
});

// --------------------------------------------
// 7. GET APPOINTMENT DETAILS BY ID
// --------------------------------------------
app.get('/api/appointments/:appointmentId', async (req, res) => {
  try {
    const { appointmentId } = req.params;
    
    const result = await pool.query(
      `SELECT 
        a.*,
        p.full_name as patient_name,
        p.phone as patient_phone,
        p.email as patient_email,
        d.full_name as doctor_name,
        c.category_name
       FROM appointments a
       JOIN patients p ON a.patient_id = p.patient_id
       JOIN doctors d ON a.doctor_id = d.doctor_id
       JOIN categories c ON d.category_id = c.category_id
       WHERE a.appointment_id = $1`,
      [appointmentId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ error: 'Failed to fetch appointment' });
  }
});
// Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});


// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});