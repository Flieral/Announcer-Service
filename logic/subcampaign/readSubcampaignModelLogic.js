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
        var res = {}
        res[configuration.ConstantSCMMinBudget] = replies[0]
        res[configuration.ConstantSCMSubcampaignName] = replies[1]
        res[configuration.ConstantSCMSubcampaignStyle] = replies[2]
        res[configuration.ConstantSCMSubcampaignPlan] = replies[3]
        res[configuration.ConstantSCMSubcampaignPrice] = replies[4]
        res[configuration.ConstantSCMFileURL] = replies[5]
        callback(null, res)
      }
    )
  },

  getSubcampaignList: function (redisClient, campiagnHashID, filter, callback) {
    var filterKeys = Object.keys(filter)
    if (filterKeys.length == 0) {
      var tableName = configuration.TableMSCampaignModelSubcampaignModel + campiagnHashID
      redisClient.zrange(tableName, '0', '-1', 'WITHSCORES', function (err, replies) {
        if (err) {
          callback(err, null)
          return
        }
        var res = []
        for (var i = 0; i < replies.length; i = i + 2) {
          var innerRes = {}
          innerRes[configuration.ModelsKey.SubcampaignHashID] = replies[i]
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
        var table = configuration.TableModel.general.SubcampaignModel + accountHashID
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
              innerRes[configuration.ModelsKey.SubcampaignHashID] = result[i]
              innerRes[configuration.ModelsKey.Score] = result[i + 1]
              res.push(innerRes)
            }
            callback(null, res)
          })
        })
      })
    }
  },

  getSubcampaignListComplex: function (redisClient, accountHashID, filter, callback) {
    this.getCampaignList(redisClient, accountHashID, filter, function (err, result) {
      if (err) {
        callback(err, null)
        return
      }
      var counter = 0
      var response = []
      for (var i = 0; i < result.length; i++) {
        var model = result[i]
        this.getSubcampaignModel(redisClient, model[configuration.ModelsKey.SubcampaignHashID], function (err, replies) {
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