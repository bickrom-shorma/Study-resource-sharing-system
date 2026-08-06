-- Create Database
CREATE DATABASE IF NOT EXISTS study_resource_db;
USE study_resource_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subject_name VARCHAR(255) UNIQUE NOT NULL
);

-- 3. Topics Table
CREATE TABLE IF NOT EXISTS topics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subject_id INT NOT NULL,
  topic_name VARCHAR(255) NOT NULL,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

-- 4. Notes Table
CREATE TABLE IF NOT EXISTS notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subject_id INT NOT NULL,
  topic_id INT NOT NULL,
  uploaded_by INT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
  FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Seed Initial Subjects
INSERT IGNORE INTO subjects (id, subject_name) VALUES
(1, 'Data Structures & Algorithms'),
(2, 'Database Management Systems'),
(3, 'Web Engineering'),
(4, 'Operating Systems'),
(5, 'Computer Networks');

-- Seed Initial Topics
INSERT IGNORE INTO topics (id, subject_id, topic_name) VALUES
(1, 1, 'Arrays & Linked Lists'),
(2, 1, 'Trees & Graphs'),
(3, 1, 'Dynamic Programming'),
(4, 2, 'Relational Model & SQL'),
(5, 2, 'Normalization & Indexing'),
(6, 2, 'Transactions & Concurrency'),
(7, 3, 'HTML, CSS & JavaScript'),
(8, 3, 'React & Frontend Architecture'),
(9, 3, 'Node.js & Express APIs'),
(10, 4, 'Process Management & Threads'),
(11, 4, 'Memory Management & Paging'),
(12, 5, 'TCP/IP Model & Routing'),
(13, 5, 'Network Security & Protocols');

-- Seed Initial Sample User (Password: student123)
INSERT IGNORE INTO users (id, full_name, email, password) VALUES
(1, 'Alex Mercer (Dept Admin)', 'alex.mercer@dept.edu', '$2a$10$wE1V2sLdK7Z5J2v8X9M1ueF9gJ8n3mQ4kP5r6t7u8v9w0x1y2z3a4');

-- Seed Initial Sample Notes
INSERT IGNORE INTO notes (id, title, subject_id, topic_id, uploaded_by, file_name, file_path) VALUES
(1, 'Complete React & Redux Architecture Guide', 3, 8, 1, 'sample-note.pdf', 'server/uploads/sample-note.pdf'),
(2, 'SQL Join Algorithms & Index Optimization', 2, 5, 1, 'sample-note.pdf', 'server/uploads/sample-note.pdf'),
(3, 'Data Structures: Binary Search Trees & AVL', 1, 2, 1, 'sample-note.pdf', 'server/uploads/sample-note.pdf');

