const express = require("express");
const { signup, login, googleAuth, googleCallback } = require("../controllers/authController");
const passport = require("../config/passport");
const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.get("/google", (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(501).json({ message: "Google OAuth not configured" });
  }

  req.logout((err) => {
    if (err) {
      return next(err);
    }
    googleAuth(req, res, next);
  });
});
router.get(
  "/google/callback",
  (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return res.status(501).json({ message: "Google OAuth not configured" });
    }
    return next();
  },
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
    session: false,
  }),
  googleCallback
);
module.exports = router;
