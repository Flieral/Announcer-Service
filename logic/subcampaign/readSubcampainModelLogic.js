var configuration = require('../../config/configuration.json')
var utility = require('../../public/method/utility')

module.exports = {
  getSubcampaignModel: function (redisClient, subcampaignHashID, callback) {
    var tableName = configuration.TableMASubcampaignModel + subcampaignHashID
    redisClient.hmget(tableName,
      configuration.ConstantSCMMinBudget,
      configuration.ConstantSCMSubcampaignName,
      configuration.ConstantSCMSubcampaignStyle,
      configuration.ConstantSCMSubcampaignPlan,
      configuration.ConstantSCMSubcampaignPrice,
      configuration.ConstantSCMFileURL,
      function (err, replies) {
        if (err) {
          callback(err, null)
          return
        }
        callback(null, replies)
      }
    )
  },

  getSubcampaignList: function (redisClient, campiagnHashID, filter, callback) {
    var filterKeys = Object.keys(filter)
    if (filterKeys.length == 0) {
      var tableName = configuration.TableMSCampaignModelSubcampaignModel + accountHashID
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
        var table = configuration.TableName.general.SubcampaignModel + accountHashID
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
}