var mongoose = require('mongoose');

var feedbackSchema = new mongoose.Schema({
	subject: String,
	username: String,
	text: String,
	created: {
		type: Date,
		default: Date.now
	}
});
module.exports = mongoose.model("Feedback", feedbackSchema);