import mysql from 'mysql2/promise';

async function setup() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    multipleStatements: true,
  });

  await conn.query(`CREATE DATABASE IF NOT EXISTS hustisyakonek`);
  await conn.query(`USE hustisyakonek`);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) UNIQUE,
      username VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      role ENUM('secretary','lupon_chairman','lupon_member','complainant','respondent') NOT NULL,
      contact VARCHAR(50),
      address TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS cases (
      id INT AUTO_INCREMENT PRIMARY KEY,
      case_number VARCHAR(50) UNIQUE NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      complainant_id INT NOT NULL,
      respondent_name VARCHAR(255) NOT NULL,
      respondent_address TEXT,
      respondent_contact VARCHAR(50),
      respondent_password VARCHAR(255),
      status ENUM('filed','under_mediation','settled','escalated','closed') DEFAULT 'filed',
      lupon_chairman_id INT,
      filing_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      settlement_date TIMESTAMP NULL,
      remarks TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (complainant_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (lupon_chairman_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS case_assignments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      case_id INT NOT NULL,
      lupon_member_id INT NOT NULL,
      role ENUM('member','pangkat') DEFAULT 'member',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE,
      FOREIGN KEY (lupon_member_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS hearings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      case_id INT NOT NULL,
      hearing_number INT NOT NULL,
      scheduled_date DATETIME NOT NULL,
      status ENUM('scheduled','completed','cancelled') DEFAULT 'scheduled',
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
    )
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS attendance (
      id INT AUTO_INCREMENT PRIMARY KEY,
      hearing_id INT NOT NULL,
      user_id INT NOT NULL,
      role VARCHAR(50) NOT NULL,
      attended BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (hearing_id) REFERENCES hearings(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS summons (
      id INT AUTO_INCREMENT PRIMARY KEY,
      case_id INT NOT NULL,
      generated_by INT NOT NULL,
      respondent_credentials VARCHAR(255),
      status ENUM('generated','delivered') DEFAULT 'generated',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE,
      FOREIGN KEY (generated_by) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      action VARCHAR(255) NOT NULL,
      details TEXT,
      ip_address VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS filing_reports (
      id INT AUTO_INCREMENT PRIMARY KEY,
      case_id INT NOT NULL,
      generated_by INT NOT NULL,
      report_details TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE,
      FOREIGN KEY (generated_by) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  console.log('Database tables created successfully!');
  await conn.end();
}

setup().catch(console.error);
