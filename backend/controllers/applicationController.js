const Application = require('../models/Application');
const Event = require('../models/Event');
const Groupchat = require('../models/Groupchat');

module.exports = {
    // Get all applications
    getAllApplications : async (req, res) => {
        try {
            const applications = await Application.find();
            res.status(200).json(applications);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Get application by ID
    getApplicationById : async (req, res) => {
        try {
            const application = await Application.findById(req.params.id);
            if (!application) {
            return res.status(404).json({ error: 'Application not found' });
            }
            res.status(200).json(application);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Get applications by user
    getApplicationByUser: async (req, res) => {
        try {
        const userId = req.params.userId; 
        const applications = await Application.find({ user: userId }).populate('post');
        console.log("applications",applications);
        if (applications) {
            res.json(applications);
          } else {
            res.status(404).json({ error: 'No applications found for this user' });
          }
        } catch (err) {
        res.status(500).json({ error: 'Server error' });
        }
    },

    // Create a new application
    createApplication : async (req, res) => {
        try {
            console.log(req.documents);

            const newApplication = new Application(req.body);
            const savedApplication = await newApplication.save();
            res.status(201).json(savedApplication);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    // Update an application
    updateApplication : async (req, res) => {
        try {
            const updatedApplication = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedApplication) {
            return res.status(404).json({ error: 'Application not found' });
            }
            res.status(200).json(updatedApplication);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    // Update an status
    updateStatus : async (req, res) => {
        try {
            const updatedApplication = await Application.findByIdAndUpdate(
                req.params.applicationId,
                { status: req.body.status },
                { new: true }
            );
            if (!updatedApplication) {
                return res.status(404).json({ error: 'Application not found' });
            }
    
            if (req.body.status === "approved") {
                // Send email notification with the WhatsApp link
                // Implement your email sending logic here
            }
            res.status(200).json(updatedApplication);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    // Delete an application
    deleteApplication : async (req, res) => {
        try {
            const deletedApplication = await Application.findByIdAndDelete(req.params.id);
            if (!deletedApplication) {
            return res.status(404).json({ error: 'Application not found' });
            }
            res.status(200).json({ message: 'Application deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Update the status of an application to "rejected" or "approved"
    updateApplicationStatus: async (req, res) => {
        try {
        const applicationId = req.params.id;
        const { status } = req.body;

        if (status !== 'rejected' && status !== 'approved') {
            return res.status(400).json({ error: 'Invalid status. Status must be "rejected" or "approved"' });
        }

        const updatedApplication = await Application.findByIdAndUpdate(applicationId, { status }, { new: true });

        if (!updatedApplication) {
            return res.status(404).json({ error: 'Application not found' });
        }

        if (status === 'approved') {
            // Get the related event and group chat
            const event = await Event.findById(updatedApplication.event).populate('groupChat');
            if (event && event.groupChat) {
            const groupChat = await Groupchat.findById(event.groupChat);

            // Check if the user is already a member
            const userId = updatedApplication.user;
            if (!groupChat.members.some(member => member.user.toString() === userId.toString())) {
                groupChat.members.push({ user: userId });
                await groupChat.save();
            }
            }
        }

        res.status(200).json(updatedApplication);
        } catch (err) {
        res.status(400).json({ error: err.message });
        }
    },

    getEventApplications: async (req, res) => {
        try {
            const { eventId } = req.params;
            const applications = await Application.find({ post: eventId }).populate('user').populate('documents');

            console.log(applications); 
            res.status(200).json(applications);
          } catch (err) {
            res.status(500).json({ error: err.message });
          }
      },

}