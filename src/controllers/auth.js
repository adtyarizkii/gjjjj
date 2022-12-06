const User = require('../../models/User')
const Bro = require('joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const db = require("../database/connection");
const { QueryTypes } = require("sequelize");


exports.register = async (req, res) => {
    const schema = Bro.object({
        name: Bro.string().min(10).required(),
        email: Bro.string().email().min(6).required(),
        password: Bro.string().min(6).required(),
    })

    const { error } = schema.validate(req.body)

    if (error)
    return res.status(400).send({
        error: {
            message: error.details[0].message,
        }
    })

    try {
        const asin = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, asin);

        const query = `SELECT email FROM Users WHERE email='${req.body.email}'`
        const userExist = await db.sequelize.query(query, { type: QueryTypes.SELECT })

        console.log(userExist);

        if (userExist.length != 0){
            return res.status(401).send({
                status: "Gagal!",
                message: "Email sudah terdaftar!"
            })
        }

        const register = `INSERT INTO Users (NAME, STATUS, email, PASSWORD) VALUES ('${req.body.name}', 'VISITOR', '${req.body.email}','${hashPassword}');`
        
        await db.sequelize.query(register)

        console.log(register);
        
        const token = jwt.sign({ id: User.id }, process.env.TOKEN_KEY)

        res.status(200).send({
            status: "Berhasil!",
            data: {
                token
            },
            register
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: 'Gagal!',
            message: 'Silahkan hubungi bagian IT!',
        })
    }
}

exports.getAllUsers = async (req, res) => {
    try {

        const query = `SELECT * FROM Users;`
        const data = await db.sequelize.query(query, { type: QueryTypes.SELECT })

        console.log(data);
        res.send({
            status: 'success',
            data: {
                account: data
            },
        })
    } catch (error) {
        console.log(error)
        res.send({
            status: 'failed',
            message: 'Server Error'
        })
    }
}
