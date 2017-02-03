var writeCampaignSettingModelLogic = require('../../logic/setting/campaign/writeCampaignSettingModelLogic')
var campaignSettingModelCheckerLogic = require('../../logic/setting/campaign/campaignSettingModelCheckerLogic')

var Input = {
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
    writeCampaignSettingModelLogic.setCampaignSettingModel(api.redisClient, data.params.campaignHashID, payload, function (err, replies) {
      if (err) {
        data.response.error = err.error
        next(err)
      }
      data.response.result = replies
      next()
    })
  }
}