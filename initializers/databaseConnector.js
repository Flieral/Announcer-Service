var redis = require('redis')

module.exports = {
 start: function (api, next) {
  api.redisClient = {}
    api.redisClient = redis.createClient()
    api.redisClient.on('error', function (err) {
      api.log('[DATABASE][REDIS][ERROR]', 'info')
   next(err)
  })
  api.redisClient.on('ready', function () {
   api.log('[DATABASE][REDIS][START]', 'info')
   next()
  })
 },

 stop: function (api, next) {
    api.redisClient.quit()
    api.redisClient.on('error', function (err) {
   api.log('[DATABASE][REDIS][ERROR]', 'info')
   next(err)
    })
  api.redisClient.on('end', function () {
   api.log('[DATABASE][REDIS][STOP]', 'info')
   next()
  })
 }
}