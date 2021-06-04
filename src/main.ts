import express from "express";
import cors from "cors";

const app = express();

// body-parserの設定
// URLエンコードされたデータの解析を許可
app.use(express.urlencoded({ extended: true }));
// JSONを解析
app.use(express.json());

const port = process.env.PORT || 3000; // port番号を指定

// API作成
app.get("/helloWorld", (req, res) => {
  res.status(200).send({ message: "hello, world" });
});

//サーバ起動
app.listen(port);
console.log(`listen on port ${port} `);
