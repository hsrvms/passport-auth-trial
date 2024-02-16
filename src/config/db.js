const mongoose = require('mongoose');
require('dotenv').config();

function connectDb() {
	const mongoDb = process.env.DATABASE_URI;
	mongoose.connect(mongoDb);
	const db = mongoose.connection;
	db.on('error', console.error.bind(console, 'mongo connection error'));
}

connectDb();

module.exports = connectDb;
