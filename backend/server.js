const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure directories and db exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const dbFile = path.join(__dirname, 'db.json');
if (!fs.existsSync(dbFile)) {
    fs.writeFileSync(dbFile, JSON.stringify([]));
}

// Set up Multer for video uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname) || '.mp4';
        cb(null, req.body.mobile + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({ storage: storage });

// API: Get all videos
app.get('/api/videos', (req, res) => {
    const data = JSON.parse(fs.readFileSync(dbFile));
    res.json(data);
});

// API: Upload video and user details
app.post('/api/upload', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No video file provided' });
    }

    const { name, location, mobile } = req.body;
    const videoUrl = `/uploads/${req.file.filename}`;

    const newRecord = {
        id: Date.now().toString(),
        name: name || 'Unknown',
        location: location || 'Unknown',
        mobile: mobile || 'Unknown',
        videoUrl: videoUrl,
        filename: req.file.filename,
        createdAt: new Date().toISOString(),
        syncedToDrive: false
    };

    const data = JSON.parse(fs.readFileSync(dbFile));
    data.push(newRecord);
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));

    res.json({ success: true, record: newRecord });
});

// API: Mock transfer to Google Drive
app.post('/api/sync-drive/:id', (req, res) => {
    const { id } = req.params;
    const data = JSON.parse(fs.readFileSync(dbFile));
    
    const recordIndex = data.findIndex(r => r.id === id);
    if (recordIndex === -1) {
        return res.status(404).json({ error: 'Record not found' });
    }

    // Here is where actual Google Drive API code would go.
    // e.g., using googleapis package:
    // const drive = google.drive({version: 'v3', auth});
    // drive.files.create({ ... })
    
    // For now, we mock the success
    setTimeout(() => {
        data[recordIndex].syncedToDrive = true;
        data[recordIndex].driveLink = `https://drive.google.com/file/d/mock-id-${id}/view`;
        fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
        
        res.json({ success: true, record: data[recordIndex] });
    }, 1500); // simulate network delay
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
    console.log(`Admin Dashboard available at http://localhost:${PORT}`);
});
