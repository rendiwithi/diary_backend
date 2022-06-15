const express = require("express");
const router = express.Router();
const controller = require("../controller/indexController");
router.get("/:idUser", controller.note.getAll);
router.post("/", controller.note.createNew);
router.delete("/", controller.note.deleteNote);
router.put("/", controller.note.editAt);
module.exports = router;