const express = require("express")
const router = express.Router()
const { Auth } = require('../middleware/auth')
const Exp = require('../models/Exp')
    //
router.get("/dashboard", Auth, async(req, res) => {
    try {
        const experiences = await Exp.find({ user: req.user.id }).lean()
        res.render('dashboard', {
            name: req.user.firstName,
            image: req.user.image,
            experiences
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

module.exports = router