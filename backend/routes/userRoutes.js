const express = require("express");
const {
  login,
  signup,
  skillsuggest,
  experienceSuggest,
  logout,
  SummarySuggest,
} = require("../controllers/usercontroller");

const router = express.Router();

router.route("/login").post(login);
router.route("/signup").post(signup);
router.route("/getskills").get(skillsuggest);
router.route("/getexperience").get(experienceSuggest);
router.route("/getsummary").get(SummarySuggest);
router.route("/logout").post(logout);
module.exports = router;
