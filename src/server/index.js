'use strict';

// const { json } = require("express");
const app = require("express")();
const cors = require("cors");
const { json,urlencoded } = require("body-parser");

const apiRouter = require('./router');

const port = process.argv.port || 4000;

app.use(json({
  extended: true,
  limit: "50mb",
}));
app.use(urlencoded({ 
  extended: true,
  limit: "50mb",
}));
app.use(cors());

app.use('/api',apiRouter);

// default 404 route
app.use((req,res) => {
  console.dir(req.url);
  res.status(404).json({
    message: "Not Found"
  });
});

app.listen(port, () => console.log(`Listening on ${port}`));