'use strict'
var request = require('request')
var fs = require('fs')
var os = require('os')
var should = require('should')
let path = require('path')
var api
var url

describe('Server: Web', function () {

	before(function (done) {
		url = 'http://localhost:8095/api/1'
		done()
	})

	after(function (done) {
		done()
	})
	// body and accountHashID for set
	var mybodyset1 = JSON.stringify({
		budget: '8000',
		accountType: 'Premium'
	})
	var accountHashID1 = 'alosalamchetory'

	var mybodyset2 = JSON.stringify({
		budget: '2300',
		accountType: 'Free'
	})
	var accountHashID2 = 'salamkhoobam'

	var mybodyset3 = JSON.stringify({
		budget: '4200',
		accountType: 'Free'
	})
	var accountHashID3 = 'chekhabar'

	//body for Update
	var mybodyupdate1 = JSON.stringify({
		budget: '2000'
	})
	var mybodyupdate2 = JSON.stringify({
		budget: '200',
		accountType: 'Premium'
	})
	var mybodyupdate3 = JSON.stringify({
		accountType: 'Premium'
	})


	// 3 Set for 3 conditions
	it('Set an Account For accountHashID1', function (done) {
		request.post(url + '/account/announcer/' + accountHashID1, {
			'body': mybodyset1,
			'headers': {
				'Content-type': 'application/json'
			}
		}, function (error, response, body) {
			if (error) {
				console.log(error)
				done(error)
			}
			body = JSON.parse(body)
			if (response.statusCode >= 200 && response.statusCode < 300) {
				done()
			} else
				done(new Error(body.error))
		})
	})

	it('Set an Account For accountHashID2', function (done) {
		request.post(url + '/account/announcer/' + accountHashID2, {
			'body': mybodyset2,
			'headers': {
				'Content-type': 'application/json'
			}
		}, function (error, response, body) {
			if (error) {
				console.log(error)
				done(error)
			}
			body = JSON.parse(body)
			if (response.statusCode >= 200 && response.statusCode < 300) {
				done()
			} else
				done(new Error(body.error))
		})
	})

	it('Set an Account For accountHashID3', function (done) {
		var mybody = JSON.stringify({
			budget: '8000',
			accountType: 'Free'
		})
		var accountHashID = 'chekhabar'
		request.post(url + '/account/announcer/' + accountHashID3, {
			'body': mybodyset3,
			'headers': {
				'Content-type': 'application/json'
			}
		}, function (error, response, body) {
			if (error) {
				console.log(error)
				done(error)
			}
			body = JSON.parse(body)
			if (response.statusCode >= 200 && response.statusCode < 300) {
				done()
			} else
				done(new Error(body.error))
		})
	})


	// 3 Update for those set 	
	it('Update an Account For accountHashID1', function (done) {
		var mybody = JSON.stringify({
			accountType: 'Premium'
		})

		request.put(url + '/account/announcer/' + accountHashID1, {
			'body': mybodyupdate1,
			'headers': {
				'Content-type': 'application/json'
			}
		}, function (error, response, body) {
			if (error) {
				console.log(error)
				done(error)
			}
			body = JSON.parse(body)
			if (response.statusCode >= 200 && response.statusCode < 300) {
				done()
			} else
				done(new Error(body.error))
		})
	})

	it('Update an Account For accountHashID2', function (done) {
		var mybody = JSON.stringify({
			budget: '300'
		})

		request.put(url + '/account/announcer/' + accountHashID2, {
			'body': mybodyupdate2,
			'headers': {
				'Content-type': 'application/json'
			}
		}, function (error, response, body) {
			if (error) {
				console.log(error)
				done(error)
			}
			body = JSON.parse(body)
			if (response.statusCode >= 200 && response.statusCode < 300) {
				done()
			} else
				done(new Error(body.error))
		})
	})

	it('Update an Account For accountHashID3', function (done) {
		request.put(url + '/account/announcer/' + accountHashID3, {
			'body': mybodyupdate3,
			'headers': {
				'Content-type': 'application/json'
			}
		}, function (error, response, body) {
			if (error) {
				console.log(error)
				done(error)
			}
			body = JSON.parse(body)
			if (response.statusCode >= 200 && response.statusCode < 300) {
				done()
			} else
				done(new Error(body.error))
		})
	})


	//3 Get for Test
	it('Get an Account For accountHashID1', function (done) {
		request.get(url + '/account/announcer/' + accountHashID1, function (error, response, body) {
			if (error) {
				console.log(error)
				done(error)
			}
			body = JSON.parse(body)
			if (parseInt(body.result.budget) == parseInt(JSON.parse(mybodyset1).budget) + parseInt(JSON.parse(mybodyupdate1).budget))
				done()
			else
				done(new Error('budget does not match'))
		})
	})

	it('Get an Account For accountHashID2', function (done) {
		request.get(url + '/account/announcer/' + accountHashID2, function (error, response, body) {
			if (error) {
				console.log(error)
				done(error)
			}
			body = JSON.parse(body)
			if (parseInt(body.result.budget) == parseInt(JSON.parse(mybodyset2).budget) + parseInt(JSON.parse(mybodyupdate2).budget) && body.result.accountType === JSON.parse(mybodyupdate2).accountType)
				done()
			else
				done(new Error('Budget or AccountType does not match'))
		})
	})

	it('Get an Account For accountHashID3', function (done) {
		request.get(url + '/account/announcer/' + accountHashID3, function (error, response, body) {
			if (error) {
				console.log(error)
				done(error)
			}
			body = JSON.parse(body)
			if (body.result.accountType === JSON.parse(mybodyupdate3).accountType)
				done()
			else
				done(new Error('AccountType does not match'))
		})
	})

})