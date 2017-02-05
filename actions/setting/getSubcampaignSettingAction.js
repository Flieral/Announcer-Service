var readsubcampaignSettingModelLogic = require('../../logic/setting/subcampaign/readSubcampaignSettingModelLogic')
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

exports.getsubCampaignSettingModelAction = {
  name: 'getsubCampaignSettingModelAction',
  description: 'Get SubCampaign Setting Model',
  inputs: Input,

  run: function (api, data, next) {
    subcampaignSettingModelCheckerLogic.checkSubcampaignSettingModelForExistence(api.redisClient, data.params.accountHashID, data.params.campaignHashID, data.params.subcampaignHashID, function (err, result) {
      if (err) {
        data.response.error = err.error
        next(err)
      }
      else {
        readsubcampaignSettingModelLogic.getsubcampaignSettingModel(api.redisClient, data.params.subcampaignHashID, function (err, replies) {
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