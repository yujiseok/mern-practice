const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const config = require("./config/key");
const { User } = require("./models/User");

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// application/json
app.use(bodyParser.json());

mongoose
  .connect(config.mongoURI)
  .then(() => console.log("db connected"))
  .catch((err) => console.err(err));

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.post("/register", (req, res) => {
  // 회원 가입시 필요한 정보를 클라이언트에서 가져온 후 데이터베이스에 넣어준다.

  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.status(200).json({ success: true });
  });
});

app.listen(port, () => {
  console.log(`서버 돌아가는 중 포트는 ${port}`);
});
