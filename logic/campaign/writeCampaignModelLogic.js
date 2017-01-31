var configuration = require('../../config/configuration.json')
var utility = require('../../public/method/utility')

module.exports = {
  setCampaignModel: function (redisClient, accountHashID, payload, callback) {
    var tableName, tempTable
    var campaignHashID = utility.generateUniqueHashID()
    var score = payload[configuration.ConstantAMTime]
    var multi = redisClient.multi()

    payload[configuration.ConstantCMCampaignStatus] = 'pending'
    payload[configuration.ConstantCMWebhookIdentifier] = utility.generateUniqueHashID()
    payload[configuration.ConstantCMMessage] = configuration.message.campaign.message.pending

    /* Add to CampaignModel:campaignHashID */
    tableName = configuration.TableMACampaignModel + campaignHashID
    multi.hmset(tableName,
      configuration.ConstantCMBudget, payload[configuration.ConstantCMBudget],
      configuration.ConstantCMBeginningTime, payload[configuration.ConstantCMBeginningTime],
      configuration.ConstantCMEndingTime, payload[configuration.ConstantCMEndingTime],
      configuration.ConstantCMCampaignStatus, payload[configuration.ConstantCMCampaignStatus],
      configuration.ConstantCMCampaignName, payload[configuration.ConstantCMCampaignName],
      configuration.ConstantCMStartStyle, payload[configuration.ConstantCMStartStyle],
      configuration.ConstantCMSettingStyle, payload[configuration.ConstantCMSettingStyle],
      configuration.ConstantCMMediaStyle, payload[configuration.ConstantCMMediaStyle],
      configuration.ConstantCMWebhookIdentifier, payload[configuration.ConstantCMWebhookIdentifier],
      configuration.ConstantCMMessage, payload[configuration.ConstantCMMessage]
    )

    /* Add to CampaignModel:CampaignStatusType:accountHashID */
    tempTable = configuration.TableModel.general.CampaignModel
    tableName = utility.stringReplace(tempTable, '@', payload[configuration.ConstantCMCampaignStatus]) + accountHashID
    multi.zadd(tableName, score, campaignHashID)

    /* Add to CampaignModel:MediaType:accountHashID */
    tempTable = configuration.TableModel.general.CampaignModel
    tableName = utility.stringReplace(tempTable, '@', payload[configuration.ConstantCMMediaStyle]) + accountHashID
    multi.zadd(tableName, score, campaignHashID)

    /* Add to CampaignModel:StartType:accountHashID */
    tempTable = configuration.TableModel.general.CampaignModel
    tableName = utility.stringReplace(tempTable, '@', payload[configuration.ConstantCMStartStyle]) + accountHashID
    multi.zadd(tableName, score, campaignHashID)

    /* Add to CampaignModel:SettingType:accountHashID */
    tempTable = configuration.TableModel.general.CampaignModel
    tableName = utility.stringReplace(tempTable, '@', payload[configuration.ConstantCMSettingStyle]) + accountHashID
    multi.zadd(tableName, score, campaignHashID)
    
    /* Add to CampaignModel:CampaignStatusType: */
    tempTable = configuration.TableModel.general.CampaignModel
    tableName = utility.stringReplace(tempTable, '@', payload[configuration.ConstantCMCampaignStatus])
    multi.zadd(tableName, score, campaignHashID)

    /* Add to CampaignModel:MediaType: */
    tempTable = configuration.TableModel.general.CampaignModel
    tableName = utility.stringReplace(tempTable, '@', payload[configuration.ConstantCMMediaStyle])
    multi.zadd(tableName, score, campaignHashID)

    /* Add to CampaignModel:StartType: */
    tempTable = configuration.TableModel.general.CampaignModel
    tableName = utility.stringReplace(tempTable, '@', payload[configuration.ConstantCMStartStyle])
    multi.zadd(tableName, score, campaignHashID)

    /* Add to CampaignModel:SettingType: */
    tempTable = configuration.TableModel.general.CampaignModel
    tableName = utility.stringReplace(tempTable, '@', payload[configuration.ConstantCMSettingStyle])
    multi.zadd(tableName, score, campaignHashID)

    /* Add to AccountModel:CampaignModel:accountHashID */
    tableName = configuration.TableMSAccountModelCampaignModel + accountHashID
    multi.zadd(tableName, score, campaignHashID)

    multi.exec(function (err, replies) {
      if (err) {
        callback(err, null)
        return
      }
      callback(null, configuration.message.campaign.set.successful)
    })
  },

  updateCampaignModel: function (redisClient, accountHashID, campaignHashID, payload, callback) {
    var tableName, tempTable
    var score = payload[configuration.ConstantAMTime]
    var multi = redisClient.multi()
    var updateFlag = false
    
    /* Read from CampaignModel:campaignHashID */
    tableName = configuration.TableMACampaignModel + campaignHashID    
    redisClient.hmget(tableName,
      configuration.ConstantCMBudget,
      configuration.ConstantCMBeginningTime,
      configuration.ConstantCMEndingTime,
      configuration.ConstantCMCampaignName,
      configuration.ConstantCMStartStyle,
      configuration.ConstantCMSettingStyle,
      configuration.ConstantCMMediaStyle,
      function (err, replies) {
        if (err) {
          callback(err, null)
          return
        }

        if ((payload[configuration.ConstantCMBudget] != null && payload[configuration.ConstantCMBudget] != undefined) && replies[0] !== payload[configuration.ConstantCMBudget]) {
          updateFlag = true
          /* Update CampaignModel:campaignHashID */
          tableName = configuration.TableMACampaignModel + campaignHashID
          multi.hset(tableName, configuration.ConstantCMBudget, payload[configuration.ConstantCMBudget])
        }

        if ((payload[configuration.ConstantCMBeginningTime] != null && payload[configuration.ConstantCMBeginningTime] != undefined) && replies[1] !== payload[configuration.ConstantCMBeginningTime]) {
          updateFlag = true
          /* Update CampaignModel:campaignHashID */
          tableName = configuration.TableMACampaignModel + campaignHashID
          multi.hset(tableName, configuration.ConstantCMBeginningTime, payload[configuration.ConstantCMBeginningTime])
        }

        if ((payload[configuration.ConstantCMEndingTime] != null && payload[configuration.ConstantCMEndingTime] != undefined) && replies[2] !== payload[configuration.ConstantCMEndingTime]) {
          updateFlag = true
          /* Update CampaignModel:campaignHashID */
          tableName = configuration.TableMACampaignModel + campaignHashID
          multi.hset(tableName, configuration.ConstantCMEndingTime, payload[configuration.ConstantCMEndingTime])
        }

        if ((payload[configuration.ConstantCMCampaignName] != null && payload[configuration.ConstantCMCampaignName] != undefined) && replies[3] !== payload[configuration.ConstantCMCampaignName]) {
          updateFlag = true
          /* Update CampaignModel:campaignHashID */
          tableName = configuration.TableMACampaignModel + campaignHashID
          multi.hset(tableName, configuration.ConstantCMCampaignName, payload[configuration.ConstantCMCampaignName])
        }

        if ((payload[configuration.ConstantCMStartStyle] != null && payload[configuration.ConstantCMStartStyle] != undefined) && replies[4] !== payload[configuration.ConstantCMStartStyle]) {
          updateFlag = true
          /* Update CampaignModel:campaignHashID */
          tableName = configuration.TableMACampaignModel + campaignHashID
          multi.hset(tableName, configuration.ConstantCMStartStyle, payload[configuration.ConstantCMStartStyle])

          /* Delete from CampaignModel:StartType:accountHashID */
          tempTable = configuration.TableModel.general.CampaignModel
          tableName = utility.stringReplace(tempTable, '@', replies[4]) + accountHashID
          multi.zrem(tableName, campaignHashID)

          /* Delete from CampaignModel:StartType: */
          tempTable = configuration.TableModel.general.CampaignModel
          tableName = utility.stringReplace(tempTable, '@', replies[4])
          multi.zrem(tableName, campaignHashID)

          /* Update CampaignModel:StartType:accountHashID */
          tempTable = configuration.TableModel.general.CampaignModel
          tableName = utility.stringReplace(tempTable, '@', payload[configuration.ConstantCMStartStyle]) + accountHashID
          multi.zadd(tableName, score, campaignHashID)

          /* Update CampaignModel:StartType: */
          tempTable = configuration.TableModel.general.CampaignModel
          tableName = utility.stringReplace(tempTable, '@', payload[configuration.ConstantCMStartStyle])
          multi.zadd(tableName, score, campaignHashID)          
        }

        if ((payload[configuration.ConstantCMSettingStyle] != null && payload[configuration.ConstantCMSettingStyle] != undefined) && replies[5] !== payload[configuration.ConstantCMSettingStyle]) {
          updateFlag = true
          /* Update CampaignModel:campaignHashID */
          tableName = configuration.TableMACampaignModel + campaignHashID
          multi.hset(tableName, configuration.ConstantCMSettingStyle, payload[configuration.ConstantCMSettingStyle])

          /* Delete from CampaignModel:SettingType:accountHashID */
          tempTable = configuration.TableModel.general.CampaignModel
          tableName = utility.stringReplace(tempTable, '@', replies[5]) + accountHashID
          multi.zrem(tableName, campaignHashID)

          /* Delete from CampaignModel:SettingType: */
          tempTable = configuration.TableModel.general.CampaignModel
          tableName = utility.stringReplace(tempTable, '@', replies[5])
          multi.zrem(tableName, campaignHashID)

          /* Update CampaignModel:SettingType:accountHashID */
          tempTable = configuration.TableModel.general.CampaignModel
          tableName = utility.stringReplace(tempTable, '@', payload[configuration.ConstantCMSettingStyle]) + accountHashID
          multi.zadd(tableName, score, campaignHashID)

          /* Update CampaignModel:SettingType: */
          tempTable = configuration.TableModel.general.CampaignModel
          tableName = utility.stringReplace(tempTable, '@', payload[configuration.ConstantCMSettingStyle])
          multi.zadd(tableName, score, campaignHashID)
        }

        if ((payload[configuration.ConstantCMMediaStyle] != null && payload[configuration.ConstantCMMediaStyle] != undefined) && replies[6] !== payload[configuration.ConstantCMMediaStyle]) {
          updateFlag = true
          /* Update CampaignModel:campaignHashID */
          tableName = configuration.TableMACampaignModel + campaignHashID
          multi.hset(tableName, configuration.ConstantCMMediaStyle, payload[configuration.ConstantCMMediaStyle])

          /* Delete from CampaignModel:MediaType:accountHashID */
          tempTable = configuration.TableModel.general.CampaignModel
          tableName = utility.stringReplace(tempTable, '@', replies[6]) + accountHashID
          multi.zrem(tableName, campaignHashID)

          /* Delete from CampaignModel:MediaType: */
          tempTable = configuration.TableModel.general.CampaignModel
          tableName = utility.stringReplace(tempTable, '@', replies[6])
          multi.zrem(tableName, campaignHashID)

          /* Update CampaignModel:MediaType:accountHashID */
          tempTable = configuration.TableModel.general.CampaignModel
          tableName = utility.stringReplace(tempTable, '@', payload[configuration.ConstantCMMediaStyle]) + accountHashID
          multi.zadd(tableName, score, campaignHashID)

          /* Update CampaignModel:MediaType: */
          tempTable = configuration.TableModel.general.CampaignModel
          tableName = utility.stringReplace(tempTable, '@', payload[configuration.ConstantCMMediaStyle])
          multi.zadd(tableName, score, campaignHashID)
        }

        if (updateFlag) {
          payload[configuration.ConstantCMCampaignStatus] = 'pending'
          payload[configuration.ConstantCMMessage] = configuration.message.campaign.message.pending

          /* Add to CampaignModel:campaignHashID */
          tableName = configuration.TableMACampaignModel + campaignHashID
          multi.hmset(tableName,
            configuration.ConstantCMCampaignStatus, payload[configuration.ConstantCMCampaignStatus],
            configuration.ConstantCMMessage, payload[configuration.ConstantCMMessage]
          )
          multi.exec(function (err, replies) {
            if (err) {
              callback(err, null)
              return
            }
            callback(null, configuration.message.campaign.update.successful)
          })
        }
      }
    )
  },
  
  deleteCampaignModel: function (redisClient, accountHashID, campaignHashID, callback) {
    var multi = redisClient.multi()
    var tableName = configuration.TableMACampaignModel + campaignHashID    
    redisClient.hmget(tableName,
      configuration.ConstantCMStartStyle,
      configuration.ConstantCMSettingStyle,
      configuration.ConstantCMMediaStyle,
      configuration.ConstantCMCampaignStatus,
      function (err, replies) {
        if (err) {
          callback(err, null)
          return
        }

        /* Delete from CampaignModel:StartType:accountHashID */
        tempTable = configuration.TableModel.general.CampaignModel
        tableName = utility.stringReplace(tempTable, '@', replies[0]) + accountHashID
        multi.zrem(tableName, campaignHashID)

        /* Delete from CampaignModel:StartType: */
        tempTable = configuration.TableModel.general.CampaignModel
        tableName = utility.stringReplace(tempTable, '@', replies[0])
        multi.zrem(tableName, campaignHashID)

        /* Delete from CampaignModel:SettingType:accountHashID */
        tempTable = configuration.TableModel.general.CampaignModel
        tableName = utility.stringReplace(tempTable, '@', replies[1]) + accountHashID
        multi.zrem(tableName, campaignHashID)

        /* Delete from CampaignModel:SettingType: */
        tempTable = configuration.TableModel.general.CampaignModel
        tableName = utility.stringReplace(tempTable, '@', replies[1])
        multi.zrem(tableName, campaignHashID)

        /* Delete from CampaignModel:MediaType:accountHashID */
        tempTable = configuration.TableModel.general.CampaignModel
        tableName = utility.stringReplace(tempTable, '@', replies[2]) + accountHashID
        multi.zrem(tableName, campaignHashID)

        /* Delete from CampaignModel:MediaType: */
        tempTable = configuration.TableModel.general.CampaignModel
        tableName = utility.stringReplace(tempTable, '@', replies[2])
        multi.zrem(tableName, campaignHashID)

        /* Delete from CampaignModel:CampaignStatusType:accountHashID */
        tempTable = configuration.TableModel.general.CampaignModel
        tableName = utility.stringReplace(tempTable, '@', replies[3]) + accountHashID
        multi.zrem(tableName, campaignHashID)

        /* Delete from CampaignModel:MediaType: */
        tempTable = configuration.TableModel.general.CampaignModel
        tableName = utility.stringReplace(tempTable, '@', replies[3])
        multi.zrem(tableName, campaignHashID)

        /* Delete from AccountModel:CampaignModel:accountHashID */
        tableName = configuration.TableMSAccountModelCampaignModel + accountHashID
        multi.zrem(tableName, campaignHashID)
        
        multi.hdel(tableName,
          configuration.ConstantCMBudget,
          configuration.ConstantCMBeginningTime,
          configuration.ConstantCMEndingTime,
          configuration.ConstantCMCampaignStatus,
          configuration.ConstantCMCampaignName,
          configuration.ConstantCMStartStyle,
          configuration.ConstantCMSettingStyle,
          configuration.ConstantCMMediaStyle,
          configuration.ConstantCMWebhookIdentifier,
          configuration.ConstantCMMessage
        )

        multi.exec(function (err, replies) {
          if (err) {
            callback(err, null)
            return
          }
          callback(null, configuration.message.campaign.delete.successful)
        })
      }
    )
  }
}
