var readCampaignModelLogic = require('../../logic/campaign/readCampaignModelLogic')

var Input = {
  accountHashID: {
    required: true
  }
}

exports.getCampaignListAction = {
  name: 'getCampaignListAction',
  description: 'Get Campaign List',
  inputs: Input,

  run: function (api, data, next) {
    
    readCampaignModelLogic.getCampaignList(api.redisClient, data.params.accountHashID, function (err, replies) {
      if (err) {
        data.response.error = err.error
        next(err)
      }
      data.response.result = replies
      next()
    })
  }
}