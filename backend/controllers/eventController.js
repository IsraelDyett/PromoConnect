// controllers/eventController.js
const Groupchat = require('../models/Groupchat');
const Event = require('../models/Event');

module.exports = {
    // Get all events
    getAllEvents : async (req, res) => {
        try {
            const events = await Event.find().populate('application').populate('groupChat');
            res.status(200).json(events);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Get event by ID+
    getEventById : async (req, res) => {
        try {
            const event = await Event.findById(req.params.id).populate('application').populate('groupChat');
            if (!event) {
            return res.status(404).json({ error: 'Event not found' });
            }
            res.status(200).json(event);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    
    // Get all events created by a specific company
    getEventsByCompany: async (req, res) => {
        try {
        const companyId = req.params.companyId;
        const events = await Event.find({ createdBy: companyId }).populate('application').populate('groupChat');
        res.status(200).json(events);
        } catch (err) {
        res.status(500).json({ error: err.message });
        }
    },

     // Get applications by user
     getEventsByUser: async (req, res) => {
        try {
            const userId = req.params.userId;
            const events = await Event.find({ user: userId });
            if (!events) {
                return res.status(404).json({ error: 'No events found for this user' });
            }
            res.status(200).json(events);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
     

    // Create a new event
    createEvent : async (req, res) => {
        try {
        const { title, description, location, timeAndDate, hourlyRate, requirements, createdBy } = req.body;

        // Create the event
        const newEvent = new Event({
            title,
            description,
            location,
            timeAndDate,
            hourlyRate,
            requirements,
            createdBy
        });

        // Create a new group chat
        const newGroupChat = new Groupchat({
            title: `${title} Group Chat`,
            description: `Group chat for event: ${title}`,
            members: [{ user: createdBy }]
        });

        // Save the group chat
        const savedGroupChat = await newGroupChat.save();

        // Associate the group chat with the event
        newEvent.groupChat = savedGroupChat._id;

        // Save the event
        const savedEvent = await newEvent.save();

        res.status(201).json(savedEvent);
        } catch (err) {
        res.status(400).json({ error: err.message });
        }
    },

    // Update an event
    updateEvent : async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedEvent) {
        return res.status(404).json({ error: 'Event not found' });
        }
        res.status(200).json(updatedEvent);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
    },

    // Delete an event
    deleteEvent : async (req, res) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);
        if (!deletedEvent) {
        return res.status(404).json({ error: 'Event not found' });
        }
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    }
}