const model = require("../model/index");
const { Op } = require("sequelize");
const controller = {};

controller.getAll = async function (req, res) {
    try {
        const noteData = await model.note.findAll({
            where: { id_user: { [Op.like]: `%${req.params.idUser}%` } },
        });
        if (noteData.length > 0) {
            res
                .status(200)
                .json({ "status": true, message: "Connection successful", data: noteData });
        } else {
            res.status(200).json({ "status": false, message: "Connection failed", data: [] });
        }
    } catch (error) {
        res.status(404).json({ "status": false, message: error });
    }
};

controller.createNew = async function (req, res) {
    try {
        await model.note
            .create({
                tanggal: req.body.tanggal,
                judul: req.body.judul,
                catatan: req.body.catatan,
                id_user: req.body.iduser,
            })
            .then((result) => {
                res.status(201).json({
                    "status": true,
                    message: "note successful created", data: {
                        tanggal: req.body.tanggal,
                        judul: req.body.judul,
                        catatan: req.body.catatan,
                        id_user: req.body.iduser,
                    },
                });
            });
    } catch (error) {
        res.status(404).json({ "status": false, message: error });
    }
};

controller.editAt = async function (req, res) {
    try {
        await model.note
            .findAll({ where: { id: req.body.id } })
            .then(async (result) => {
                if (result.length > 0) {
                    await model.note.update(
                        {
                            isFav: !result[0].isFav
                        },
                        { where: { id: req.body.id } }
                    );
                    res.status(200).json({
                        "status": true,
                        message: "update successful",

                    });
                } else {
                    res.status(500).json({
                        "status": false,
                        message: "update failed"
                    });
                }
            });
    } catch (error) {
        res.status(404).json({ message: error });
    }
};
controller.deleteNote = async function (req, res) {
    try {
        await model.note
            .findAll({ where: { id: req.body.id } })
            .then(async (result) => {
                if (result.length > 0) {
                    await model.note.destroy({ where: { id: req.body.id } });
                    res.status(200).json({ "status": true, message: "delete note successfully" });
                } else {
                    res.status(404).json({ "status": false, message: "id note not found" });
                }
            });
    } catch (error) {
        res.status(404).json({ message: error });
    }
};

module.exports = controller;