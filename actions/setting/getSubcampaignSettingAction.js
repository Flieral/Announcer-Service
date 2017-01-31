var readsubcampaignSettingModelLogic = require('../../logic/setting/subcampaign/readSubcampaignSettingModelLogic')
var subcampaignSettingModelCheckerLogic = require('../../logic/setting/subcampaign/subcampaignSettingModelCheckerLogic')

var Input = {
  campaignHashID: {
    required: true
  },
  subCampaignHashID: {
    required: true
  }
}

exports.getsubCampaignSettingModelAction = {
  name: 'getsubCampaignSettingModelAction',
  description: 'Get SubCampaign Setting Model',
  inputs: Input,

  run: function (api, data, next) {
    subcampaignSettingModelCheckerLogic.checksubCampaignSettingModelForExistence(api.redisClient, data.params.campaignHashID, data.params.subCampaignHashID, function (err, result) {
      if (err) {
        data.response.error = err.error
        next(err)
      } else {
        readsubcampaignSettingModelLogic.getsubcampaignSettingModel(api.redisClient, data.params.campaignHashID, data.params.subCampaignHashID, function (err, replies) {
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