var configuration = require('../../config/configuration.json')

module.exports = {
  getAccountModel: function (redisClient, accountHashID, callback) {
    var tableName = configuration.TableMAAccountModelAnnouncerAccountModel + accountHashID
    redisClient.hmget(tableName,
      configuration.ConstantAMAAMBudget,
      configuration.ConstantAMAAMAccountType,
      function (err, replies) {
        if (err) {
          callback(err, null)
          return
        }
        callback(null, replies)
      }
    )
  }
}