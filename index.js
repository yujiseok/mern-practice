const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://jiseok:1234@cluster0.qqrna.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("db connected"))
  .catch((err) => console.err(err));

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(port, () => {
  console.log(`서버 돌아가는 중 포트는 ${port}`);
});
