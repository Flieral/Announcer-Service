var configuration = require('../../../config/configuration.json')
var campaignModelCheckerLogic = require('../../campaign/campaignModelCheckerLogic')

module.exports = {
  checkCampaignSettingModelForExistence: function (redisClient, accountHashID, campaignHashID, callback) {
    campaignModelCheckerLogic.checkCampaignModelForExistence(redisClient, accountHashID, campaignHashID, function (err, result) {
      if (err) {
        callback(err, null)
        return
      }
      callback(null, callback(null, configuration.message.campaign.setting.exist))
    })
  },

  checkCampaignSettingModelForNotExistence: function (redisClient, accountHashID, campaignHashID, callback) {
    campaignModelCheckerLogic.checkCampaignModelForNotExistence(redisClient, accountHashID, campaignHashID, function (err, result) {
      if (err) {
        callback(err, null)
        return
      }
      callback(null, callback(null, configuration.message.campaign.setting.notExist))
    })
  }
}