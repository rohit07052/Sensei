const express = require("express")
const router = express.Router()

const { Auth } = require('../middleware/auth')

const Exp = require('../models/Exp')

const { route } = require("./login")
    //

router.get("/add", Auth, (req, res) => {
    res.render('experiences/add')
})


router.post('/', Auth, async(req, res) => {
    try {
        req.body.user = req.user.id
        await Exp.create(req.body) //for getting experience from the user
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

router.get('/', Auth, async(req, res) => {
    try {
        const experiences = await Exp.find()
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean()
            //console.log(experiences)
            //passing experiences to hbs 
        res.render('experiences/index', {
            experiences
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})
router.get('/:id', Auth, async(req, res) => {
    try {
        let experience = await Exp.findById(req.params.id).populate('user').lean()

        if (!experience) {
            return res.render('error/404')
        } else {
            res.render('experiences/show', {
                experience,
            })
        }
    } catch (err) {
        console.error(err)
        res.render('error/404')
    }
})


router.put("/:id", Auth, async(req, res) => {
    try {
        var experience = await Exp.findById(req.params.id).lean()
        console.log('lisn')
        console.log(experience)
        if (!experience) {
            return res.render('error/404')
        }
        if (experience.user != req.user.id) {
            res.redirect('/experiences')
        } else {

            experience = await Exp.findByIdAndUpdate({ _id: req.params.id }, req.body, {
                new: true,
                runValidators: true,
            })
            res.redirect('/experiences')
        }
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})

router.get("/edit/:id", Auth, async(req, res) => {
    try {
        const experience = await Exp.findOne({
            _id: req.params.id
        }).lean()

        if (!experience) {
            res.render('error/404')
        }
        if (experience.user != req.user.id) {
            res.redirect('/experiences')
        } else {
            res.render('experiences/edit', {
                experience,
            })
        }
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})

router.delete('/:id', Auth, async(req, res) => {
    try {
        await Exp.remove({ _id: req.params.id })
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})

router.get('/user/:userId', Auth, async(req, res) => {
    try {
        const experiences = await Exp.find({
                user: req.params.userId,

            })
            .populate('user')
            .lean()

        res.render('experiences/index', {
            experiences
        })

    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})


module.exports = router