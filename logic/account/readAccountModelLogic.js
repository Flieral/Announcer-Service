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
        var res = {}
        res[configuration.ConstantAMAAMBudget] = replies[0]
        res[configuration.ConstantAMAAMAccountType] = replies[1]
        callback(null, res)
      }
    )
  }
}