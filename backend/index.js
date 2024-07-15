const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();
const port = 5000;


// Set up storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: ["https://promo-connect-server.vercel.app/"],
  method: ["POST", "GET", "PATCH"],
  cerdentials: true
}));

// Ensure the 'uploads' directory exists
const fs = require('fs');
const dir = './uploads';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}


const uri = 'mongodb+srv://israeldyett:Izyrelman@cluster0.sx9zepa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(uri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});
app.get('/', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/posts', postRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
