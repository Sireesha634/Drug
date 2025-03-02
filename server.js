const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to Amazon RDS MySQL
const db = mysql.createConnection({
    host: 'drug.c74wyw6my634.eu-north-1.rds.amazonaws.com',
    user: 'drug',
    password: 'password',
    database: 'dti_database'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to Amazon RDS MySQL');
    }
});

// Fetch drug details and interactions
app.get('/getDrugData', (req, res) => {
    const drugName = req.query.drug;
    if (!drugName) return res.status(400).json({ error: "Drug name is required" });

    const sql = `
        SELECT 
            d.drug, d.molecular_weight, d.smiles, d.type_of_molecule, d.mechanism_of_action,
            t.target_name, t.binding_affinity, t.uniprot_id, t.gene_name
        FROM dti_data d
        JOIN target_data t ON d.drug = t.drug
        WHERE d.drug = ?;
    `;

    db.query(sql, [drugName], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.listen(3000, () => console.log('Server running on port 3000'));
