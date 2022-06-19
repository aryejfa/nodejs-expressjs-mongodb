const { v4: uuidv4 } = require("uuid");

let users = [
  { id: "1", name: "EKO", email: "eko@gmail.com" },
  { id: "2", name: "JAYA", email: "jaya@gmail.com" },
];

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
    res.render("pages/users/index", { users });
  },
  create: (req, res) => {
    res.render("pages/users/create");
  },
  store: (req, res) => {
    users.push({
      id: uuidv4(),
      name: req.body.name,
      email: req.body.email,
    });

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
    const data = users.filter((user) => {
      return user.id == id;
    });

    res.render("pages/users/show", { users: data });
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
    users.filter((user) => {
      if (user.id == id) {
        user.id = id;
        user.name = req.body.name;
        user.email = req.body.email;

        return user;
      }
    });

    res.redirect("users");
  },
  delete: (req, res) => {
    const id = req.params.userId;
    users = users.filter((user) => user.id != id);
    res.json({
      status: true,
      method: req.method,
      url: req.url,
      message: "Succes delete data",
      data: users,
    });
  },
};
