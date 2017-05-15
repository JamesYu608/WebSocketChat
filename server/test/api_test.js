import React from 'react'
import { expect } from 'chai'
import request from 'request'
import querystring from 'querystring'

const API_URL_PREFIX = 'http://localhost:8050/api'

describe('api', () => {
  it('/', (done) => {
    request(API_URL_PREFIX, (err, response, body) => {
      if (err) done(err)

      expect(JSON.parse(body).greeting).to.equal('hello, world!')
      done()
    })
  })

  describe('/devicelist', () => {
    it('/sn: No parameter', (done) => {
      request(`${API_URL_PREFIX}/sn`, (err, response, body) => {
        if (err) done(err)

        expect(response.statusCode).to.equal(400)
        done()
      })
    })

    it('/sn', (done) => {
      const query = querystring.stringify({sn: 'F9AZCY35T704'})
      request(`${API_URL_PREFIX}/sn?${query}`, (err, response, body) => {
        if (err) done(err)

        expect(response.statusCode).to.equal(200)

        const firstResult = JSON.parse(body)[0]
        expect(firstResult).to.include.keys('device_id')
        expect(firstResult).to.include.keys('sn')
        done()
      })
    })
  })
})
