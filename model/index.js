const userModel = require("./userModel");
const noteModel = require("./noteModel");
const model = {};
model.user = userModel;
model.note = noteModel;
module.exports = model;