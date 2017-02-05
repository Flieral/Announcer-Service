var configuration = require('../../config/configuration.json')
var utility = require('../../public/method/utility')

module.exports = {
  setSubcampaignModel: function (redisClient, campaignHashID, payload, callback) {
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

    /* Add to CampaignModel:SubcampaignModel:SubcampaignStyleType:campaignHashID */
    tempTable = configuration.TableModel.general.SubcampaignModel
    tableName = utility.stringReplace(tempTable, '@', payload[configuration.ConstantSCMSubcampaignStyle]) + campaignHashID
    multi.zadd(tableName, score, subcampaignHashID)

    /* Add to CampaignModel:SubcampaignModel:SubcampaignPlanType:campaignHashID */
    tempTable = configuration.TableModel.general.CampaignModel
    tableName = utility.stringReplace(tempTable, '@', payload[configuration.ConstantSCMSubcampaignPlan]) + campaignHashID
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

  updateSubcampaignModel: function (redisClient, campaignHashID, subcampaignHashID, payload, callback) {
    var tableName, tempTable
    var score = utility.getUnixTimeStamp()
    var multi = redisClient.multi()
    var updateFlag = false

    tableName = configuration.TableMASubcampaignModel + subcampaignHashID
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

        if ((payload[configuration.ConstantSCMMinBudget] != null && payload[configuration.ConstantSCMMinBudget] != undefined) && replies[0] !== payload[configuration.ConstantSCMMinBudget]) {
          updateFlag = true
          /* Update SubcampaignModel:subcampaignHashID */
          tableName = configuration.TableMASubcampaignModel + subcampaignHashID
          multi.hset(tableName, configuration.ConstantSCMMinBudget, payload[configuration.ConstantSCMMinBudget])
        }

        if ((payload[configuration.ConstantSCMSubcampaignName] != null && payload[configuration.ConstantSCMSubcampaignName] != undefined) && replies[1] !== payload[configuration.ConstantSCMSubcampaignName]) {
          updateFlag = true
          /* Update SubcampaignModel:subcampaignHashID */
          tableName = configuration.TableMASubcampaignModel + subcampaignHashID
          multi.hset(tableName, configuration.ConstantSCMSubcampaignName, payload[configuration.ConstantSCMSubcampaignName])
        }

        if ((payload[configuration.ConstantSCMSubcampaignPrice] != null && payload[configuration.ConstantSCMSubcampaignPrice] != undefined) && replies[4] !== payload[configuration.ConstantSCMSubcampaignPrice]) {
          updateFlag = true
          /* Update SubcampaignModel:subcampaignHashID */
          tableName = configuration.TableMASubcampaignModel + subcampaignHashID
          multi.hset(tableName, configuration.ConstantSCMSubcampaignPrice, payload[configuration.ConstantSCMSubcampaignPrice])
        }

        if ((payload[configuration.ConstantSCMFileURL] != null && payload[configuration.ConstantSCMFileURL] != undefined) && replies[5] !== payload[configuration.ConstantSCMFileURL]) {
          updateFlag = true
          /* Update SubcampaignModel:subcampaignHashID */
          tableName = configuration.TableMASubcampaignModel + subcampaignHashID
          multi.hset(tableName, configuration.ConstantSCMFileURL, payload[configuration.ConstantSCMFileURL])
        }

        if ((payload[configuration.ConstantSCMSubcampaignStyle] != null && payload[configuration.ConstantSCMSubcampaignStyle] != undefined) && replies[2] !== payload[configuration.ConstantSCMSubcampaignStyle]) {
          updateFlag = true
          /* Update SubcampaignModel:subcampaignHashID */
          tableName = configuration.TableMASubcampaignModel + subcampaignHashID
          multi.hset(tableName, configuration.ConstantSCMSubcampaignStyle, payload[configuration.ConstantSCMSubcampaignStyle])

          /* Delete from CampaignModel:SubcampaignModel:SubCampaignStyle:campaignHashID */
          tempTable = configuration.TableModel.general.SubcampaignModel
          tableName = utility.stringReplace(tempTable, '@', replies[2]) + campaignHashID
          multi.zrem(tableName, subcampaignHashID)

          /* Delete from CampaignModel:SubcampaignModel:SubCampaignStyle: */
          tempTable = configuration.TableModel.general.SubcampaignModel
          tableName = utility.stringReplace(tempTable, '@', replies[2])
          multi.zrem(tableName, subcampaignHashID)

          /* Add to CampaignModel:SubcampaignModel:SubCampaignStyle:campaignHashID */
          tempTable = configuration.TableModel.general.SubcampaignModel
          tableName = utility.stringReplace(tempTable, '@', payload[configuration.ConstantSCMSubcampaignStyle]) + campaignHashID
          multi.zadd(tableName, score, subcampaignHashID)

          /* Add to CampaignModel:SubcampaignModel:SubCampaignStyle: */
          tempTable = configuration.TableModel.general.SubcampaignModel
          tableName = utility.stringReplace(tempTable, '@', payload[configuration.ConstantSCMSubcampaignStyle])
          multi.zadd(tableName, score, subcampaignHashID)
        }

        if ((payload[configuration.ConstantSCMSubcampaignPlan] != null && payload[configuration.ConstantSCMSubcampaignPlan] != undefined) && replies[3] !== payload[configuration.ConstantSCMSubcampaignPlan]) {
          updateFlag = true
          /* Update SubcampaignModel:subcampaignHashID */
          tableName = configuration.TableMASubcampaignModel + subcampaignHashID
          multi.hset(tableName, configuration.ConstantSCMSubcampaignPlan, payload[configuration.ConstantSCMSubcampaignPlan])

          /* Delete from CampaignModel:SubcampaignModel:SubCampaignPlanType:campaignHashID */
          tempTable = configuration.TableModel.general.SubcampaignModel
          tableName = utility.stringReplace(tempTable, '@', replies[3]) + campaignHashID
          multi.zrem(tableName, subcampaignHashID)

          /* Delete from CampaignModel:SubcampaignModel:SubCampaignPlanType: */
          tempTable = configuration.TableModel.general.SubcampaignModel
          tableName = utility.stringReplace(tempTable, '@', replies[3])
          multi.zrem(tableName, subcampaignHashID)

          /* Add to CampaignModel:SubcampaignModel:SubCampaignPlanType:campaignHashID */
          tempTable = configuration.TableModel.general.SubcampaignModel
          tableName = utility.stringReplace(tempTable, '@', payload[configuration.ConstantSCMSubcampaignPlan]) + campaignHashID
          multi.zadd(tableName, score, subcampaignHashID)

          /* Add to CampaignModel:SubcampaignModel:SubCampaignPlanType: */
          tempTable = configuration.TableModel.general.SubcampaignModel
          tableName = utility.stringReplace(tempTable, '@', payload[configuration.ConstantSCMSubcampaignPlan])
          multi.zadd(tableName, score, subcampaignHashID)
        }

        if (updateFlag) {
          var campaignStatus = 'pending'
          var campaignMessage = configuration.message.campaign.message.pending

          /* Update CampaignModel:campaignHashID */
          tableName = configuration.TableMACampaignModel + campaignHashID
          multi.hmset(tableName,
            configuration.ConstantCMCampaignStatus, campaignStatus,
            configuration.ConstantCMMessage, campaignMessage
          )
          multi.exec(function (err, replies) {
            if (err) {
              callback(err, null)
              return
            }
            callback(null, configuration.message.subcampaign.update.successful)
          })
        }
      }
    )
  },

  deleteSubcampaignModel: function (redisClient, campaignHashID, subcampaignHashID, callback) {
    var multi = redisClient.multi()
    tableName = configuration.TableMASubcampaignModel + subcampaignHashID
    redisClient.hmget(tableName,
      configuration.ConstantSCMSubcampaignStyle,
      configuration.ConstantSCMSubcampaignPlan,
      function (err, replies) {
        if (err) {
          callback(err, null)
          return
        }

        /* Remove from CampaignModel:SubcampaignModel:SubcampaignStyleType:campaignHashID */
        tempTable = configuration.TableModel.general.SubcampaignModel
        tableName = utility.stringReplace(tempTable, '@', replies[0]) + campaignHashID
        multi.zrem(tableName, subcampaignHashID)

        /* Remove from CampaignModel:SubcampaignModel:SubcampaignPlanType:campaignHashID */
        tempTable = configuration.TableModel.general.SubcampaignModel
        tableName = utility.stringReplace(tempTable, '@', replies[1]) + campaignHashID
        multi.zrem(tableName, subcampaignHashID)

        /* Remove from CampaignModel:SubcampaignModel:SubcampaignStyleType: */
        tempTable = configuration.TableModel.general.SubcampaignModel
        tableName = utility.stringReplace(tempTable, '@', replies[0])
        multi.zrem(tableName, subcampaignHashID)

        /* Remove from CampaignModel:SubcampaignModel:SubcampaignPlanType: */
        tempTable = configuration.TableModel.general.SubcampaignModel
        tableName = utility.stringReplace(tempTable, '@', replies[1])
        multi.zrem(tableName, subcampaignHashID)

        /* Remove from CampaignModel:SubcampaignModel:campaignHashID */
        tableName = configuration.TableMSCampaignModelSubcampaignModel + campaignHashID
        multi.zrem(tableName, subcampaignHashID)

        tableName = configuration.TableMASubcampaignModel + subcampaignHashID
        multi.hdel(tableName,
          configuration.ConstantSCMMinBudget,
          configuration.ConstantSCMSubcampaignName,
          configuration.ConstantSCMSubcampaignStyle,
          configuration.ConstantSCMSubcampaignPlan,
          configuration.ConstantSCMSubcampaignPrice,
          configuration.ConstantSCMFileURL
        )

        multi.exec(function (err, replies) {
          if (err) {
            callback(err, null)
            return
          }
          callback(null, configuration.message.subcampaign.delete.successful)
        })
      }
    )
  }
}