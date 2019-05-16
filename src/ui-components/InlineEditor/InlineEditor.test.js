import React from 'react'
import renderer from 'react-test-renderer'
import InlineEditor from 'ui-components/Card/Card'
import 'jest-styled-components'

test('inlineEditor test', () => {
    const tree = renderer.create(<InlineEditor />).toJSON()
    expect(tree).toMatchSnapshot()
})

test('inlineEditor h1 test', () => {
    const tree = renderer.create(<InlineEditor tag="h1" />).toJSON()
    expect(tree).toMatchSnapshot()
})
