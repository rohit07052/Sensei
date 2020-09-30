const express = require("express")
const router = express.Router()

const { Guest } = require('../middleware/auth')

//
router.get("/", Guest, (req, res) => {
    res.render('loginviews', { layout: "login" })
})

module.exports = router