const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findById(id).then(user => {
		done(null, user);
	});
});

passport.use(
	new GoogleStrategy(
		{
			clientID: keys.googleClientID,
			clientSecret: keys.googleClientSecret,
			callbackURL: '/auth/google/callback'
		},
		(accessToken, refreshToken, profile, done) => {
			User.findOne({ googleID: profile.id }).then(existingUser => {
				if (existingUser) {
					// we already have a record with a given profile ID
					done(null, existingUser);
				} else {
					// we don't have the user record with this ID, make a new record
					new User({ googleID: profile.id })
						.save()
						.then(user => done(null, user));
				}
			});
		}
	)
);

passport.use(
	new FacebookStrategy(
		{
			clientID: keys.facebookClientID,
			clientSecret: keys.facebookClientSecret,
			callbackURL: '/auth/facebook/callback'
		},
		(accessToken, refreshToken, profile, done) => {
			User.findOne({ facebookID: profile.id }).then(existingUser => {
				if (existingUser) {
					// we already have a record with a given profile ID
					done(null, existingUser);
				} else {
					// we don't have the user record with this ID, make a new record
					new User({ facebookID: profile.id })
						.save()
						.then(user => done(null, user));
				}
			});
		}
	)
);