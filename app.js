/* -------------------------------------------------------------------------- */
// GET all users path="/"
// POST user path="/" body.json {firstname: "", lastname: "", birthday: ""}
/* -------------------------------------------------------------------------- */

var express = require("express");
var app = express();
var port = 5000;
var bodyParser = require("body-parser");
var fs = require("fs");

app.use(express.static("public"));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  getjson(res);
});

app.post("/", (req, res) => {
  const firstname =
    req.body.firstname !== undefined ? req.body.firstname : null;
  const lastname = req.body.lastname !== undefined ? req.body.lastname : null;
  const birthday = req.body.birthday !== undefined ? req.body.birthday : null;
  const user = {
    firstname: firstname,
    lastname: lastname,
    birthday: birthday,
  };
  savetojson(user, function (err) {
    if (err) {
      res.status(400).send(`User NOT saved ERR: ${err}`);
    }
    res.status(201).send(`User saved \n${JSON.stringify(user)}`);
  });
});

function genUserId(array) {
  if (array.users.length < 1) {
    return 0;
  } else {
    return array.users[array.users.length - 1].user_id + 1;
  }
}

function getjson(response) {
  fs.readFile("./users.json", function (err, data) {
    if (err) throw err;
    let array = JSON.parse(data);

    response.status(200).send(array.users);
  });
}

function savetojson(user, callback) {
  fs.readFile("./users.json", function (err, data) {
    if (err) throw err;
    let array = JSON.parse(data);
    array.users.push(Object.assign({}, { user_id: genUserId(array) }, user));

    fs.writeFile("./users.json", JSON.stringify(array), callback);
  });
}

app.listen(port, function () {
  console.log(`Starting at http://localhost:${port}`);
});
