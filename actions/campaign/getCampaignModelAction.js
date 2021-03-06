var readCampaignModelLogic = require('../../logic/campaign/readCampaignModelLogic')
var campaignModelCheckerLogic = require('../../logic/campaign/campaignModelCheckerLogic')

var Input = {
  accountHashID: {
    required: true
  },
  campaignHashID: {
    required: true
  }
}

exports.getCampaignModelAction = {
  name: 'getCampaignModelAction',
  description: 'Get Campaign Model',
  inputs: Input,

  run: function (api, data, next) {
    campaignModelCheckerLogic.checkCampaignModelForExistence(api.redisClient, data.params.accountHashID, data.params.campaignHashID, function (err, result) {
      if (err) {
        data.response.error = err.error
        next(err)
      }
      else {
        readCampaignModelLogic.getCampaignModel(api.redisClient, data.params.accountHashID, data.params.campaignHashID, function (err, replies) {
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