const express = require("express");
const {
  login,
  signup,
  skillsuggest,
  experienceSuggest,
  logout,
  SummarySuggest,
  updateUserProfile,
  getUserProfile,
  updateProfilePhoto
} = require("../controllers/usercontroller");

const router = express.Router();

router.route("/login").post(login);
router.route("/profileupdate").put(updateUserProfile)
router.route("/profilephotoupdate").put(updateProfilePhoto)
router.route("/getprofile").get(getUserProfile)
router.route("/signup").post(signup);
router.route("/getskills").get(skillsuggest);
router.route("/getexperience").get(experienceSuggest);
router.route("/getsummary").get(SummarySuggest);
router.route("/logout").post(logout);
module.exports = router;
