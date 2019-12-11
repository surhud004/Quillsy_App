var mongoose = require('mongoose');

var reportSchema = new mongoose.Schema({
	subject: String,
	url: String,
	created: {
		type: Date,
		default: Date.now
	},
	author: 
	{
		id: 
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});
module.exports = mongoose.model("Report", reportSchema);