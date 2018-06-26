import React from 'react'
import renderer from 'react-test-renderer'

import Enzyme from 'enzyme'
import {shallow, mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import Select from 'react-select'

import PlotSettingsDropdown from '../src/PlotSettingsDropdown'
import {_formatDropdownOption} from '../src/PlotSettingsDropdown'

Enzyme.configure({ adapter: new Adapter() })

describe('_formatDropdownOption', () => {
  test('converts a string into an option object', () => {
    const optionString = 'dropdown option'
    const result = _formatDropdownOption(optionString)

    const expected = {
      value: optionString,
      label: optionString
    }

    expect(result).toMatchObject(expected)
  })
})

describe('PlotSettingsDropdown', () => {
  test(`with no data matches snapshot`, () => {
    const onSelect = () => {}

    const tree = renderer
      .create(<PlotSettingsDropdown onSelect={onSelect} options={[]}/>)
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  test('contains Select component and label', () => {
    const onSelect = () => {}
    
    const options = [
      {
        value: 'hello',
        label: 'hello'
      },
      {
        value: 'world',
        label: 'world'
      }
    ]

    const wrapper = mount(<PlotSettingsDropdown labelText={'Test dropdown'} defaultValue={'world'} options={options} onSelect={onSelect}/>)

    expect(wrapper.find('label').text()).toBe('Test dropdown')
    expect(wrapper.find(Select).length).toBe(1)
  })
})