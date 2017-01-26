var readAccountModelLogic = require('../../logic/account/readAccountModelLogic')

var Input = {
	accountHashID: {
		required: true
	}
}

exports.getAccountModelAction = {
	name: 'getAccountModelAction',
	description: 'Get Account Model',
	inputs: Input,

	run: function (api, data, next) {
		readAccountModelLogic(data.params.accountHashID, function (err, replies) {
			if (err) {
				data.response.error = err.error
				next(err)
			}
			data.response.result = replies
			next()
		})
	}
}