exports['default'] = {
  routes: function (api) {
    return {

      get: [{
          path: '/:apiVersion/account/announcer/:accountHashID',
          action: 'getAccountModelAction'
        },
        {
          path: '/:apiVersion/account/:accountHashID/campaign',
          action: 'getCampaignListAction'
        },
        {
          path: '/:apiVersion/account/:accountHashID/campaign/:campaignHashID',
          action: 'getCampaignModelAction'
        },
        {
          path: '/:apiVersion/account/:accountHashID/campaign/:campaignHashID/subcampaign',
          action: 'getSubcampaignListAction'
        },
        {
          path: '/:apiVersion/account/:accountHashID/campaign/:campaignHashID/subcampaign/:subCampaignHashID',
          action: 'getSubcampaignModelAction'
        },
        {
          path: '/:apiVersion/account/:accountHashID/campaign/:campaignHashID/setting',
          action: 'getCampaignSettingAction'
        },
        {
          path: '/:apiVersion/account/:accountHashID/campaign/:campaignHashID/subcampaign/:subCampaignHashID/setting',
          action: 'getSubcampaignSettingAction'
        }
      ],

      post: [{
          path: '/:apiVersion/account/announcer/:accountHashID',
          action: 'setAccountModelAction'
        },
        {
          path: '/:apiVersion/account/:accountHashID/campaign',
          action: 'setCampaignModelAction'
        },
        {
          path: '/:apiVersion/account/:accountHashID/campaign/:campaignHashID/subcampaign',
          action: 'setSubcampaignModelAction'
        }
      ],

      put: [{
          path: '/:apiVersion/account/announcer/:accountHashID',
          action: 'updateAccountModelAction'
        },
        {
          path: '/:apiVersion/account/:accountHashID/campaign/:campaignHashID',
          action: 'updateCampaignModelAction'
        },
        {
          path: '/:apiVersion/account/:accountHashID/campaign/:campaignHashID/subcampaign/:subCampaignHashID',
          action: 'updateSubcampaignModelAction'
        },
        {
          path: '/:apiVersion/account/:accountHashID/campaign/:campaignHashID/setting',
          action: 'saveCampaignSettingAction'
        },
        {
          path: '/:apiVersion/account/:accountHashID/campaign/:campaignHashID/subcampaign/:subCampaignHashID/setting',
          action: 'saveSubcampaignSettingAction'
        }
      ],

      delete: [{
          path: '/:apiVersion/account/:accountHashID/campaign/:campaignHashID',
          action: 'deleteCampaignModelAction'
        },
        {
          path: '/:apiVersion/account/:accountHashID/campaign/:campaignHashID/subcampaign/:subCampaignHashID',
          action: 'deleteSubcampaignModelAction'
        }
      ]
    }
  }
}