import Notification from "../models/Notification.js";

/* ================= GET NOTIFICATIONS ================= */
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;

    const notifications = await Notification.find({ user: userId })
      .populate("sender", "username")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ notifications });
  } catch (error) {
    console.error("getNotifications error:", error);
    return res.status(500).json({ message: error.message });
  }
};

/* ================= MARK AS READ ================= */
export const markAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { notificationId } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId }, // 🔒 ownership check
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      notificationId: notification._id,
    });
  } catch (error) {
    console.error("markAsRead error:", error);
    return res.status(500).json({ message: error.message });
  }
};
