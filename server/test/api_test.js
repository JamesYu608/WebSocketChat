import React from 'react'
import { expect } from 'chai'
import request from 'request'

describe('api', () => {
  it('/', (done) => {
    request('http://localhost:8050/api', (err, response, body) => {
      if (err) done(err)

      expect(JSON.parse(body).greeting).to.equal('hello, world!')
      done()
    })
  })
})
