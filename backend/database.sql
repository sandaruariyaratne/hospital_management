-- Hospital Management System Database Schema

-- 1. Categories Table (Doctor Specializations)
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Doctors Table
CREATE TABLE doctors (
    doctor_id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    category_id INTEGER NOT NULL,
    qualification VARCHAR(200),
    experience_years INTEGER,
    phone VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

-- 3. Time Slots Table
CREATE TABLE time_slots (
    slot_id SERIAL PRIMARY KEY,
    doctor_id INTEGER NOT NULL,
    slot_date DATE NOT NULL,
    slot_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE CASCADE,
    UNIQUE(doctor_id, slot_date, slot_time)
);

-- 4. Patients Table
CREATE TABLE patients (
    patient_id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Appointments Table
CREATE TABLE appointments (
    appointment_id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    slot_id INTEGER NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'confirmed',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE CASCADE,
    FOREIGN KEY (slot_id) REFERENCES time_slots(slot_id) ON DELETE CASCADE
);

-- Insert Sample Categories
INSERT INTO categories (category_name, description) VALUES
('Cardiology', 'Heart and cardiovascular system specialists'),
('Neurology', 'Brain and nervous system specialists'),
('Orthopedics', 'Bone, joint, and muscle specialists'),
('Pediatrics', 'Children healthcare specialists'),
('Dermatology', 'Skin, hair, and nail specialists');

-- Insert Sample Doctors
INSERT INTO doctors (full_name, category_id, qualification, experience_years, phone, email) VALUES
('Dr. Sarah Johnson', 1, 'MD, Cardiology', 15, '555-0101', 'sarah.johnson@hospital.com'),
('Dr. Michael Chen', 1, 'MD, Interventional Cardiology', 12, '555-0102', 'michael.chen@hospital.com'),
('Dr. Emily Rodriguez', 2, 'MD, PhD, Neurology', 20, '555-0103', 'emily.rodriguez@hospital.com'),
('Dr. James Wilson', 3, 'MD, Orthopedic Surgery', 18, '555-0104', 'james.wilson@hospital.com'),
('Dr. Lisa Anderson', 4, 'MD, Pediatrics', 10, '555-0105', 'lisa.anderson@hospital.com'),
('Dr. David Kim', 5, 'MD, Dermatology', 8, '555-0106', 'david.kim@hospital.com');

-- Insert Sample Time Slots (next 7 days for each doctor)
INSERT INTO time_slots (doctor_id, slot_date, slot_time, is_available) VALUES
-- Dr. Sarah Johnson (doctor_id = 1)
(1, CURRENT_DATE + 1, '09:00:00', TRUE),
(1, CURRENT_DATE + 1, '10:00:00', TRUE),
(1, CURRENT_DATE + 1, '11:00:00', TRUE),
(1, CURRENT_DATE + 1, '14:00:00', TRUE),
(1, CURRENT_DATE + 2, '09:00:00', TRUE),
(1, CURRENT_DATE + 2, '10:00:00', TRUE),

-- Dr. Michael Chen (doctor_id = 2)
(2, CURRENT_DATE + 1, '10:00:00', TRUE),
(2, CURRENT_DATE + 1, '11:00:00', TRUE),
(2, CURRENT_DATE + 1, '15:00:00', TRUE),
(2, CURRENT_DATE + 2, '10:00:00', TRUE),

-- Dr. Emily Rodriguez (doctor_id = 3)
(3, CURRENT_DATE + 1, '09:30:00', TRUE),
(3, CURRENT_DATE + 1, '11:30:00', TRUE),
(3, CURRENT_DATE + 1, '14:30:00', TRUE),

-- Dr. James Wilson (doctor_id = 4)
(4, CURRENT_DATE + 1, '08:00:00', TRUE),
(4, CURRENT_DATE + 1, '09:00:00', TRUE),
(4, CURRENT_DATE + 1, '13:00:00', TRUE),

-- Dr. Lisa Anderson (doctor_id = 5)
(5, CURRENT_DATE + 1, '09:00:00', TRUE),
(5, CURRENT_DATE + 1, '10:30:00', TRUE),
(5, CURRENT_DATE + 1, '14:00:00', TRUE),

-- Dr. David Kim (doctor_id = 6)
(6, CURRENT_DATE + 1, '11:00:00', TRUE),
(6, CURRENT_DATE + 1, '13:00:00', TRUE),
(6, CURRENT_DATE + 1, '15:00:00', TRUE);
