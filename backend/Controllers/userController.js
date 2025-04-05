const User = require("../Models/user");
const Notification = require("../Models/notification");

exports.getProfile = async (req, res, next) => {
  try {
    // Using req.userId provided by verifyToken middleware
    const user = await User.findById(req.userId).populate("followedTournaments");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.getNotifications = async (req, res, next) => {
  try {
    const username = req.query.username;
    const user = await User.findOne({ username });
    if (!user)
      return res.status(404).json({ error: "User not found" });
    const notifications = await Notification.find({ user: user._id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

exports.createNotification = async (req, res, next) => {
  try {
    const { username, message } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.status(404).json({ error: "User not found" });
    const newNotification = new Notification({ user: user._id, message });
    await newNotification.save();

    const io = req.app.get("io");
    io.emit("notification", { username, message });
    res.json({ message: "Notification created" });
  } catch (error) {
    next(error);
  }
};
