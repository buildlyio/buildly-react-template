import React from 'react'
import renderer from 'react-test-renderer'
import { Button }  from 'ui-components/Button/Button.js'
import { colors } from 'colors'
import 'jest-styled-components'

test('simple button test', () => {
    const tree = renderer.create(<Button />).toJSON()
    expect(tree).toMatchSnapshot()
    expect(tree).toHaveStyleRule('color', colors.white)
    expect(tree).toHaveStyleRule('background-color', colors.primary)
})

test('secondary button test', () => {
    const tree = renderer.create(<Button secondary />).toJSON()
    expect(tree).toMatchSnapshot()
    expect(tree).toHaveStyleRule('color', colors.primary)
    expect(tree).toHaveStyleRule('background-color', colors.primary)
})

test('upload button test', () => {
    const tree = renderer.create(<Button small upload />).toJSON()
    expect(tree).toMatchSnapshot()
    expect(tree).toHaveStyleRule('position', 'relative')
})