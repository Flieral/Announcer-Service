var configuration = require('../../../config/configuration.json')
var campaignModelCheckerLogic = require('../../campaign/campaignModelCheckerLogic')
var subcampaignModelCheckerLogic = require('../../subcampaign/subcampaignModelCheckerLogic')

module.exports = {
  checksubCampaignSettingModelForExistence: function (redisClient, accountHashID, campaignHashID, subCampaignHashID, callback) {
    campaignModelCheckerLogic.checkCampaignModelForExistence(redisClient, accountHashID, campaignHashID, function (err, result) {
      if (err) {
        callback(err, null)
        return
      }
      subcampaignModelCheckerLogic.checkSubcampaignModelForExistence(redisClient, campaignHashID, subCampaignHashID, function (err, result) {
        if (err) {
          callback(err, null)
          return
        }
        callback(null, callback(null, configuration.message.subcampaign.setting.exist))
      })
    })
  },

  checksubCampaignSettingModelForNotExistence: function (redisClient, accountHashID, campaignHashID, subCampaignHashID, callback) {
    campaignModelCheckerLogic.checkCampaignModelForNotExistence(redisClient, accountHashID, campaignHashID, function (err, result) {
      if (err) {
        callback(err, null)
        return
      }
      subcampaignModelCheckerLogic.checkSubcampaignModelForNotExistence(redisClient, campaignHashID, subCampaignHashID, function (err, result) {
        if (err) {
          callback(err, null)
          return
        }
        callback(null, callback(null, configuration.message.subcampaign.setting.notExist))
      })
    })
  }
}