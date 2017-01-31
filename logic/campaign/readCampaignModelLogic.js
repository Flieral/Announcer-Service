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

  },
  getCampaignList: function (redisClient, accountHashID, callback) {

  }
}