const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');
const User =require('../models/user');
const mongoose = require('mongoose')


passport.use(User.createStrategy());

//here we take the user from callback function and grab info from user and stuff in cookie to send across browser
passport.serializeUser((user,done)=>{
    done(null,user.id);
});

//deserializing 
passport.deserializeUser((id,done)=>{
    User.findById(id).then((user)=>{
    done(null,user);
    });
   
});

passport.use(
    new GoogleStrategy({
        // options for google strategy
        callbackURL:'/auth/google/redirect',
        clientID: keys.google.clientID,
        clientSecret:keys.google.clientSecret
        //accessToken is used to access the users profile,mails
        //refreshtoken is cause the accesstoken expires after a while
        //profile is the one that brings back info from google
        //done fucntion is called after we are done with callback
    },   function(accessToken, refreshToken, profile, done) {
        //check user table for anyone with a facebook ID of profile.id
        console.log(profile)
        console.log(accessToken)
        User.findOne({
            'googleId': profile.id 
        }, function(err, user) {
            if (err) {
                return done(err);
            }
            //No user was found... so create a new user with values from Facebook (all the profile. stuff)
            if (!user) {
                user = new User({
                    name: profile.displayName,
                    lastname :profile.name.givenName,
                    email: profile.emails[0].value,
                    username: profile.username,
                    googleId : profile.id,
                    //provider: 'facebook',
                    //role: 1,
                    //secret : accessToken
                    //now in the future searching on User.findOne({'facebook.id': profile.id } will match because of this next line
                    //facebook: profile._json
                });
                user.save(function(err) {
                    if (err) console.log(err);
                    return done(err, user);
                });
            } else {
                //found user. Return
                return done(err, user);
            }
        });
    })
);

