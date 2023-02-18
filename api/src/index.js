const express = require("express");
require("express-async-errors");
const routes = require("./routes");

const app = express();

app.use(express.json());
app.use(routes);
app.use((error, _req, res, _next) => {
  console.log(error);
  res.sendStatus(500);
});

app.listen(4000, () => console.log("rodando porta 4000"));
