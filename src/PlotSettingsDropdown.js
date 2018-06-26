import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

const _formatDropdownOption = option => {
  return {
    value: option,
    label: option
  }
}
const PlotSettingsDropdown = (props) => {
  const {labelText, options, onSelect, defaultValue} = props

  const formatGroupLabel = data => (
    <div>
      <span>{data.label}</span>
    </div>
  )
  const ebiVfSelectStyles = {
    control: (styles, state) => ({
      minHeight: `2.4375rem`,
      margin: `0 0 1rem`,
      padding: `0`,
      appearance: `none`,
      border: state.isFocused ? `1px solid #8a8a8a` : `1px solid #777`,
      borderRadius: `0`,
      backgroundColor: state.isDisabled ? `#e6e6e6` : `#fefefe`,
      fontFamily: `inherit`,
      fontSize: `1rem`,
      fontWeight: `normal`,
      lineHeight: `1.5`,
      color: `#0a0a0a`,
      transition: `box-shadow 0.5s, border-color 0.25s ease-in-out`,
      outline: state.isFocused ? `none` : `inherit`,
      boxShadow: state.isFocused ? `0 0 5px #777` : `none`,
      cursor: state.isDisabled ? `not-allowed` : `default`,
      display: `flex`
    }),
    menu: (styles, state) => ({
      ...styles,
      borderRadius: `0`,
      padding: `0`
    })
  }

  return [
    <label key={"label"}>{labelText}</label>,
    <Select key={"dropdown"}
            options={options}
            onChange={onSelect}
            defaultValue={defaultValue}
            formatGroupLabel={formatGroupLabel}
            styles={ebiVfSelectStyles} />
  ]
}

PlotSettingsDropdown.propTypes = {
  labelText: PropTypes.string,
  options: PropTypes.array,
  onSelect: PropTypes.func
}

export {PlotSettingsDropdown as default, _formatDropdownOption}

