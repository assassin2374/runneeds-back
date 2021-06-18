// getAll作成
app.get("/", async (req, res) => {
  // SQLクエリ実行
  const sqlQuery = {
    text: "SELECT * FROM users",
  };
  const result = await pgClient.query<User>(sqlQuery);
  // User型に格納（created_at、updated_atが残るエラー）
  const users = result.rows.map((user) => {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      pass: user.pass,
    } as User;
  });
  console.log(users);

  res.status(200).json(users);
});
