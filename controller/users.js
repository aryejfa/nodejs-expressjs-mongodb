const User = require("../model/users");

const logger = require("../utils/Logger");
const aes256 = require("../utils/Aes256");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const RedisClient = require("../utils/Redis");
const redisKey = "redisTokenJWT";

module.exports = {
  loginRequired: async (req, res, next) => {
    const dataTokenJWT = await RedisClient.get(redisKey);
    if (dataTokenJWT) {
      next();
    } else {
      return res
        .status(401)
        .json({ message: "Unauthorized user!!", status: false, code: 401 });
    }
  },
  login: async (req, res) => {
    const dataTokenJWT = await RedisClient.get(redisKey);

    res.render("pages/login", { page: req.url, dataTokenJWT });
  },
  sign_in: (req, res) => {
    User.findOne(
      {
        email: req.body.email,
      },
      async (err, user) => {
        if (err) throw err;
        if (!user || !user.comparePassword(req.body.password)) {
          return res.status(401).json({
            message: "Authentication failed. Invalid user or password.",
          });
        }

        const enkrip = aes256.encrypt(
          jwt.sign(
            { name: user.name, email: user.email, _id: user._id },
            "RESTFULAPIs"
          )
        );

        // console.log("Ekripsi : " + enkrip);

        // console.log("Deskripsi : " + aes256.decrypt(enkrip));

        // const resultJwt = await res.json({
        //   token: enkrip,
        // });

        // return resultJwt;

        const insertRedis = await RedisClient.set(
          redisKey,
          JSON.stringify(enkrip),
          {
            EX: (60 * 60) * 24,
          }
        );
        if (insertRedis) {
          res.redirect("users");
          console.log("Set token with redis");

          let message = {
            _id: user._id,
            name: user.name,
            email: user.email,
            status: "Login user",
          };
          logger.info(`${JSON.stringify(message, null, "\t")}`);
        }
      }
    );
  },
  index: async (req, res) => {
    const dataTokenJWT = await RedisClient.get(redisKey);

    let keyword = {};

    if (req.query.keyword) {
      keyword = { name: { $regex: req.query.keyword } };
    }

    const query = User.find(keyword);
    query.select("name email _id");
    query.exec((err, data) => {
      if (err) return handleError(err);
      const users = data;

      res.render("pages/users/index", { page: req.url, users, dataTokenJWT });
    });
  },
  create: async (req, res) => {
    const dataTokenJWT = await RedisClient.get(redisKey);

    res.render("pages/users/create", { page: req.url, dataTokenJWT });
  },
  store: (req, res) => {
    const password_encript = bcrypt.hashSync(req.body.password, 10);
    User.create(
      {
        name: req.body.name,
        email: req.body.email,
        password: password_encript,
      },
      function (err, data) {
        if (err) return handleError(err);

        res.redirect("users");
      }
    );
  },
  show: async (req, res) => {
    const dataTokenJWT = await RedisClient.get(redisKey);
    const id = req.params.userId;
    User.findById(id, function (err, data) {
      if (err) return handleError(err);

      res.render("pages/users/show", {
        page: req.url,
        users: data,
        dataTokenJWT,
      });
    });
  },
  update: (req, res) => {
    const id = req.body.id;
    User.updateOne(
      { _id: id },
      { name: req.body.name, email: req.body.email },
      { upsert: true },
      function (err) {
        if (err) return handleError(err);

        res.redirect("users");
      }
    );
  },
  delete: (req, res) => {
    const id = req.params.userId;
    User.findOneAndRemove(
      {
        _id: id,
      },
      function (err, data) {
        if (err) throw err;

        res.redirect("../users");
      }
    );
  },
  logout: async (req, res) => {
    const logout = await RedisClient.del(redisKey);
    if (logout) {
      res.redirect("/");
    }
  },
};
