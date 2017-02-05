var readsubCampaignModelLogic = require('../../logic/subcampaign/readSubcampaignModelLogic')
var subcampaignModelCheckerLogic = require('../../logic/subcampaign/subcampaignModelCheckerLogic')

var Input = {
  accountHashID: {
    required: true
  },
  campaignHashID: {
    required: true
  },
  subCampaignHashID: {
    required: true
  }
}

exports.getsubCampaignModelAction = {
  name: 'getsubCampaignModelAction',
  description: 'Get Sub Campaign Model',
  inputs: Input,

  run: function (api, data, next) {
   subcampaignModelCheckerLogic.checkSubcampaignModelForExistence(api.redisClient, data.params.accountHashID, data.params.campaignHashID, data.params.subCampaignHashID, function (err, result) {
      if (err) {
        data.response.error = err.error
        next(err)
      }
      else {
        readsubCampaignModelLogic.getSubcampaignModel(api.redisClient, data.params.campaignHashID, function (err, replies) {
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