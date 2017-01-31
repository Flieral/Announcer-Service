var configuration = require('../../config/configuration.json')
var utility = require('../../public/method/utility')

module.exports = {
  getCampaignModel: function (redisClient, campaignHashID, callback) {
    var tableName = configuration.TableMACampaignModel + campaignHashID
    redisClient.hmget(tableName,
      configuration.ConstantCMBudget,
      configuration.ConstantCMBeginningTime,
      configuration.ConstantCMEndingTime,
      configuration.ConstantCMCampaignStatus,
      configuration.ConstantCMCampaignName,
      configuration.ConstantCMStartStyle,
      configuration.ConstantCMSettingStyle,
      configuration.ConstantCMMediaStyle,
      configuration.ConstantCMWebhookIdentifier,
      configuration.ConstantCMMessage,
      function (err, replies) {
        if (err) {
          callback(err, null)
          return
        }
        callback(null, replies)
      }
    )
  },

  getCampaignList: function (redisClient, accountHashID, filter, callback) {
    var filterKeys = Object.keys(filter)
    if (filterKeys.length == 0) {
      var tableName = configuration.TableMSAccountModelMonitorModel + accountHashID
      redisClient.zrange(tableName, '0', '-1', 'WITHSCORES', function (err, replies) {
        if (err) {
          callback(err, null)
          return
        }
        callback(null, replies)
      })
    }
    else {
      var destinationTableName = configuration.TableMACampaignModel + configuration.TableTemporary + utility.generateUniqueHashID()
      var result
      var args = []
      args.push(destinationTableName)
      args.push(filterKeys.length)
      for (var i = 0; i < filterKeys.length; i++) {
        var key = configuration.campaignEnum[filterKeys[i]]
        var table = configuration.TableName.general.CampaignModel + accountHashID
        utility.stringReplace(table, '@', key)
        args.push(table)
      }
      args.push('AGGREGATE')
      args.push('MAX')
      redisClient.zinterstore(args, function (err, replies) {
        if (err) {
          callback(err, null)
          return
        }
        redisClient.zrange(destinationTableName, '0', '-1', 'WITHSCORES', function (err, replies) {
          if (err) {
            callback(err, null)
            return
          }
          result = replies
          redisClient.zremrangebyrank(destinationTableName, '0', '-1', function (err, replies) {
            if (err) {
              callback(err, null)
              return
            }
            callback(null, result)
          })
        })
      })
    }
  },
  getCampaignList: function (redisClient, accountHashID, callback) {

  }
}