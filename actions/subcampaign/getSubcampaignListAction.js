var readSubcampaignModelLogic = require('../../logic/subcampaign/readSubcampaignModelLogic')
var subcampaignModelCheckerLogic = require('../../logic/subcampaign/subcampaignModelCheckerLogic')

var Input = {
  accountHashID: {
    required: true
  },
  campaignHashID: {
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
      return false
    }
  }
}

exports.getSubcampaignListAction = {
  name: 'getSubcampaignListAction',
  description: 'Get Subcampaign List',
  inputs: Input,

  run: function (api, data, next) {
    subcampaignModelCheckerLogic.checkSubcampaignListForExistence(api.redisClient, accountHashID, campaignHashID, function (err, replies) {
      if (err) {
        data.response.error = err.error
        next(err)
      } else {
        if (data.params.complexModel) {
          readSubcampaignModelLogic.getSubcampaignListComplex(api.redisClient, data.params.campaignHashID, data.params.filterObject, function (err, replies) {
            if (err) {
              data.response.error = err.error
              next(err)
            } else {
              data.response.result = replies
              next()
            }
          })
        } else {
          readSubcampaignModelLogic.getSubcampaignList(api.redisClient, data.params.campaignHashID, data.params.filterObject, function (err, replies) {
            if (err) {
              data.response.error = err.error
              next(err)
            } else {
              data.response.result = replies
              next()
            }
          })
        }
      }
    })
  }
}