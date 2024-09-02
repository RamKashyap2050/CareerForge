const express = require("express");
const {
  login,
  signup,
  skillsuggest,
  experienceSuggest,
} = require("../controllers/usercontroller");

const router = express.Router();

router.route("/login").post(login);
router.route("/signup").post(signup);
router.route("/getskills").get(skillsuggest);
router.route("/getexperience").get(experienceSuggest);
module.exports = router;
