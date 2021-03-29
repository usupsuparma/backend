const express = require("express");
const app = express();
const stream = require("getstream");
const bodyParser = require("body-parser");

// parse application/x-www-form-urlencoded
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res, next) => {
  return res.status(200).json({
    status: "test",
  });
});

app.post("/create-post", (req, res, next) => {
  // instantiate a new client (client side)

  let token = req.headers.api_key;
  let { message, verb, object, foreign_id } = req.body;
  const client = stream.connect(process.env.API_KEY, token, process.env.APP_ID);
  const user = client.feed("timeline", client.userId, token);

  user
    .addActivity({
      // actor: "SU:"+ client.user(usup.id),
      verb: verb,
      object: object,
      foreign_id: foreign_id,
      message: message,
    })
    .then((result) => {
      res.status(200).json({
        status: "success",
        data: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        status: "failed",
        data: null,
      });
    });
});

app.post("/create-reaction", (req, res, next) => {
  // adds a comment reaction to the activity and notifies Thierry's notification feed
  const token = req.headers.api_key;
  const { activity_id, kind, message, target_feeds } = req.body;
  const client = stream.connect(process.env.API_KEY, token, process.env.APP_ID);

  client.reactions
    .add(kind, activity_id, message, target_feeds)
    .then((result) => {
      res.status(200).json({ status: "success", data: result });
    })
    .catch((err) => {
      res.status(400).json({ status: "failed", data: err });
    });
});

app.post("/create-token", (req, res) => {
  // instantiate a new client (server side)
  const clientServer = stream.connect(process.env.API_KEY, process.env.SECRET);
  const user = req.body.user;
  console.log(user);
  // const id = "jack";
  const userToken = clientServer.createUserToken(user);
  return res.status(200).json({
    token: userToken,
    id: user,
  });
});

app.post("/create-user", (req, res, next) => {
  const { name, job, gender } = req.body;
  console.log(req.body);
  const client = stream.connect(process.env.API_KEY, process.env.SECRET);
  client
    .user("jack")
    .create({
      name: "jack testing",
      occupation: "Traveler",
      gender: "male",
    })
    .then((result) => {
      console.log(res);
      res.status(201).json({
        status: "success",
        data: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({
        status: "failed",
        data: null,
        error: err,
      });
    });
});

app.get("/posts", (req, res, next) => {
  let token = req.headers.api_key;
  const client = stream.connect(process.env.API_KEY, token, process.env.APP_ID);

  const user = client.feed("timeline", client.userId, token);

  user
    .get()
    .then((result) => {
      res.status(200).json({
        status: "success",
        data: result,
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "failed",
        data: null,
        error: err,
      });
    });
});

app.get("/reactions", (req, res) => {
  let token = req.headers.api_key;
  let activity_id = req.body.activity_id;
  const client = stream.connect(process.env.API_KEY, token, process.env.APP_ID);
  client.reactions
    .filter({
      activity_id: activity_id,
    })
    .then((result) => {
      res.status(200).json({
        status: "success",
        data: result,
      });
    })
    .catch((err) => {
      res.status(403).json({
        status: "failed",
        data: null,
        error: err,
      });
    });
});

const port = 3000;
app.listen(port, () => {
  require("dotenv").config();
  console.log("Running in port: " + port);
  console.log(process.env.API_KEY);
  console.log(process.env.APP_ID);
  // const client = stream.connect("hqfuwk78kb3n", null, process.env.APP_ID);
  // const usupFeed = client.feed(
  //   "user",
  //   "usup",
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXN1cCJ9.LvakeqqnheYVjSkVm7HwOu2o3MlDW13ph56vn-j3rMA"
  // );
  // console.log(usupFeed.userId);
  console.log("=============================================================");
});
