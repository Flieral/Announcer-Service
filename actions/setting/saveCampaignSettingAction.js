var writeCampaignSettingModelLogic = require('../../logic/setting/campaign/writeCampaignSettingModelLogic')
var campaignSettingModelCheckerLogic = require('../../logic/setting/campaign/campaignSettingModelCheckerLogic')

var Input = {
	accountHashID: {
		required: true
	},
  campaignHashID: {
    required: true
  }
}

exports.saveCampaignSettingAction = {
  name: 'saveCampaignSettingAction',
  description: 'Save Campaign Setting Model',
  inputs: Input,

  run: function (api, data, next) {
    var payload = JSON.parse(JSON.stringify(data.connection.rawConnection.params.body))
		campaignSettingModelCheckerLogic.checkCampaignSettingModelForExistence(api.redisClient, data.params.accountHashID, data.params.campaignHashID, function (err, result) {
			if (err) {
				data.response.error = err.error
				next(err)
      }
      else {
        campaignSettingModelLogic.setCampaignSettingModel(api.redisClient, data.params.campaignHashID, payload, function (err, replies) {
          if (err) {
            data.response.error = err.error
            next(err)
          }
          else {
            data.response.result = replies
            next()
          }
        })
      }
    })
  }
}