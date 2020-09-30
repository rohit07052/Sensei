const googleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')


//inporting user model
const User = require('../models/User')


module.exports = (passport) => {


    //for login ...........check if user exists
    passport.use(
        new googleStrategy({
                clientID: process.env.GOOGLE_ID,
                clientSecret: process.env.GOOGLE_SECRET,
                callbackURL: '/auth/google/callback',
            },
            async function(accessToken, refreshToken, profile, done) {
                const newUser = {
                    googleId: profile.id,
                    displayName: profile.displayName,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    image: profile.photos[0].value

                }
                try {
                    //console.log('in login');

                    // checking if user already exists in Db
                    let user = await User.findOne({ googleId: profile.id })

                    // if user exists just login
                    if (user) {
                        done(null, user)
                            //console.log('login')

                        //else create and save the info of user to the database
                    } else {
                        user = await User.create(newUser)
                        done(null, user)
                            //console.log('sign up first')

                    }

                } catch (err) {

                    console.error(err)
                }
            }
        )
    )

    /*passport.use(
        new googleStrategy({
                clientID: process.env.GOOGLE_ID,
                clientSecret: process.env.GOOGLE_SECRET,
                callbackURL: '/auth/google/signup/callback',
            },

            async function(accessToken, refreshToken, profile, done) {

                const newUser = {
                    googleId: profile.id,
                    displayName: profile.displayName,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    image: profile.photos[0].value

                }

                try {
                    let user = await User.findOne({ googleId: profile.id })

                    if (user) {
                        done(null, user)
                        console.log('already signed up')
                    } else {
                        user = await User.create(newUser)
                        done(null, user)
                    }
                } catch (err) {
                    console.log('here')
                    console.error(err)
                }
            }


        )
    )*/
    //logging in
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user))

    })

}