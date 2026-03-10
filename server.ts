import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("symptomind.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT,
    role TEXT DEFAULT 'patient'
  );

  CREATE TABLE IF NOT EXISTS symptom_checks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    symptoms TEXT,
    analysis TEXT,
    urgency TEXT,
    specialist TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    report_name TEXT,
    analysis TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS medications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    name TEXT,
    dosage TEXT,
    frequency TEXT,
    time TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS doctors (
    id TEXT PRIMARY KEY,
    name TEXT,
    specialty TEXT,
    rating REAL,
    distance TEXT,
    verified INTEGER DEFAULT 0,
    bio TEXT,
    license TEXT
  );

  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    doctor_id TEXT,
    date TEXT,
    time TEXT,
    status TEXT DEFAULT 'scheduled',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed some doctors if empty
const doctorCount = db.prepare("SELECT COUNT(*) as count FROM doctors").get() as { count: number };
if (doctorCount.count === 0) {
  const seedDoctors = [
    { id: 'd1', name: 'Dr. Sarah Sharma', specialty: 'Cardiologist', rating: 4.9, distance: '2.4 km', verified: 1, bio: 'Expert in non-invasive cardiology with 15 years experience.', license: 'MC-12345' },
    { id: 'd2', name: 'Dr. Rajesh Kumar', specialty: 'Dermatologist', rating: 4.7, distance: '1.8 km', verified: 1, bio: 'Specialist in clinical and aesthetic dermatology.', license: 'MC-67890' },
    { id: 'd3', name: 'Dr. Anita Desai', specialty: 'Pediatrician', rating: 4.8, distance: '3.1 km', verified: 1, bio: 'Dedicated to child health and wellness for over 10 years.', license: 'MC-11223' },
    { id: 'd4', name: 'Dr. Vikram Singh', specialty: 'General Physician', rating: 4.6, distance: '0.5 km', verified: 1, bio: 'Primary care specialist focusing on preventive medicine.', license: 'MC-44556' },
  ];
  const insertDoctor = db.prepare("INSERT INTO doctors (id, name, specialty, rating, distance, verified, bio, license) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
  seedDoctors.forEach(d => insertDoctor.run(d.id, d.name, d.specialty, d.rating, d.distance, d.verified, d.bio, d.license));
}

async function startServer() {
  const app = express();
  app.use(express.json());

  const PORT = 3000;

  // Auth Routes
  app.post("/api/auth/register", (req, res) => {
    const { email, password, name } = req.body;
    const id = Math.random().toString(36).substring(2, 15);
    try {
      db.prepare("INSERT INTO users (id, email, password, name) VALUES (?, ?, ?, ?)").run(id, email, password, name);
      res.json({ id, email, name });
    } catch (error) {
      res.status(400).json({ error: "Email already exists" });
    }
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password) as any;
    if (user) {
      res.json({ id: user.id, email: user.email, name: user.name });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  // API Routes
  app.get("/api/doctors", (req, res) => {
    const doctors = db.prepare("SELECT * FROM doctors").all();
    res.json(doctors);
  });

  app.get("/api/doctors/:id", (req, res) => {
    const doctor = db.prepare("SELECT * FROM doctors WHERE id = ?").get(req.params.id);
    res.json(doctor);
  });

  app.post("/api/appointments", (req, res) => {
    const { userId, doctorId, date, time } = req.body;
    const result = db.prepare("INSERT INTO appointments (user_id, doctor_id, date, time) VALUES (?, ?, ?, ?)").run(userId, doctorId, date, time);
    res.json({ id: result.lastInsertRowid });
  });

  app.get("/api/appointments/:userId", (req, res) => {
    const appointments = db.prepare(`
      SELECT a.*, d.name as doctor_name, d.specialty as doctor_specialty 
      FROM appointments a 
      JOIN doctors d ON a.doctor_id = d.id 
      WHERE a.user_id = ?
      ORDER BY a.date ASC, a.time ASC
    `).all(req.params.userId);
    res.json(appointments);
  });

  app.post("/api/symptom-checks", (req, res) => {
    const { userId, symptoms, analysis, urgency, specialist } = req.body;
    const result = db.prepare("INSERT INTO symptom_checks (user_id, symptoms, analysis, urgency, specialist) VALUES (?, ?, ?, ?, ?)").run(userId, symptoms, analysis, urgency, specialist);
    res.json({ id: result.lastInsertRowid });
  });

  app.get("/api/symptom-checks/:userId", (req, res) => {
    const checks = db.prepare("SELECT * FROM symptom_checks WHERE user_id = ? ORDER BY created_at DESC").all(req.params.userId);
    res.json(checks);
  });

  app.post("/api/reports", (req, res) => {
    const { userId, reportName, analysis } = req.body;
    const result = db.prepare("INSERT INTO reports (user_id, report_name, analysis) VALUES (?, ?, ?)").run(userId, reportName, analysis);
    res.json({ id: result.lastInsertRowid });
  });

  app.get("/api/reports/:userId", (req, res) => {
    const reports = db.prepare("SELECT * FROM reports WHERE user_id = ? ORDER BY created_at DESC").all(req.params.userId);
    res.json(reports);
  });

  app.get("/api/medications/:userId", (req, res) => {
    const medications = db.prepare("SELECT * FROM medications WHERE user_id = ? ORDER BY created_at DESC").all(req.params.userId);
    res.json(medications);
  });

  app.post("/api/medications", (req, res) => {
    const { userId, name, dosage, frequency, time } = req.body;
    const result = db.prepare("INSERT INTO medications (user_id, name, dosage, frequency, time) VALUES (?, ?, ?, ?, ?)").run(userId, name, dosage, frequency, time);
    res.json({ id: result.lastInsertRowid });
  });

  app.delete("/api/medications/:id", (req, res) => {
    db.prepare("DELETE FROM medications WHERE id = ?").run(req.params.id);
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
