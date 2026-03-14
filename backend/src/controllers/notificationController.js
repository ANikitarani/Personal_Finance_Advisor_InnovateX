const Notification = require("../models/notification");
const User = require("../models/user");
const nodemailer = require("nodemailer");
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS  
  }
});

const sendEmailNotification = async (userEmail, subject, message) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: subject,
      text: message
    });
    console.log('Email sent to', userEmail);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
exports.createNotification = async (userId, type, message) => {
  try {
    const notification = new Notification({
      userId,
      type,
      message
    });
    await notification.save();
    const user = await User.findById(userId);
    if (user && user.email) {
      await sendEmailNotification(user.email, `Expense Notification: ${type}`, message);
    }
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.find({ userId }).sort({ date: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications", error });
  }
};
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { read: true });
    res.json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Error marking as read", error });
  }
};
exports.broadcastNotification = async (type, message) => {
  try {
    const users = await User.find({});
    let count = 0;
    for (const user of users) {
      await createNotification(user._id, type, message);
      count++;
    }
    console.log(`Broadcast notification sent to ${count} users`);
    return count;
  } catch (error) {
    console.error('Error broadcasting notification:', error);
    throw error;
  }
};
