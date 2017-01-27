var readAccountModelLogic = require('../../logic/account/readAccountModelLogic')
var accountModelCheckerLogic = require('../../logic/account/accountModelCheckerLogic')

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

		accountModelCheckerLogic.checkAccountModel(api.redisClient, data.params.accountHashID, function (err, result) {
			if (err)
				data.response.error = err.error
			else {
				readAccountModelLogic.getAccountModel(api.redisClient, data.params.accountHashID, function (err, replies) {
					if (err) {
						data.response.error = err.error
						next(err)
					}
					data.response.result = replies
					next()
				})
			}
		})

	}
}