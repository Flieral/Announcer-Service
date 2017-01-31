var configuration = require('../../config/configuration')
var utility = require('../../public/method/utility')


module.exports = {
  setAccountModel: function (redisClient, accountHashID, payload, callback) {
    var tableName
    var score
    var accountType
    var multi = redisClient.multi()

    /* Add to AccountModel:AnnouncerAccountModel:AccountHashID */
    tableName = configuration.TableMAAccountModelAnnouncerAccountModel + accountHashID
    multi.hmset(tableName,
      configuration.ConstantAMAAMBudget, payload.budget,
      configuration.ConstantAMAAMAccountType, payload.accountType
    )

    /* Add to AccountModel:AnnouncerAccountModel: */
    score = utility.getUnixTimeStamp()
    tableName = configuration.TableMAAccountModelAnnouncerAccountModel
    multi.zadd(tableName, 'NX', score, accountHashID)

    /* Add to AccountModel:AnnouncerAccountType: */
    accountType = payload.accountType
    tableName = configuration.TableModel.general.AnnouncerModel
    utility.stringReplace(tableName, '@', accountType)
    multi.zadd(tableName, 'NX', score, accountHashID)

    multi.exec(function (err, replies) {
      if (err) {
        callback(err, null)
        return
      }
      callback(null, 'Added to AccountModel')
    })
  },
  updateAccountModel: function (redisClient, accountHashID, payload, callback) {
    var multi = redisClient.multi()

    var tableName = configuration.TableMAAccountModelAnnouncerAccountModel + accountHashID
    //Not Exist
    if (payload[configuration.ConstantAMAAMBudget] != null) {
      /* Read budget from AccountModel:AnnouncerAccountModel:AccountHashID */
      redisClient.hget(tableName, configuration.ConstantAMAAMBudget, function (err, replies) {
        if (err) {
          callback(err, null)
          return
        }
        if (replies != null && replies != undefined) {
          var newbudget = parseInt(replies, 10) + parseInt(payload.budget)
          /* Write newbudget to AccountModel:AnnouncerAccountModel:AccountHashID */
          multi.hset(tableName, configuration.ConstantAMAAMBudget, newbudget.toString())
        }
      })
    }
    if (payload[configuration.ConstantAMAAMAccountType] != null) {
      /* Read accountType from AccountModel:AnnouncerAccountModel:AccountHashID */
      redisClient.hget(tableName, configuration.ConstantAMAAMAccountType, function (err, replies) {
        if (err) {
          callback(err, null)
          return
        }
        if (replies != null && replies != undefined) {
          if (replies !== payload.accountType) {
            var accountTypeTableName = configuration.TableModel.general.AnnouncerModel
            utility.stringReplace(accountTypeTableName, '@', replies)
            /* Remove accountHashID from AccountModel:AnnouncerAccountType: table */
            multi.zrem(accountTypeTableName, accountHashID)
            accountTypeTableName = configuration.TableModel.general.AnnouncerModel
            utility.stringReplace(accountTypeTableName, '@', payload.accountType)
            var score = utility.getUnixTimeStamp()
            /* Add accountHashID to AccountModel:AnnouncerAccountType:(new) table */
            multi.zadd(accountTypeTableName, 'NX', score, accountHashID)
          }
        }
      })
    }
    multi.exec(function (err, replies) {
      if (err) {
        callback(err, null)
        return
      }
      callback(null, 'Updated in AccountModel and somewhere else')
    })

  }
}