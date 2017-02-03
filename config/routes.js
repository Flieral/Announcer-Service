exports['default'] = {
  routes: function (api) {
    return {

      get: [{
          path: '/account/announcer/:accountHashID',
          action: 'getAccountModelAction'
        },
        {
          path: '/account/:accountHashID/campaign',
          action: 'getCampaignListAction'
        },
        {
          path: '/account/:accountHashID/campaign/:campaignHashID',
          action: 'getCampaignModelAction'
        },
        {
          path: '/account/:accountHashID/campaign/:campaignHashID/subcampaign',
          action: 'getSubcampaignListAction'
        },
        {
          path: '/account/:accountHashID/campaign/:campaignHashID/subcampaign/:subCampaignHashID',
          action: 'getSubcampaignModelAction'
        },
        {
          path: '/account/:accountHashID/campaign/:campaignHashID/setting',
          action: 'getCampaignSettingAction'
        },
        {
          path: '/account/:accountHashID/campaign/:campaignHashID/subcampaign/:subCampaignHashID/setting',
          action: 'getSubcampaignSettingAction'
        }
      ],

      post: [{
          path: '/account/announcer/:accountHashID',
          action: 'setAccountModelAction'
        },
        {
          path: '/account/:accountHashID/campaign',
          action: 'setCampaignModelAction'
        },
        {
          path: '/account/:accountHashID/campaign/:campaignHashID/subcampaign',
          action: 'setSubcampaignModelAction'
        }
      ],

      put: [{
          path: '/account/announcer/:accountHashID',
          action: 'updateAccountModelAction'
        },
        {
          path: '/account/:accountHashID/campaign/:campaignHashID',
          action: 'updateCampaignModelAction'
        },
        {
          path: '/account/:accountHashID/campaign/:campaignHashID/subcampaign/:subCampaignHashID',
          action: 'updateSubcampaignModelAction'
        },
        {
          path: '/account/:accountHashID/campaign/:campaignHashID/setting',
          action: 'saveCampaignSettingAction'
        },
        {
          path: '/account/:accountHashID/campaign/:campaignHashID/subcampaign/:subCampaignHashID/setting',
          action: 'saveSubcampaignSettingAction'
        }
      ],

      delete: [{
          path: '/account/:accountHashID/campaign/:campaignHashID',
          action: 'deleteCampaignModelAction'
        },
        {
          path: '/account/:accountHashID/campaign/:campaignHashID/subcampaign/:subCampaignHashID',
          action: 'deleteSubcampaignModelAction'
        }
      ]
    }
  }
}