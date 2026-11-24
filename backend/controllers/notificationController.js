const Notification = require('../models/notification')

// Get notifications for logged-in user
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user._id,
    })
      .populate('sender', 'username')
      .populate('recipe', 'title')
      .sort({ createdAt: -1 })

    res.status(200).json(notifications)
  } catch (error) {
    console.error('Get notifications error:', error)
    res.status(500).json({
      message: error.message,
    })
  }
}

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        recipient: req.user._id,
      },
      { isRead: true },
      { new: true }
    )

    if (!notification) {
      return res.status(404).json({
        message: 'Notification not found',
      })
    }

    res.status(200).json(notification)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = {
  getNotifications,
  markAsRead,
}