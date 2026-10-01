-- ========================================================
-- HealthSphere AI - Smart Preventive Healthcare Platform
-- Normalized Relational Database Schema (MySQL & PostgreSQL Compatible)
-- Supporting SDG Goal 3: Good Health and Well-Being
-- ========================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'patient', -- 'patient', 'elder', 'caregiver', 'admin'
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(20),
    blood_group VARCHAR(5),
    height_cm DECIMAL(5,2),
    weight_kg DECIMAL(5,2),
    allergies TEXT,
    chronic_conditions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Family Members Table
CREATE TABLE IF NOT EXISTS family_members (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    name VARCHAR(120) NOT NULL,
    relationship VARCHAR(50) NOT NULL, -- 'Spouse', 'Child', 'Parent', 'Grandparent', etc.
    age INT NOT NULL,
    gender VARCHAR(20) NOT NULL,
    blood_group VARCHAR(5),
    allergies TEXT,
    chronic_conditions TEXT,
    emergency_contact_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Health Records Table
CREATE TABLE IF NOT EXISTS health_records (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    family_member_id VARCHAR(36) NULL,
    record_date DATE NOT NULL,
    systolic_bp INT,
    diastolic_bp INT,
    blood_sugar_mg_dl DECIMAL(5,1),
    heart_rate_bpm INT,
    weight_kg DECIMAL(5,2),
    height_cm DECIMAL(5,2),
    bmi DECIMAL(4,1),
    sleep_hours DECIMAL(3,1),
    exercise_mins INT,
    water_intake_liters DECIMAL(3,1),
    stress_level INT, -- 1 to 10
    smoking_status VARCHAR(20), -- 'never', 'former', 'occasional', 'regular'
    alcohol_consumption VARCHAR(20), -- 'none', 'occasional', 'moderate', 'heavy'
    health_score INT, -- 0 to 100
    risk_level VARCHAR(20), -- 'low', 'moderate', 'high', 'critical'
    clinical_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (family_member_id) REFERENCES family_members(id) ON DELETE SET NULL
);

-- 4. Women's Health Table
CREATE TABLE IF NOT EXISTS womens_health_logs (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    log_date DATE NOT NULL,
    cycle_day INT,
    period_flow VARCHAR(20), -- 'spotting', 'light', 'medium', 'heavy'
    pcos_symptoms TEXT, -- JSON or comma-separated: 'acne, hair thinning, irregular cycle'
    pregnancy_week INT,
    iron_deficiency_symptoms TEXT, -- 'fatigue, dizziness, cold hands, pale skin'
    menopause_symptoms TEXT, -- 'hot flashes, night sweats, mood shifts'
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Mood Tracker Table (Mental Wellness)
CREATE TABLE IF NOT EXISTS mood_tracker_logs (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    log_date DATE NOT NULL,
    mood_level INT NOT NULL, -- 1 to 5 (Terrible, Low, Neutral, Good, Radiant)
    mood_emotion VARCHAR(50), -- 'Peaceful', 'Anxious', 'Grateful', 'Fatigued', 'Optimistic'
    stress_score INT, -- 1 to 10
    sleep_quality INT, -- 1 to 5
    journal_entry TEXT,
    meditation_completed_mins INT DEFAULT 0,
    breathing_exercise_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. Medicine Reminders Table
CREATE TABLE IF NOT EXISTS medicine_reminders (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    family_member_id VARCHAR(36) NULL,
    medicine_name VARCHAR(120) NOT NULL,
    dosage VARCHAR(50) NOT NULL, -- '500mg', '1 tablet'
    frequency VARCHAR(50) NOT NULL, -- 'Once daily', 'Twice daily', 'Before meals'
    time_of_day VARCHAR(30) NOT NULL, -- 'Morning', 'Afternoon', 'Evening', 'Bedtime'
    scheduled_time TIME NOT NULL,
    instructions VARCHAR(255),
    is_taken BOOLEAN DEFAULT FALSE,
    start_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (family_member_id) REFERENCES family_members(id) ON DELETE SET NULL
);

-- 7. Nutrition Plans Table
CREATE TABLE IF NOT EXISTS nutrition_plans (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    diet_type VARCHAR(50) NOT NULL, -- 'Vegetarian', 'Non-Vegetarian', 'Vegan', 'Eggetarian'
    daily_calories INT NOT NULL,
    protein_g INT NOT NULL,
    carbs_g INT NOT NULL,
    fats_g INT NOT NULL,
    fiber_g INT NOT NULL,
    budget_tier VARCHAR(20) DEFAULT 'Standard', -- 'Budget-Friendly', 'Standard', 'Premium'
    health_goals TEXT,
    meal_plan_json TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 8. Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    family_member_id VARCHAR(36) NULL,
    doctor_name VARCHAR(120) NOT NULL,
    department VARCHAR(80) NOT NULL, -- 'Cardiology', 'Endocrinology', 'General Medicine'
    hospital_clinic VARCHAR(150) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'Scheduled', -- 'Scheduled', 'Completed', 'Cancelled'
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (family_member_id) REFERENCES family_members(id) ON DELETE SET NULL
);

-- 9. Emergency Contacts Table
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    contact_name VARCHAR(120) NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 10. Health Reports Table
CREATE TABLE IF NOT EXISTS health_reports (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(150) NOT NULL,
    report_type VARCHAR(50) NOT NULL, -- 'Blood Panel', 'ECG', 'AI Health Assessment', 'Imaging'
    summary TEXT NOT NULL,
    doctor_comments TEXT,
    file_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 11. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) DEFAULT 'info', -- 'reminder', 'alert', 'insight', 'emergency'
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 12. Admin Table
CREATE TABLE IF NOT EXISTS admin_users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    role VARCHAR(30) DEFAULT 'super_admin',
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
