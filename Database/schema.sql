CREATE DATABASE IF NOT EXISTS health_survey_db;
USE health_survey_db;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role ENUM('Admin', 'Doctor', 'Staff', 'Viewer') DEFAULT 'Staff',
    is_active TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE districts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    district_name VARCHAR(100) UNIQUE NOT NULL,
    state VARCHAR(100)
);

CREATE TABLE health_issues (
    id INT PRIMARY KEY AUTO_INCREMENT,
    issue_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE surveys (
    id INT PRIMARY KEY AUTO_INCREMENT,
    survey_date DATE NOT NULL,
    name VARCHAR(150) NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    mobile_number VARCHAR(15) NOT NULL,
    email VARCHAR(120),
    address TEXT,
    district_id INT NOT NULL,
    health_issue_id INT,
    remarks TEXT,
    family_members_count INT,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted TINYINT DEFAULT 0,
    FOREIGN KEY (district_id) REFERENCES districts(id)
);

INSERT INTO districts (district_name, state) VALUES
('Mumbai', 'Maharashtra'),
('Pune', 'Maharashtra'),
('Bangalore', 'Karnataka'),
('Delhi', 'Delhi'),
('Kolkata', 'West Bengal'),
('Chennai', 'Tamil Nadu'),
('Hyderabad', 'Telangana'),
('Ahmedabad', 'Gujarat');

INSERT INTO health_issues (issue_name, description) VALUES
('Blood Pressure (BP)', 'High or Low Blood Pressure'),
('Asthma', 'Chronic respiratory disease'),
('Diabetes (Sugar)', 'High blood sugar levels'),
('Arthritis', 'Joint inflammation and pain'),
('Heart Disease', 'Cardiovascular conditions'),
('Thyroid', 'Thyroid gland disorders'),
('Kidney Disease', 'Kidney function problems'),
('None', 'No health issues');