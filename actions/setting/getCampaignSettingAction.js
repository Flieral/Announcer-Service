var readCampaignSettingModelLogic = require('../../logic/setting/campaign/readCampaignSettingModelLogic')
var campaignSettingModelCheckerLogic = require('../../logic/setting/campaign/campaignSettingModelCheckerLogic')

var Input = {
	campaignHashID: {
		required: true
	}
}

exports.getCampaignSettingModelAction = {
	name: 'getCampaignSettingModelAction',
	description: 'Get Campaign Setting Model',
	inputs: Input,

	run: function (api, data, next) {
		campaignSettingModelCheckerLogic.checkCampaignSettingModelForExistence(api.redisClient, data.params.campaignHashID, function (err, result) {
			if (err) {
				data.response.error = err.error
				next(err)
			}
			else {
				readCampaignSettingModelLogi.getCampaignSettingModel(api.redisClient, data.params.campaignHashID, function (err, replies) {
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