var configuration = require('../../config/configuration.json')
var utility = require('../../public/method/utility')

module.exports = {
  checkCampaignModel: function (redisClient, campaignHashID, payload, callback) {
    var tableName = configuration.TableMACampaignModel + campaignHashID
    redisClient.hget(tableName, configuration.ConstantSCMMinBudget, function (err, replies) {
      if (err) {
        callback(err, null)
        return
      }
      if (parseInt(payload[configuration.ConstantSCMMinBudget]) <= parseInt(replies)) {
        callback(null, 'Successful Check')
      }
      else {
        callback(new Error('Budget Problem'), null)
        return
      }
    })
  },

  checkCampaignModelForExistence: function (redisClient, campaignHashID, subcampaignHashID, callback) {
    var tableName = configuration.TableMSCampaignModelSubcampaignModel + accountHashID
    redisClient.zscore(tableName, subcampaignHashID, function (err, replies) {
      if (err) {
        callback(err, null)
        return
      }
      if (replies == null || replies == undefined)
        callback(new Error(configuration.message.subcampaign.notExist), null)
      else
        callback(null, configuration.message.subcampaign.exist)
    })
  },

  checkCampaignModelForNotExistence: function (redisClient, campaignHashID, subcampaignHashID, callback) {
    var tableName = configuration.TableMSCampaignModelSubcampaignModel + accountHashID
    redisClient.zscore(tableName, subcampaignHashID, function (err, replies) {
      if (err) {
        callback(err, null)
        return
      }
      if (replies == null || replies == undefined)
        callback(new Error(configuration.message.subcampaign.exist), null)
      else
        callback(null, configuration.message.subcampaign.notExist)
    })
  }
}
