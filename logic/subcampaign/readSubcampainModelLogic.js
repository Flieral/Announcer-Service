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
}