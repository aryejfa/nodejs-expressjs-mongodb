const express = require("express");
const router = express.Router();
const userController = require("../controller/users");

router.route("/users").get(userController.index).post(userController.store);
router.get("/users/create", userController.create);
router.get("/users/show/:userId", userController.show);
router.post("/users_update", userController.update);
router.put("/users/:userId", userController.update);
router.delete("/users/:userId", userController.delete);
router.get("/delete/:userId", userController.delete);

module.exports = router;
