var configuration = require('../../../config/configuration.json')
var subcampaignModelCheckerLogic = require('../../subcampaign/subcampaignModelCheckerLogic')

module.exports = {
  checksubCampaignSettingModelForExistence: function (redisClient, accountHashID, campaignHashID, subCampaignHashID, callback) {
    subcampaignModelCheckerLogic.checkSubcampaignModelForExistence(redisClient, accountHashID, campaignHashID, subCampaignHashID, function (err, result) {
      if (err) {
        callback(err, null)
        return
      }
      callback(null, callback(null, configuration.message.subcampaign.setting.exist))
    })
  },

  checksubCampaignSettingModelForNotExistence: function (redisClient, accountHashID, campaignHashID, subCampaignHashID, callback) {
    subcampaignModelCheckerLogic.checkSubcampaignModelForNotExistence(redisClient, accountHashID, campaignHashID, subCampaignHashID, function (err, result) {
      if (err) {
        callback(err, null)
        return
      }
      callback(null, callback(null, configuration.message.subcampaign.setting.notExist))
    })
  }
}