// routes/postRoutes.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const multer = require('multer');
const path = require('path');

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
  
router.post('/', upload.single('media'), postController.createPost);

// Get all posts
router.get('/', postController.getAllPosts);

// Create a new Post
//router.post('/', postController.createPost);

// Get Post by Id
router.get('/:id', postController.getPostById);

// Get Post by userId
router.get('/user/:userId', postController.getPostByuserId);

router.post('/like', postController.likePost);

router.post('/comment', postController.commentOnPost);

module.exports = router;