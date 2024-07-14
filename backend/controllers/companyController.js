const Company = require('../models/Company'); 

module.exports = {
    getAllCompanies : async (req, res) => {
        try {
          const companies = await Company.find();
          res.status(200).json(companies);
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      },
      
      // Get company by ID
      getCompanyById : async (req, res) => {
        try {
          const company = await Company.findById(req.params.id);
          if (!company) {
            return res.status(404).json({ error: 'Company not found' });
          }
          res.status(200).json(company);
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      },

      // Get all events created by a specific company
      getEventsByCompany : async (req, res) => {
        try {
          const events = await Event.find({ createdBy: req.params.companyId }).populate('application').populate('groupChat');
          if (events.length === 0) {
            return res.status(404).json({ error: 'No events found for this company' });
          }
          res.status(200).json(events);
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      },

      // Create a new company
      createCompany : async (req, res) => {
        try {
          const newCompany = new Company(req.body);
          const savedCompany = await newCompany.save();
          res.status(201).json(savedCompany);
        } catch (err) {
          res.status(400).json({ error: err.message });
        }
      },
      
      // Update a company
      updateCompany : async (req, res) => {
        try {
          const updatedCompany = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
          if (!updatedCompany) {
            return res.status(404).json({ error: 'Company not found' });
          }
          res.status(200).json(updatedCompany);
        } catch (err) {
          res.status(400).json({ error: err.message });
        }
      },
      
      // Delete a company
      deleteCompany : async (req, res) => {
        try {
          const deletedCompany = await Company.findByIdAndDelete(req.params.id);
          if (!deletedCompany) {
            return res.status(404).json({ error: 'Company not found' });
          }
          res.status(200).json({ message: 'Company deleted successfully' });
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      }
}