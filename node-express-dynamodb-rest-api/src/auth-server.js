const jwt = require("jsonwebtoken");
//AUTHENTICATE LOGIN AND RETURN JWT TOKEN
app.post("/login", async (req, res) => {
  //   const user = users.find((c) => c.user == req.body.name);
  //   //check to see if the user exists in the list of registered users
  //   if (user == null) res.status(404).send("User does not exist!");
  //   //if user does not exist, send a 400 response
  //   if (await bcrypt.compare(req.body.password, user.password)) {

  //     res.json({ accessToken: accessToken, refreshToken: refreshToken });
  //   } else {
  //     res.status(401).send("Password Incorrect!");
  //   }

  const accessToken = generateAccessToken({ user: req.body.name });
  const refreshToken = generateRefreshToken({ user: req.body.name });

  res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

// accessTokens
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}
// refreshTokens
let refreshTokens = [];

function generateRefreshToken(user) {
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "20m",
  });
  refreshTokens.push(refreshToken);
  return refreshToken;
}

app.post("/refreshToken", (req, res) => {
  if (!refreshTokens.includes(req.body.token))
    res.status(400).send("Refresh Token Invalid");
  refreshTokens = refreshTokens.filter((c) => c != req.body.token);
  //remove the old refreshToken from the refreshTokens list
  const accessToken = generateAccessToken({ user: req.body.name });
  const refreshToken = generateRefreshToken({ user: req.body.name });
  //generate new accessToken and refreshTokens
  res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

app.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((c) => c != req.body.token);
  //remove the old refreshToken from the refreshTokens list
  res.status(204).send("Logged out!");
});
