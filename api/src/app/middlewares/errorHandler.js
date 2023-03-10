module.exports = (error, _req, res, _next) => {
  console.log(error);
  res.sendStatus(500);
};
