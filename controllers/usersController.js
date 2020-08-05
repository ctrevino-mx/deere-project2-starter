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
  console.log(
    "###################### HITTING UPDATE FOR USERS ################################",
    req.user.id
  );
  UserModel.update(req.body, {
    where: { id: req.user.id },
    returning: true,
  }).then(() => {
    res.redirect(`/users/profile/${req.user.id}`);
  });
});

// DELETE ROUTE - DELETE AN EXPENSE
router.delete("/", (req, res) => {
  console.log(
    "###################### HITTING DELETE FOR USERS ################################",
    req.user.id
  );
  UserModel.destroy({ where: { id: req.user.id } }).then(() => {
    res.redirect("/");
  });
});

module.exports = router;
