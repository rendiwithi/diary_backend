const userController = require("./userController");
const noteController = require("./noteController");
var controllers = {};
controllers.user = userController;
controllers.note = noteController;
module.exports = controllers;