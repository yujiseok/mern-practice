const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/key");
const { User } = require("./models/User");

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// application/json
app.use(bodyParser.json());
app.use(cookieParser());

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

app.post("/login", (req, res) => {
  // 요청된 이메일을 데이터베이스에서 찾는다
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "이메일에 해당하는 유저가 없습니다.",
      });
    }

    // 이메일이 데이터베이스에 있으면, 비밀번호 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다.",
        });
      }
    });

    // 비밀번호도 맞다면, 토큰 생성
    user.generateToken((err, user) => {
      if (err) {
        return res.status(400).send(err);
      }
      // 토큰을 저장 -> 어디에? 쿠키, 로컬스토리지

      res.cookie("x_auth", user.token).status(200).json({
        loginSuccess: true,
        userId: user._id,
      });
    });
  });
});

app.listen(port, () => {
  console.log(`서버 돌아가는 중 포트는 ${port}`);
});
