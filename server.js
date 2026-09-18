const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// index.html እና ሰነዶችን ቀጥታ ለማሳየት
app.use(express.static(__dirname));

if (!fs.existsSync('./uploads')){
  fs.mkdirSync('./uploads');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

let agreements = [];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/agreements/create', upload.single('voice_note'), (req, res) => {
  const { lender_phone, borrower_phone, amount, due_date } = req.body;
  const voice_note_url = req.file ? req.file.path : null;
  const newAgreement = { id: agreements.length + 1001, lender_phone, borrower_phone, amount, due_date, voice_note_url, status: 'PENDING' };
  agreements.push(newAgreement);
  res.status(201).json({ message: 'ውሉ በትክክል ተመዝግቧል!', agreement: newAgreement });
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));