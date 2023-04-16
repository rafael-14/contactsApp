module.exports = (req, res, next) => {
  const allowedOrigins = ["http://localhost:3000", "http://localhost:3002"];
  const origin = req.header("origin");
  const isAllowed = allowedOrigins.includes(origin);

  if (isAllowed) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Max-Age", "10");
  }

  next();
};
