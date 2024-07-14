// controllers/userController.js
const User = require('../models/User');
const Company = require('../models/Company');
const Ambassador = require('../models/Ambassador');
const companyController = require('./companyController'); 
const ambassadorController = require('./ambassadorController'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });
  };

module.exports = {
    // Get all users
    getAllUsers : async (req, res) => {
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    // Get user by ID
    getUserById : async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
      
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
        
            if (user.type === 'Ambassador') {
                return ambassadorController.getAmbassadorById(req, res);
            }
            if (user.type === 'company') {
                return companyController.getCompanyById(req, res);
            }
            
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    // Create a new user
    createUser : async (req, res) => {
        try {
            console.log(req.body); 
            let newUser;
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            if (req.body.type === 'company') {
                newUser = new Company({ ...req.body, password: hashedPassword });
            } else if (req.body.type === 'Ambassador') {
                newUser = new Ambassador({ ...req.body, password: hashedPassword });
            } else {
                newUser = new User({ ...req.body, password: hashedPassword });
            }
            const savedUser = await newUser.save();
            res.status(201).json(savedUser);
            } catch (err) {
                res.status(400).json({ error: err.message });
          }
    },
    // Update a user
    updateUser : async (req, res) => {
        try {
          const user = await User.findById(req.params.id);
          if (!user) {
            return res.status(404).json({ error: 'User not found' });
          }
          if (user.type === 'Ambassador') {
            return ambassadorController.updateAmbassador(req, res);
          }
          if (user.type === 'company') {
            return companyController.updateCompany(req, res);
          }
          const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
          res.status(200).json(updatedUser);
        } catch (err) {
          res.status(400).json({ error: err.message });
        }
      },
    // Delete a user
    deleteUser : async (req, res) => {
        try {
            const deletedUser = await User.findById(req.params.id);
            
            if (deletedUser.type === 'Ambassador') {
                return ambassadorController.deletedAmbassador(req, res);
            }
            if (deletedUser.type === 'company') {
                return companyController.deletedCompany(req, res);
            }
            deletedUser = await User.findByIdAndDelete(req.params.id);
            if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
            }
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    login: async (req, res) => {
        const { email, password } = req.body;
    
        try {
          // Check if the user exists
          const user = await User.findOne({ email });
          if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
          }
    
          // Check if password matches
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
          }
    
          // Generate JWT token
          const token = generateToken(user);
    
          res.json({ token , userType: user.type, userID: user._id});
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      }
}

