var configuration = require('../../config/configuration.json')
var utility = require('../../public/method/utility')

module.exports = {
  checkCampaignModel: function (redisClient, accountHashID, payload, callback) {
    var begTime = utility.getUnixTimeStamp() - configuration.MinimumDelay
    var endTime = utility.getUnixTimeStamp() + configuration.MinimumDuration
    var tableName = configuration.TableMAAccountModelAnnouncerAccountModel + accountHashID
    redisClient.hget(tableName, configuration.ConstantAMAAMBudget, function (err, replies) {
      if (err) {
        callback(err, null)
        return
      }
      if (parseInt(payload[configuration.ConstantCMBudget]) <= parseInt(replies)) {
        // First Check Pass
        if (parseInt(payload[configuration.ConstantCMBeginningTime]) >= begTime) {
          // Second Check Pass
          if (parseInt(payload[configuration.ConstantCMEndingTime]) >= endTime) {
            // Third Check Pass
            callback(null, 'Successful Check')
          }
          else {
            callback(new Error('Ending Time Problem'), null)
            return
          }
        }
        else {
          callback(new Error('Beginning Time Problem'), null)
          return
        }
      }
      else {
        callback(new Error('Budget Problem'), null)
        return
      }
    })
  },

  checkCampaignModelForExistence: function (redisClient, accountHashID, campaignHashID, callback) {
    var tableName = configuration.TableMSAccountModelCampaignModel + accountHashID
    redisClient.zscore(tableName, campaignHashID, function (err, replies) {
      if (err) {
        callback(err, null)
        return
      }
      if (replies == null || replies == undefined)
        callback(new Error(configuration.message.campaign.notExist), null)
      else
        callback(null, configuration.message.campaign.exist)
    })
  },

  checkCampaignModelForNotExistence: function (redisClient, accountHashID, campaignHashID, callback) {
    var tableName = configuration.TableMSAccountModelCampaignModel + accountHashID
    redisClient.zscore(tableName, campaignHashID, function (err, replies) {
      if (err) {
        callback(err, null)
        return
      }
      if (replies == null || replies == undefined)
        callback(new Error(configuration.message.campaign.exist), null)
      else
        callback(null, configuration.message.campaign.notExist)
    })
  }
}
