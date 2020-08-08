const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const token = req.query.token;
  if (!token) return res.status(401).send('Access Denied'); // The user not signed in

  try {
    const veryfied = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = veryfied;
    next();
  } catch (err) {
    //Checking if the token is real and nobody messes with it
    res.status(400).send('Invalid Token');
  }
}

module.exports = auth;
