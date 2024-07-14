// controllers/groupChatController.js

const Groupchat = require('../models/Groupchat');

module.exports = {
    // Get all group chats
    getAllGroupChats : async (req, res) => {
        try {
            const groupChats = await Groupchat.find().populate('members.user').populate('messages.sender');
            res.status(200).json(groupChats);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Get group chat by ID
    getGroupChatById : async (req, res) => {
        try {
            const groupChat = await Groupchat.findById(req.params.id).populate('members.user').populate('messages.sender');
            if (!groupChat) {
            return res.status(404).json({ error: 'Group chat not found' });
            }
            res.status(200).json(groupChat);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Create a new group chat
    createGroupChat : async (req, res) => {
        try {
            const newGroupChat = new Groupchat(req.body);
            const savedGroupChat = await newGroupChat.save();
            res.status(201).json(savedGroupChat);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    // Update a group chat
    updateGroupChat : async (req, res) => {
        try {
            const updatedGroupChat = await Groupchat.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedGroupChat) {
            return res.status(404).json({ error: 'Group chat not found' });
            }
            res.status(200).json(updatedGroupChat);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    // Delete a group chat
    deleteGroupChat : async (req, res) => {
        try {
            const deletedGroupChat = await Groupchat.findByIdAndDelete(req.params.id);
            if (!deletedGroupChat) {
            return res.status(404).json({ error: 'Group chat not found' });
            }
            res.status(200).json({ message: 'Group chat deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Add a message to a group chat
    addMessageToGroupChat : async (req, res) => {
        try {
            const groupChat = await Groupchat.findById(req.params.id);
            if (!groupChat) {
            return res.status(404).json({ error: 'Group chat not found' });
            }
            const newMessage = {
            message: req.body.message,
            sender: req.body.sender
            };
            groupChat.messages.push(newMessage);
            const updatedGroupChat = await groupChat.save();
            res.status(201).json(updatedGroupChat);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

  // Add a user to a group chat
  addUserToGroupChat: async (req, res) => {
    try {
      const groupChat = await Groupchat.findById(req.params.id);
      if (!groupChat) {
        return res.status(404).json({ error: 'Group chat not found' });
      }
      const userId = req.body.userId;
      if (groupChat.members.some(member => member.user.toString() === userId)) {
        return res.status(400).json({ error: 'User is already a member of the group chat' });
      }
      groupChat.members.push({ user: userId });
      const updatedGroupChat = await groupChat.save();
      res.status(201).json(updatedGroupChat);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Remove a user from a group chat
  removeUserFromGroupChat: async (req, res) => {
    try {
      const groupChat = await Groupchat.findById(req.params.id);
      if (!groupChat) {
        return res.status(404).json({ error: 'Group chat not found' });
      }
      const userId = req.body.userId;
      const memberIndex = groupChat.members.findIndex(member => member.user.toString() === userId);
      if (memberIndex === -1) {
        return res.status(400).json({ error: 'User is not a member of the group chat' });
      }
      groupChat.members.splice(memberIndex, 1);
      const updatedGroupChat = await groupChat.save();
      res.status(200).json(updatedGroupChat);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}
