const express = require("express");
const router = express.Router();
const userController = require("../controller/users");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + ".jpg");
  },
});
const upload = multer({ storage: storage });

router.route("/login").get(userController.login).post(userController.sign_in);
router
  .route("/users")
  .get(userController.loginRequired, userController.index)
  .post(
    upload.single("image"),
    userController.loginRequired,
    userController.store
  );
router.get(
  "/users/create",
  userController.loginRequired,
  userController.create
);
router.get(
  "/users/show/:userId",
  userController.loginRequired,
  userController.show
);
router.post(
  "/users_update",
  upload.single("image"),
  userController.loginRequired,
  userController.update
);
router.get(
  "/delete/:userId",
  userController.loginRequired,
  userController.delete
);
router.get("/logout", userController.logout);

module.exports = router;
