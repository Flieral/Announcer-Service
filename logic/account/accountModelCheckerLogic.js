var configuration = require('../../config/configuration.json')

module.exports = {
  checkAccountModelForExistence: function (redisClient, accountHashID, callback) {
    var tableName = configuration.TableMAAccountModelAnnouncerAccountModel
    redisClient.zscore(tableName, accountHashID, function (err, replies) {
      if (err) {
        callback(err, null)
        return
      }
      if (replies == null || replies == undefined)
        callback(new Error(configuration.message.account.notExist), null)
      else
        callback(null, configuration.message.account.exist)
    })
  },

  checkAccountModelForNotExistence: function (redisClient, accountHashID, callback) {
    var tableName = configuration.TableMAAccountModelAnnouncerAccountModel
    redisClient.zscore(tableName, accountHashID, function (err, replies) {
      if (err) {
        callback(err, null)
        return
      }
      if (replies == null || replies == undefined)
        callback(null, configuration.message.account.notExist)
      else
        callback(new Error(configuration.message.account.exist), null)
    })
  }
}