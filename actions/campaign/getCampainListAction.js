var readCampaignModelLogic = require('../../logic/campaign/readCampaignModelLogic')

var Input = {
  accountHashID: {
    required: true
  },
  filterObject: {
    required: false,
    formatter: function (param, connection, actionTemplate) {
      return JSON.parse(new Buffer(param, 'base64'))
    }
  },
  complexModel: {
    required: flase,
    default: function (param, connection, actionTemplate) {
      return false;
    },
  }
}

exports.getCampaignListAction = {
  name: 'getCampaignListAction',
  description: 'Get Campaign List',
  inputs: Input,

  run: function (api, data, next) {
    if (data.params.complexModel) {
      readCampaignModelLogic.getCampaignListComplex(api.redisClient, data.params.accountHashID, data.params.filterObject, function (err, replies) {
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
    else {
      readCampaignModelLogic.getCampaignList(api.redisClient, data.params.accountHashID, data.params.filterObject, function (err, replies) {
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
  }
}