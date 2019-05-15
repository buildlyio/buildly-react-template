import React from 'react'
import renderer from 'react-test-renderer'
import FjCard from 'ui-components/Card/Card'
import 'jest-styled-components'

test('card test', () => {
    const tree = renderer.create(<FjCard />).toJSON()
    expect(tree).toMatchSnapshot()
})
