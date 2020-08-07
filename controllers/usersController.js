const express = require("express");
const router = express.Router();

const UserModel = require("../models").User;

// GET USERS PROFILE
router.get("/profile/:id", (req, res) => {
  UserModel.findByPk(req.params.id).then((userProfile) => {
    res.render("users/profile.ejs", {
      user: userProfile,
    });
  });
});

// UPDATE USER PROFILE ROUTE
router.put("/profile/", (req, res) => {
  UserModel.update(req.body, {
    where: { id: req.user.id },
    returning: true,
  }).then(() => {
    res.redirect(`/users/profile/${req.user.id}`);
  });
});

// DELETE ROUTE - DELETE A USER
router.delete("/", (req, res) => {
  UserModel.destroy({ where: { id: req.user.id } }).then(() => {
    res.redirect("/");
  });
});

module.exports = router;
