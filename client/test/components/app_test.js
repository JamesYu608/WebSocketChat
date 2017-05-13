import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'

import App from '../../src/components/app'

describe('App', () => {
  it('Hello, app!', () => {
    const wrapper = shallow(<App/>)
    console.log(wrapper.props().children)
    expect(wrapper.contains('Hello, world!')).to.equal(true)
  })
})
