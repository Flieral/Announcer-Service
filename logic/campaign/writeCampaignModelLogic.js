var configuration = require('../../config/configuration.json')
var utility = require('../../public/method/utility')

module.exports = {
  setCampaignModel: function (redisClient, accountHashID, payload, callback) {
    var tableName, tempTable
    var campaignHashID = utility.generateUniqueHashID()
    var score = payload[configuration.ConstantAMTime]
    var multi = redisClient.multi()

  },
  deleteCampaignModel: function (redisClient, accountHashID, campaignHashID, callback) {
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
    
  }
}