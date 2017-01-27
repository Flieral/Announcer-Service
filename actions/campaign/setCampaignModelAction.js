var writeCampaignModelLogic = require('../../logic/campaign/writeCampaignModelLogic')
var campaignModelCheckerLogic = require('../../logic/campaign/campaignModelCheckerLogic')

var Input = {
  accountHashID: {
    required: true
  }
}

exports.setCampaignModelAction = {
  name: 'setCampaignModelAction',
  description: 'Set Campaign Model',
  inputs: Input,

  run: function (api, data, next) {
    
    var payload = JSON.parse(JSON.stringify(data.connection.rawConnection.params.body))
    writeCampaignModelLogic.setCampaignModel(api.redisClient, data.params.accountHashID, payload, function (err, replies) {
      if (err) {
        data.response.error = err.error
        next(err)
      }
      data.response.result = replies
      next()
    })
  }
}