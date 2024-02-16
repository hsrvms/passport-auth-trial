const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User.model.js');
const strategy = require('./src/config/passport.js');
require('dotenv').config();
require('./src/config/db.js');


passport.use(strategy);

const app = express();
app.set('views', path.join(__dirname, '/src/views'));
app.set('view engine', 'ejs');

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
});

app.get('/', (req, res) => res.render('index'));
app.get('/sign-up', (req, res) => {
	res.render('sign-up-form');
});
app.post('/sign-up', async (req, res, next) => {
	try {
		const hashedPassword = await bcrypt.hash(req.body.password, 10);
		const user = new User({
			username: req.body.username,
			password: hashedPassword,
		});
		const result = await user.save();
		res.redirect('/');
	} catch (err) {
		return next(err);
	}
});
app.post(
	'/log-in',
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/',
	})
);
app.get('/log-out', (req, res, next) => {
	req.logout((err) => {
		if (err) {
			return next(err);
		}
		res.redirect('/');
	});
});

app.listen(3000, () => console.log('app listening on port 3000!'));
