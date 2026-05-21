require('dotenv').config();
const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// DB 초기화: 테이블 생성
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS patients (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        dob DATE,
        gender TEXT,
        grade INTEGER,
        symptom TEXT,
        description TEXT,
        entry_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'waiting' -- waiting, assigned, discharged
      );

      CREATE TABLE IF NOT EXISTS beds (
        id TEXT PRIMARY KEY,
        area TEXT,
        status TEXT DEFAULT 'empty',
        patient_id INTEGER REFERENCES patients(id)
      );
    `);
    
    // 초기 병상 데이터 삽입 (병상이 비어있을 경우만)
    const bedCheck = await pool.query('SELECT COUNT(*) FROM beds');
    if (parseInt(bedCheck.rows[0].count) === 0) {
      const areas = [
        { name: '중증처치구역', count: 4 },
        { name: '응급처치구역', count: 8 },
        { name: '관찰구역', count: 8 }
      ];
      let bedId = 1;
      for (const area of areas) {
        for (let i = 0; i < area.count; i++) {
          await pool.query('INSERT INTO beds (id, area, status) VALUES ($1, $2, $3)', [`B${bedId.toString().padStart(2, '0')}`, area.name, 'empty']);
          bedId++;
        }
      }
    }
    console.log('Database initialized successfully.');
  } catch (err) {
    console.error('DB Init Error:', err);
  }
};

initDB();

// API: 환자 목록 조회
app.get('/api/patients', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM patients ORDER BY entry_time DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: 환자 등록 (Triage)
app.post('/api/patients', async (req, res) => {
  const { name, dob, gender, grade, symptom, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO patients (name, dob, gender, grade, symptom, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, dob, gender, grade, symptom, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: 병상 현황 조회
app.get('/api/beds', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT b.*, p.name as patient_name, p.grade as patient_grade, p.entry_time as patient_entry_time 
      FROM beds b 
      LEFT JOIN patients p ON b.patient_id = p.id
      ORDER BY b.id ASC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: 병상 배정
app.put('/api/beds/:id/assign', async (req, res) => {
  const { id } = req.params;
  const { patientId } = req.body;
  try {
    await pool.query('UPDATE beds SET status = $1, patient_id = $2 WHERE id = $3', ['occupied', patientId, id]);
    await pool.query('UPDATE patients SET status = $1 WHERE id = $2', ['assigned', patientId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: 퇴실/청소
app.put('/api/beds/:id/discharge', async (req, res) => {
  const { id } = req.params;
  try {
    const bed = await pool.query('SELECT patient_id FROM beds WHERE id = $1', [id]);
    const patientId = bed.rows[0].patient_id;
    if (patientId) {
      await pool.query('UPDATE patients SET status = $1 WHERE id = $2', ['discharged', patientId]);
    }
    await pool.query('UPDATE beds SET status = $1, patient_id = NULL WHERE id = $2', ['cleaning', id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`KTAS Smart ER running with Neon DB at http://localhost:${PORT}`);
});
