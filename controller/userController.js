const model = require("../model/index");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const controller = {};

controller.getAll = async function (req, res) {
    try {
        const userData = await model.user.findAll();
        if (userData.length > 0) {
            res
                .status(200)
                .json({ message: "Connection successful", data: userData });
        } else {
            res.status(200).json({ message: "Connection failed", data: [] });
        }
    } catch (error) {
        res.status(404).json({ message: error });
    }
};

controller.login = async function (req, res) {
    try {
        const { username, password } = req.body;
        if (!(username && password)) {
            res.status(400).send("username and password are required");
        }
        const userCek = await model.user.findAll({
            where: { [Op.and]: [{ username: username }, { password: password }] },
        });
        if (userCek.length > 0) {
            const token = jwt.sign(
                {
                    username: username,
                    password: password,
                    iat: Math.floor(Date.now()),
                },
                process.env.TOKEN_JWT,
                {
                    expiresIn: "24h",
                }
            );
            await model.user.update(
                {
                    token: token,
                },
                {
                    where: { [Op.and]: [{ username: username }, { password: password }] },
                }
            );
            const userUpdate = await model.user.findAll({
                where: { [Op.and]: [{ username: username }, { password: password }] },
            });
            res.status(200).json({ "status": true, "data": userUpdate[0] });
        } else {
            res.status(400).json({ "status": false, message: "Invalid username or password" });
        }
    } catch (error) { }
};

controller.createNew = async function (req, res) {
    try {
        //   check data has already been created
        const checkData = await model.user.findAll({
            where: {
                [Op.or]: {
                    username: req.body.username,
                    password: req.body.password,
                },
            },
        });
        if (checkData.length > 0) {
            res.status(500).json({ message: "username/password has already in use" });
        } else {
            await model.user
                .create({
                    name: req.body.name,
                    username: req.body.username,
                    password: req.body.password,
                    token: req.body.username + req.body.password,
                })
                .then((result) => {
                    res.status(201).json({
                        message: "user successful created", data: {
                            name: req.body.name,
                            username: req.body.username,
                            password: req.body.password,
                            token: req.body.username + req.body.password,
                        },
                    });
                });
        }
    } catch (error) {
        res.status(404).json({ message: error });
    }
};

controller.editAt = async function (req, res) {
    try {
        await model.user
            .findAll({ where: { id: req.body.id } })
            .then(async (result) => {
                if (result.length > 0) {
                    await model.user.update(
                        {
                            name: req.body.name,
                            username: req.body.username,
                            password: req.body.password,
                            token: req.body.username + req.body.password,
                        },
                        { where: { id: req.body.id } }
                    );
                    res.status(200).json({
                        message: "update successful",
                        data: {
                            id: req.body.id,
                            name: req.body.name,
                            username: req.body.username,
                            password: req.body.password,
                            token: req.body.username + req.body.password,
                        },
                    });
                } else {
                    res.status(500).json({ message: "update failed" });
                }
            });
    } catch (error) {
        res.status(404).json({ message: error });
    }
};
controller.deleteUser = async function (req, res) {
    try {
        await model.user
            .findAll({ where: { id: req.body.id } })
            .then(async (result) => {
                if (result.length > 0) {
                    await model.user.destroy({ where: { id: req.body.id } });
                    res.status(200).json({ message: "delete user successfully" });
                } else {
                    res.status(404).json({ message: "id user not found" });
                }
            });
    } catch (error) {
        res.status(404).json({ message: error });
    }
};

module.exports = controller;