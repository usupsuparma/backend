const express = require("express");
const app = express();
const stream = require("getstream");
const bodyParser = require("body-parser");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get("/", (req, res, next) => {
  return res.status(200).json({
    status: "test",
  });
});

app.post("/create-post", (req, res, next) => {
  // instantiate a new client (client side)

  // console.log(req.params);
  const client = stream.connect(
    process.env.API_KEY,
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXN1cCJ9.LvakeqqnheYVjSkVm7HwOu2o3MlDW13ph56vn-j3rMA",
    process.env.APP_ID
  );

  const usup = client.feed(
    "timeline_aggregated",
    client.userId,
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXN1cCJ9.LvakeqqnheYVjSkVm7HwOu2o3MlDW13ph56vn-j3rMA"
  );

  // return client.feed(
  //   "user",
  //   client.userId,
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXN1cCJ9.LvakeqqnheYVjSkVm7HwOu2o3MlDW13ph56vn-j3rMA"
  // );

  usup
    .addActivity({
      // actor: "SU:"+ client.user(usup.id),
      verb: "working",
      object: {
        name: "usup",
        address: "maja",
        job: "developer",
      },
      foreign_id: "picture:11",
      message: "kejar target hari ini",
    })
    .then((result) => {
      console.log(result);
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
  const client = stream.connect(
    process.env.API_KEY,
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXN1cC10ZXN0In0.UOdMZXAv2APzpTsqCLbbb28VlsvIsHy4o-s5rNLri8c",
    process.env.APP_ID
  );

  client.reactions
    .add(
      "comment",
      "98a906c3-8fcb-11eb-b025-12d73b08236b",
      { text: "@usup senang sekali iah anda " },
      { targetFeeds: ["notification:thierry"] }
    )
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
  const id = "jack";
  const userToken = clientServer.createUserToken(id);
  return res.status(200).json({
    token: userToken,
    id: id,
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
  const client = stream.connect(
    process.env.API_KEY,
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXN1cCJ9.LvakeqqnheYVjSkVm7HwOu2o3MlDW13ph56vn-j3rMA",
    process.env.APP_ID
  );

  const usup = client.feed(
    "timeline",
    client.userId,
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXN1cCJ9.LvakeqqnheYVjSkVm7HwOu2o3MlDW13ph56vn-j3rMA"
  );

  usup
    .get({ limit: 5, offset: 5 })
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
