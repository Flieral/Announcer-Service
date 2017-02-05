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

exports.updateSubcampaignModelAction = {
  name: 'updateSubampaignModelAction',
  description: 'Update Subcampaign Model',
  inputs: Input,

  run: function (api, data, next) {
    var payload = JSON.parse(JSON.stringify(data.connection.rawConnection.params.body))
    subcampaignModelCheckerLogic.checkSubcampaignModelForExistence(api.redisClient, data.params.accountHashID, data.params.campaignHashID, data.params.subcampaignHashID, payload, function (err, replies) {
      if (err) {
        data.response.error = err.error
        next(err)
      }
      else {
        writeSubcampaignModelLogic.updateSubcampaignModel(api.redisClient, data.params.campaignHashID, data.params.subcampaignHashID, payload, function (err, replies) {
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