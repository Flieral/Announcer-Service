var configuration = require('../../config/configuration.json')
var utility = require('../../public/method/utility')

module.exports = {
  setSubcampaignModel: function (redisClient, accountHashID, payload, callback) {
    var tableName, tempTable
    var subcampaignHashID = utility.generateUniqueHashID()
    var score = utility.getUnixTimeStamp()
    var multi = redisClient.multi()

    /* Add to SubcampaignModel:subcampaignHashID */
    tableName = configuration.TableMASubcampaignModel + subcampaignHashID
    multi.hmset(tableName,
      configuration.ConstantSCMMinBudget, payload[configuration.ConstantSCMMinBudget],
      configuration.ConstantSCMSubcampaignName, payload[configuration.ConstantSCMSubcampaignName],
      configuration.ConstantSCMSubcampaignStyle, payload[configuration.ConstantSCMSubcampaignStyle],
      configuration.ConstantSCMSubcampaignPlan, payload[configuration.ConstantSCMSubcampaignPlan],
      configuration.ConstantSCMSubcampaignPrice, payload[configuration.ConstantSCMSubcampaignPrice],
      configuration.ConstantSCMFileURL, payload[configuration.ConstantSCMFileURL]
    )

    /* Add to CampaignModel:SubcampaignModel:SubcampaignStyleType:accountHashID */
    tempTable = configuration.TableModel.general.SubcampaignModel
    tableName = utility.stringReplace(tempTable, '@', payload[configuration.ConstantSCMSubcampaignStyle]) + accountHashID
    multi.zadd(tableName, score, subcampaignHashID)

    /* Add to CampaignModel:SubcampaignModel:SubcampaignPlanType:accountHashID */
    tempTable = configuration.TableModel.general.CampaignModel
    tableName = utility.stringReplace(tempTable, '@', payload[configuration.ConstantSCMSubcampaignPlan]) + accountHashID
    multi.zadd(tableName, score, subcampaignHashID)

    /* Add to CampaignModel:SubcampaignModel:SubcampaignStyleType: */
    tempTable = configuration.TableModel.general.SubcampaignModel
    tableName = utility.stringReplace(tempTable, '@', payload[configuration.ConstantSCMSubcampaignStyle])
    multi.zadd(tableName, score, subcampaignHashID)

    /* Add to CampaignModel:SubcampaignModel:SubcampaignPlanType: */
    tempTable = configuration.TableModel.general.CampaignModel
    tableName = utility.stringReplace(tempTable, '@', payload[configuration.ConstantSCMSubcampaignPlan])
    multi.zadd(tableName, score, subcampaignHashID)

    /* Add to CampaignModel:SubcampaignModel:campaignHashID */
    tableName = configuration.TableMSCampaignModelSubcampaignModel + campaignHashID
    multi.zadd(tableName, score, subcampaignHashID)

    multi.exec(function (err, replies) {
      if (err) {
        callback(err, null)
        return
      }
      callback(null, configuration.message.campaign.set.successful)
    })
  },

}