const express = require('express');
const passport = require('passport')
const router = express.Router()

//for logging in and logging out

router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/experiences')
    }
)

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

module.exports = router