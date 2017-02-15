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
        var res = {}
        res[configuration.ConstantCMBudget] = replies[0]
        res[configuration.ConstantCMBeginningTime] = replies[1]
        res[configuration.ConstantCMEndingTime] = replies[2]
        res[configuration.ConstantCMCampaignStatus] = replies[3]
        res[configuration.ConstantCMCampaignName] = replies[4]
        res[configuration.ConstantCMStartStyle] = replies[5]
        res[configuration.ConstantCMSettingStyle] = replies[6]
        res[configuration.ConstantCMMediaStyle] = replies[7]
        res[configuration.ConstantCMWebhookIdentifier] = replies[8]
        res[configuration.ConstantCMMessage] = replies[9]
        callback(null, res)
      }
    )
  },

  getCampaignList: function (redisClient, accountHashID, filter, callback) {
    var filterKeys = Object.keys(filter)
    if (filterKeys.length == 0) {
      var tableName = configuration.TableMSAccountModelCampaignModel + accountHashID
      redisClient.zrange(tableName, '0', '-1', 'WITHSCORES', function (err, replies) {
        if (err) {
          callback(err, null)
          return
        }
        var res = []
        for (var i = 0; i < replies.length; i = i + 2) {
          var innerRes = {}
          innerRes[configuration.ModelsKey.CampaignHashID] = replies[i]
          innerRes[configuration.ModelsKey.Score] = replies[i + 1]
          res.push(innerRes)
        }
        callback(null, res)
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
        var table = configuration.TableModel.general.CampaignModel + accountHashID
        table = utility.stringReplace(table, '@', key)
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
            var res = []
            for (var i = 0; i < result.length; i = i + 2) {
              var innerRes = {}
              innerRes[configuration.ModelsKey.CampaignHashID] = result[i]
              innerRes[configuration.ModelsKey.Score] = result[i + 1]
              res.push(innerRes)
            }
            callback(null, res)
          })
        })
      })
    }
  },

  getCampaignListComplex: function (redisClient, accountHashID, filter, callback) {
    this.getCampaignList(redisClient, accountHashID, filter, function (err, result) {
      if (err) {
        callback(err, null)
        return
      }
      var counter = 0
      var response = []
      for (var i = 0; i < result.length; i++) {
        var model = result[i]
        this.getCampaignModel(redisClient, model[configuration.ModelsKey.CampaignHashID], function (err, replies) {
          if (err) {
            callback(err, null)
            return
          }
          response.push(replies)
          counter++
          if (counter == result.length)
            callback(null, response)
        })
      }
    })
  }
}
