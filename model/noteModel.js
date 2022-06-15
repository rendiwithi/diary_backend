const sequelize = require("sequelize");
const db = require("../config/database");
const user = require('./userModel')
var note = db.define(
    "note",
    {
        id: { type: sequelize.INTEGER, primaryKey: true },
        tanggal: { type: sequelize.STRING },
        judul: { type: sequelize.STRING },
        catatan: { type: sequelize.STRING },
        id_user: { type: sequelize.INTEGER },
        img: { type: sequelize.STRING },
        isFav: { type: sequelize.BOOLEAN },
    },
    {
        // freeze name table not using *s on name
        freezeTableName: true,
        // dont use createdAt/update
        timestamps: false,
    }
);
note.belongsTo(user, { foreignKey: 'id_user' })
module.exports = note;