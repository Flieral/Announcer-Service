var writeCampaignModelLogic = require('../../logic/campaign/writeCampaignModelLogic')
var campaignModelCheckerLogic = require('../../logic/campaign/campaignModelCheckerLogic')

var Input = {
  accountHashID: {
    required: true
  },
  campaignHashID: {
    required: true
  }
}

exports.deleteCampaignModelAction = {
  name: 'deleteCampaignModelAction',
  description: 'Delete Campaign Model',
  inputs: Input,

  run: function (api, data, next) {
    campaignModelCheckerLogic.checkCampaignModelForExistence(api.redisClient, data.params.accountHashID, data.params.campaignHashID, function (err, result) {
      if (err) {
        data.response.error = err.error
        next(err)
      }
      else {
        writeCampaignModelLogic.deleteCampaignModel(api.redisClient, data.params.accountHashID, data.params.campaignHashID, function (err, replies) {
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