var configuration = require('../../../config/configuration.json')
var utility = require('../../../public/method/utility')

module.exports = {
  setsubCampaignSettingModel: function (redisClient, campaignHashID, subcampaignHashID, payload, callback) {
    var table
    var score = utility.getUnixTimeStamp()
    var multi = redisClient.multi()
    var settingKeys = Object.keys(configuration.settingEnum)

    var tableName = configuration.TableMASubcampaignModelSettingModel + subcampaignHashID
    multi.hset(tableName, configuration.ConstantSMPriority, payload[configuration.ConstantSMPriority])

    var finalCounter = 0
    for (var i = 0; i < settingKeys.length; i++) {
      if (settingKeys[i] === configuration.settingEnum.Priority)
        continue

      var key = settingKeys[i]
      var scoreMemberArray = []
      var keyValueArray = payload[key]

      for (var j = 0; j < keyValueArray.length; j++) {
        scoreMemberArray.push(score)
        scoreMemberArray.push(keyValueArray[j])
      }

      table = configuration.TableModel.general.SubcampaignModel + campaignHashID
      table = utility.stringReplace(table, '@', key)

      redisClient.zrange(table, '0', '-1', function (err, replies) {
        if (err) {
          callback(err, null)
          return
        }

        for (var k = 0; k < replies.length; k++) {
          table = configuration.TableModel.general.SubcampaignModel + campaignHashID
          table = utility.stringReplace(table, '@', replies[k])
          multi.zrem(table, subcampaignHashID)
        }

        for (var j = 0; j < keyValueArray.length; j++) {
          /* Add to Model List */
          table = configuration.TableModel.general.SubcampaignModel + accountHashID
          table = utility.stringReplace(table, '@', keyValueArray[j])
          multi.zadd(table, score, subcampaignHashID)
          /* Add to Model Set */
          table = configuration.TableModel.general.SubcampaignModel
          table = utility.stringReplace(table, '@', keyValueArray[j])
          multi.zadd(table, score, subcampaignHashID)
        }

        /* Model Set */
        table = configuration.TableModel.general.SubcampaignModel + subcampaignHashID
        table = utility.stringReplace(table, '@', key)
        /* Remove from Model Set */
        multi.zremrangebyrank(table, '0', '-1')
        /* Add to Model Set */
        scoreMemberArray.unshift(table)
        multi.zadd(scoreMemberArray)

        finalCounter++
        if (finalCounter == keyValueArray.length) {
          multi.exec(function (err, replies) {
            if (err) {
              callback(err, null)
              return
            }
            callback(null, configuration.message.setting.subcampaign.set.successful)
          })
        }
      })
    }
  }
}