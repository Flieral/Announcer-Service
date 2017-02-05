var configuration = require('../../config/configuration.json')
var utility = require('../../public/method/utility')
var campaignModelCheckerLogic = require('../campaign/campaignModelCheckerLogic')

module.exports = {
  checkSubcampaignModel: function (redisClient, campaignHashID, payload, callback) {
    var tableName = configuration.TableMACampaignModel + campaignHashID
    redisClient.hget(tableName, configuration.ConstantCMBudget, function (err, replies) {
      if (err) {
        callback(err, null)
        return
      }
      if (parseInt(payload[configuration.ConstantSCMMinBudget]) <= parseInt(replies)) {
        callback(null, 'Successful Check')
      } else {
        callback(new Error('Subcampaign Budget Problem'), null)
        return
      }
    })
  },

  checkSubcampaignModelForExistence: function (redisClient, accountHashID, campaignHashID, subcampaignHashID, callback) {
    campaignModelCheckerLogic.checkCampaignModelForExistence(redisClient, accountHashID, campaignHashID, function (err, replies) {
      if (err) {
        callback(err, null)
        return
      } else {
        var tableName = configuration.TableMSCampaignModelSubcampaignModel + campaignHashID
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
      }
    })
  },

  checkSubcampaignModelForNotExistence: function (redisClient, accountHashID, campaignHashID, subcampaignHashID, callback) {
    campaignModelCheckerLogic.checkCampaignModelForNotExistence(redisClient, accountHashID, campaignHashID, function (err, replies) {
      if (err) {
        callback(err, null)
        return
      } else {
        var tableName = configuration.TableMSCampaignModelSubcampaignModel + campaignHashID
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
    })
  },
  checkSubcampaignListForExistence: function (redisClient, accountHashID, campaignHashID, callback) {
    campaignModelCheckerLogic.checkCampaignModelForNotExistence(redisClient, accountHashID, campaignHashID, function (err, replies) {
      if (err) {
        callback(err, null)
        return
      } else
          callback(null, replies)
    })
  }
} 