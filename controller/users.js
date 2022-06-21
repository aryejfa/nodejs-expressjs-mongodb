const { v4: uuidv4 } = require("uuid");

const User = require("../model/users");
const logger = require("../utils/Logger");

// let users = [
//   { id: "1", name: "EKO", email: "eko@gmail.com" },
//   { id: "2", name: "JAYA", email: "jaya@gmail.com" },
// ];

module.exports = {
  index: (req, res) => {
    // if (users.length > 0) {
    //   res.json({
    //     status: true,
    //     method: req.method,
    //     url: req.url,
    //     data: users,
    //   });
    // } else {
    //   res.json({
    //     status: false,
    //     message: "Data is empty",
    //   });
    // }

    let keyword = {};

    if (req.query.keyword) {
      keyword = { name: { $regex: req.query.keyword } };
    }

    // User.find(keyword, "name _id", function (err, data) {
    //   if (err) return handleError(err);
    //   console.log(data);

    //   const users = data;

    //   res.render("pages/users/index", { users });
    // });

    const query = User.find(keyword);
    query.select("name _id");
    query.exec(function (err, data) {
      if (err) return handleError(err);
      console.log(data);

      const users = data;
      res.render("pages/users/index", { users });
    });
  },
  create: (req, res) => {
    res.render("pages/users/create");
  },
  store: (req, res) => {
    // users.push({
    //   id: uuidv4(),
    //   name: req.body.name,
    //   email: req.body.email,
    // });

    // const user = new User({
    //   name: req.body.name,
    //   email: req.body.email,
    //   password: req.body.password,
    // });

    // user.save(function (err, data) {
    //   if (err) return handleError(err);
    //   console.log(data);
    // });

    User.create(
      {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      },
      function (err, data) {
        if (err) return handleError(err);
        let message = {
          _id: data._id,
          name: data.name,
          email: data.email,
          status: "Register user",
        };
        logger.info(`${JSON.stringify(message, null, "\t")}`);
      }
    );

    res.redirect("users");

    // res.json({
    //   status: true,
    //   method: req.method,
    //   url: req.url,
    //   message: "Succes add data",
    //   data: users,
    // });
  },
  show: (req, res) => {
    const id = req.params.userId;
    // const data = users.filter((user) => {
    //   return user.id == id;
    // });

    User.findById(id, function (err, data) {
      if (err) return handleError(err);
      console.log(data);

      res.render("pages/users/show", { users: data });
    });
  },
  update: (req, res) => {
    // const id = req.params.userId;
    // users.filter((user) => {
    //   if (user.id == id) {
    //     user.id = id;
    //     user.name = req.body.name;
    //     user.email = req.body.email;
    //     return user;
    //   }
    // });
    // res.json({
    //   status: true,
    //   method: req.method,
    //   url: req.url,
    //   message: "Succes update data",
    //   data: users,
    // });

    const id = req.body.id;
    // users.filter((user) => {
    //   if (user.id == id) {
    //     user.id = id;
    //     user.name = req.body.name;
    //     user.email = req.body.email;

    //     return user;
    //   }
    // });
    User.updateOne(
      { _id: id },
      { name: req.body.name, email: req.body.email },
      { upsert: true },
      function (err) {
        if (err) return handleError(err);

        // logger.info("Update users", {
        //   id: `${id}`,
        //   name: `${req.body.name}`,
        //   email: `${req.body.email}`,
        //   status: `Update users id ${id}`,
        // });

        let message = {
          _id: id,
          name: req.body.name,
          email: req.body.email,
          status: "Update user",
        };
        logger.info(`${JSON.stringify(message, null, "\t")}`);

        res.redirect("users");
      }
    );
  },
  delete: (req, res) => {
    const id = req.params.userId;
    // users = users.filter((user) => user.id != id);
    // res.json({
    //   status: true,
    //   method: req.method,
    //   url: req.url,
    //   message: "Succes delete data",
    //   data: users,
    // });

    User.findOneAndRemove(
      {
        _id: id,
      },
      function (err, data) {
        if (err) throw err;
        let message = {
          _id: data._id,
          name: data.name,
          email: data.email,
          status: "Delete user",
        };
        logger.info(`${JSON.stringify(message, null, "\t")}`);
      }
    );

    res.redirect("../users");
  },
};
