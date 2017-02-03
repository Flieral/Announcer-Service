var writesubCampaignSettingModelLogic = require('../../logic/setting/subcampaign/writeSubcampaignSettingModelLogic')
var campaignSettingModelCheckerLogic = require('../../logic/setting/subcampaign/subcampaignSettingModelCheckerLogic')

var Input = {
  campaignHashID: {
    required: true
  },
  subcampaignHashID: {
    required: true
  }
}

exports.savesubCampaignSettingAction = {
  name: 'savesubCampaignSettingAction',
  description: 'Save SubCampaign Setting Model',
  inputs: Input,

  run: function (api, data, next) {
    var payload = JSON.parse(JSON.stringify(data.connection.rawConnection.params.body))
    writesubCampaignSettingModelLogic.setsubCampaignSettingModel(api.redisClient, data.params.campaignHashID, data.params.subcampaignHashID, payload, function (err, replies) {
      if (err) {
        data.response.error = err.error
        next(err)
      }
      data.response.result = replies
      next()
    })
  }
}