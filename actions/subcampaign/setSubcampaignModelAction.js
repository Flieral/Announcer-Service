var writeSubcampaignModelLogic = require('../../logic/subcampaign/writeSubcampaignModelLogic')
var subcampaignModelCheckerLogic = require('../../logic/subcampaign/subcampaignModelCheckerLogic')

var Input = {
  accountHashID: {
    required: true
  },
  campaignHashID: {
    required: true
  }
}

exports.setSubcampaignModelAction = {
  name: 'setSubampaignModelAction',
  description: 'Set Subcampaign Model',
  inputs: Input,

  run: function (api, data, next) {
    var payload = JSON.parse(JSON.stringify(data.connection.rawConnection.params.body))
    subcampaignModelCheckerLogic.checkSubcampaignModel(api.redisClient, data.params.campaignHashID, payload, function (err, replies) {
      if (err) {
        data.response.error = err.error
        next(err)
      }
      else {
        writeSubcampaignModelLogic.setSubcampaignModel(api.redisClient, data.params.campaignHashID, payload, function (err, replies) {
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