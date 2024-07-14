// controllers/postController.js
const Post = require('../models/Post');
const Event = require('../models/Event');


module.exports = {
    getAllPosts: async (req, res) => {
        try {
          const posts = await Post.find().populate('user').populate('likes.user').populate('comments.user');
          res.status(200).json(posts);
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      },
      createPost: async (req, res) => {
        const { type, caption, user, title, description, location, timeAndDate, hourlyRate, requirements } = req.body;
        const media = req.file;

        try {
            console.log(req.body);
            console.log(req.file);

            let newPost;
            if (type === 'Event') {
                newPost = new Event({
                    type,
                    media: media.path, // Use file path instead of buffer
                    caption,
                    user,
                    title,
                    description,
                    location,
                    timeAndDate,
                    hourlyRate,
                    requirements
                });
            } else {
                newPost = new Post({
                    type,
                    media: media.path, // Use file path instead of buffer
                    caption,
                    user
                });
            }

            const savedPost = await newPost.save();
            console.log(savedPost);
            res.status(201).json(savedPost); // Send response once
        } catch (err) {
            console.error("Error creating post:", err);
            res.status(400).json({ error: err.message });
        }
    },
    
      getPostByuserId:  async (req, res) => {
        try {
          const posts = await Post.find({ user: req.params.userId }).sort({ dateCreated: -1 });
          if (!posts) return res.status(404).json({ error: 'No posts found for this user' });
          res.json(posts);
        } catch (err) {
          res.status(500).json({ error: 'Server error' });
        }
      },

      getPostById: async (req, res) => {
        const { id } = req.params;
        try {
            console.log("id:");
            console.log(id);
            const post = await Post.findById(id)
                .populate('user')
                .populate('likes.user')
                .populate('comments.user');
            console.log(post);
            if (!post) {
                return res.status(404).json({ error: 'Post not found' });
            }
            res.status(200).json(post);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    likePost: async (req, res) => {
      const { postId, userId } = req.body;
      try {
        const post = await Post.findById(postId);
        if (!post) {
          return res.status(404).json({ error: 'Post not found' });
        }
  
        // Check if the user has already liked the post
        const isLiked = post.likes.some(like => like.user.toString() === userId);
        if (isLiked) {
          return res.status(400).json({ error: 'User already liked this post' });
        }
  
        post.likes.push({ user: userId });
        await post.save();
  
        res.status(200).json(post);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    },

    commentOnPost: async (req, res) => {
      const { postId, userId, commentText } = req.body;
      try {
        const post = await Post.findById(postId);
        if (!post) {
          return res.status(404).json({ error: 'Post not found' });
        }
  
        post.comments.push({ user: userId, comment:commentText, date: Date.now() });
        await post.save();
  
        res.status(200).json(post);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
};