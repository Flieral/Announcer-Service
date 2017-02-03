var configuration = require('../../config/configuration.json')
var utility = require('../../public/method/utility')
var campaignModelCheckerLogic = require('../campaign/campaignModelCheckerLogic')

module.exports = {
  checkSubcampaignModel: function (redisClient, subcampaignHashID, payload, callback) {
    var tableName = configuration.TableMASubcampaignModel + subcampaignHashID
    redisClient.hget(tableName, configuration.ConstantSCMMinBudget, function (err, replies) {
      if (err) {
        callback(err, null)
        return
      }
      if (parseInt(payload[configuration.ConstantSCMMinBudget]) <= parseInt(replies)) {
        callback(null, 'Successful Check')
      } else {
        callback(new Error('Budget Problem'), null)
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
  }
}