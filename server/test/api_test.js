import React from 'react'
import { expect } from 'chai'
import axios from 'axios'

describe('api', () => {
  it('/', (done) => {
    axios.get('http://localhost:8050/api')
      .then(res => {
        expect(res.data.greeting).to.equal('hello, world!')
        done()
      })
      .catch(err => done(err))
  })
})
