var writeSubcampaignModelLogic = require('../../logic/subcampaign/writeSubcampaignModelLogic')
var subcampaignModelCheckerLogic = require('../../logic/subcampaign/subcampaignModelCheckerLogic')

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

exports.deleteSubcampaignModelAction = {
  name: 'deleteSubcampaignModelAction',
  description: 'Delete Subcampaign Model',
  inputs: Input,

  run: function (api, data, next) {
    subcampaignModelCheckerLogic.checkSubcampaignModelForExistence(api.redisClient, data.params.accountHashID, data.params.campaignHashID, data.params.subcampaignHashID, function (err, result) {
      if (err) {
        data.response.error = err.error
        next(err)
      }
      else {
        writeSubcampaignModelLogic.deleteSubcampaignModel(api.redisClient, data.params.campaignHashID, data.params.subcampaignHashID, function (err, replies) {
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