var writeAccountModelLogic = require('../../logic/account/writeAccountModelLogic')
var accountModelCheckerLogic = require('../../logic/account/accountModelCheckerLogic')

var Input = {
	accountHashID: {
		required: true
	}
}

exports.setAccountModelAction = {
	name: 'setAccountModelAction',
	description: 'Set Account Model',
	inputs: Input,
	
	run: function (api, data, next) {
		var payload = JSON.parse(JSON.stringify(data.connection.rawConnection.params.body))
		accountModelCheckerLogic.checkAccountModelForNotExistence(api.redisClient, data.params.accountHashID, function (err, result) {
			if (err) {
				data.response.error = err.error
				next(err)
			}
			else {
				writeAccountModelLogic.setAccountModel(api.redisClient, data.params.accountHashID, payload, function (err, replies) {
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