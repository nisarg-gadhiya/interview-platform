import User from "../models/user.model.js";

export const processPayment = async (req, res) => {
  try {
    const { credits } = req.body;

    const userId = req.user.id;

    const success = Math.random() > 0.2;

    if (!success) {
      return res.json({ success: false, message: "Payment failed" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.credits += credits;

    await user.save();

    return res.json({
      success: true,
      message: "Payment successful",
      totalCredits: user.credits,
    });

  } catch (error) {
    console.log("Payment error:", error);
    return res.status(500).json({ success: false });
  }
};