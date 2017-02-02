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

      var counter = 0
      for (var j = 0; j < keyValueArray.length; j++) {
        table = configuration.TableModel.general.SubcampaignModel + campaignHashID
        utility.stringReplace(table, '@', key)
        
        redisClient.zrange(table, '0', '-1', function (err, replies) {
          if (err) {
            callback(err, null)
            return
          }

          table = configuration.TableModel.general.SubcampaignModel + campaignHashID
          for (var k = 0; k < replies.length; k++) {
            utility.stringReplace(table, '@', replies[k])
            multi.zrem(table, subcampaignHashID)
          }

          /* Add to Model List */
          table = configuration.TableModel.general.SubcampaignModel + campaignHashID
          utility.stringReplace(table, '@', keyValueArray[j])
          multi.zadd(table, score, subcampaignHashID)
          /* Add to Model Set */
          table = configuration.TableModel.general.SubcampaignModel
          utility.stringReplace(table, '@', keyValueArray[j])
          multi.zadd(table, score, subcampaignHashID)

          counter++
        })

        if (counter == keyValueArray.length) {
          /* Model Set */
          table = configuration.TableModel.general.subcampaignHashID + subcampaignHashID
          utility.stringReplace(table, '@', key)
          /* Remove from Model Set */
          multi.zremrangebyrank(table, '0', '-1')
          /* Add to Model Set */
          scoreMemberArray.unshift(table)
          multi.zadd(scoreMemberArray)
        }
      }

      if (finalCounter == settingKeys.length) {
        multi.exec(function (err, replies) {
          if (err) {
            callback(err, null)
            return
          }
          callback(null, configuration.message.setting.subcampaign.set.successful)
        })
      }
    } 
  }
}