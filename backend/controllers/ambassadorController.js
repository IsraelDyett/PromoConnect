const Ambassador = require('../models/Ambassador'); 

module.exports = {

    // Get all ambassadors
    getAllAmbassadors : async (req, res) => {
        try {
            const ambassadors = await Ambassador.find();
            res.status(200).json(ambassadors);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Get ambassador by ID
    getAmbassadorById : async (req, res) => {
        try {
            const ambassador = await Ambassador.findById(req.params.id).populate('socialMedia');
            if (!ambassador) {
            return res.status(404).json({ error: 'Ambassador not found' });
            }
            res.status(200).json(ambassador);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Create a new ambassador
    createAmbassador : async (req, res) => {
        try {
            const newAmbassador = new Ambassador(req.body);
            const savedAmbassador = await newAmbassador.save();
            res.status(201).json(savedAmbassador);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    // Update an ambassador
    updateAmbassador : async (req, res) => {
        try {
            const updatedAmbassador = await Ambassador.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedAmbassador) {
            return res.status(404).json({ error: 'Ambassador not found' });
            }
            res.status(200).json(updatedAmbassador);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    // Delete an ambassador
    deleteAmbassador : async (req, res) => {
        try {
            const deletedAmbassador = await Ambassador.findByIdAndDelete(req.params.id);
            if (!deletedAmbassador) {
            return res.status(404).json({ error: 'Ambassador not found' });
            }
            res.status(200).json({ message: 'Ambassador deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

}