import React from 'react'
import renderer from 'react-test-renderer'

import Enzyme from 'enzyme'
import {shallow, mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import MultiStopGradient from '../src/MultiStopGradient'
import HighchartsSeriesGenerator from 'highcharts-series-generator'
import ScientificNotationNumber from 'expression-atlas-number-format'

Enzyme.configure({ adapter: new Adapter() })

describe('MultiStopGradient', () => {
  // const LINE_HEIGHT = 24
  const GRADIENT_HEIGHT = 600
  const seriesNames = [`0`, `1`, `2`, `3`, `4`]
  const maxPointsPerSeries = 1000

  // This is copied from GeneExpressionTSnePlot.test.js -> Extract into common test utilities?
  const plotData = (series) => {
    const allPoints = series.reduce((acc, series) => acc.concat(series.data), [])

    return {
      series: series,
      min: Math.min(...allPoints.map((point) => point.expressionLevel)),
      max: Math.max(...allPoints.map((point) => point.expressionLevel)),
      unit: `TPM`
    }
  }

  const colourRanges = [
    {
      colour: `rgb(215, 255, 255)`,
      threshold: 0,
      stopPosition: 0
    },
    {
      colour: `rgb(128, 255, 255)`,
      threshold: 10,
      stopPosition: 20
    },
    {
      colour: `rgb(0, 85, 225)`,
      threshold: 100,
      stopPosition: 40
    },
    {
      colour: `rgb(0, 0, 115)`,
      threshold: 10000,
      stopPosition: 100
    }
  ]

  test(`with random data matches snapshot`, () => {
    const seed = `A hair, Morty. I need one of your hairs. This isn’t Game of Thrones.`
    const randomSeries = HighchartsSeriesGenerator.generate(seriesNames, maxPointsPerSeries, seed)

    const tree = renderer
      .create(<MultiStopGradient height={GRADIENT_HEIGHT} showTicks={true} colourRanges={colourRanges} plotData={plotData(randomSeries)}/>)
      .toJSON();

    expect(tree).toMatchSnapshot()
  })

  test(`displays 4 ticks, 2 on the right and 2 on the left`, () => {
    const randomSeries = HighchartsSeriesGenerator.generate(seriesNames, maxPointsPerSeries)
    const data = plotData(randomSeries)
    const wrapper = mount(<MultiStopGradient height={GRADIENT_HEIGHT} showTicks={true} colourRanges={colourRanges} plotData={data}/>)

    expect(wrapper.find('.tick').length).toBe(4)
    expect(wrapper.find('.tick .right').length).toBe(2)
    expect( wrapper.find('.tick .left').length).toBe(2)
  })

  test(`min tick has a lower value and position than max tick`, () => {
    const randomSeries = HighchartsSeriesGenerator.generate(seriesNames, maxPointsPerSeries)
    const data = plotData(randomSeries)
    const wrapper = mount(<MultiStopGradient height={GRADIENT_HEIGHT} showTicks={true} colourRanges={colourRanges} plotData={data}/>)

    // The max tick should be positioned higher than the min tick
    const maxTick = wrapper.find('.tick .left').parent().get(0)
    const minTick = wrapper.find('.tick .left').parent().get(0)

    expect(parseInt(maxTick.props.style.top)).toBeGreaterThanOrEqual(parseInt(minTick.props.style.top))

    // The first left tick should be the max expression value, the second the min expression value
    const maxTickNumber = wrapper.find('.tick .left').find(ScientificNotationNumber).get(0)
    const minTickNumber = wrapper.find('.tick .left').find(ScientificNotationNumber).get(1)

    expect(maxTickNumber.props.value).toBe(Math.round10(data.max, -2))
    expect(minTickNumber.props.value).toBe(Math.round10(data.min, -2))

  })

})
