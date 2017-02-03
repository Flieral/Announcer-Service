var writesubCampaignSettingModelLogic = require('../../logic/setting/subcampaign/writeSubcampaignSettingModelLogic')
var subcampaignSettingModelCheckerLogic = require('../../logic/setting/subcampaign/subcampaignSettingModelCheckerLogic')

var Input = {
  accountHashID: {
    required: true
  },
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
    subcampaignSettingModelCheckerLogic.checksubCampaignSettingModelForExistence(api.redisClient, data.params.accountHashID, data.params.campaignHashID, data.params.subcampaignHashID, function (err, result) {
      if (err) {
        data.response.error = err.error
        next(err)
      }
      else {
        writesubCampaignSettingModelLogic.setsubCampaignSettingModel(api.redisClient, data.params.campaignHashID, data.params.subcampaignHashID, payload, function (err, replies) {
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