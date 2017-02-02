var configuration = require('../../../config/configuration.json')

module.exports = {
  getCampaignSettingModel: function (redisClient, CampaignHashID, callback) {
    var tableName = configuration.TableMACampaignModelSettingModel + CampaignHashID
    var model = {}
    redisClient.hget(tableName, configuration.ConstantSMPriority, function (err, replies) {
      if (err) {
        callback(err, null)
        return
      }
      var settingKeys = Object.keys(configuration.settingEnum)
      var counter = 0
      for (var i = 1; i < settingKeys.length; i++) {
        var key = settingKeys[i]
        var table = configuration.TableModel.general.CampaignModel + campaignHashID
        utility.stringReplace(table, '@', key)
        multi.zrange(table, '0', '-1', function (err, replies) {
          if (err) {
            callback(err, null)
            return
          }
          model[settingKeys[i]] = replies
          counter++
          if (counter == (settingKeys.length - 1))
            callback(null, model)
        })
      }
    })
  }
}