import React from 'react'
import renderer from 'react-test-renderer'

import Enzyme from 'enzyme'
import {mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import GeneExpressionPlotWrapper from '../src/GeneExpressionPlotWrapper'
import GeneExpressionTSnePlot from '../src/GeneExpressionTSnePlot'

import {gradientColourRanges, plotData, randomHighchartsSeriesWithSeed} from './Utils'
import '../src/util/MathRound'

Enzyme.configure({ adapter: new Adapter() })

const randomSeries = randomHighchartsSeriesWithSeed()
const onSelectGeneId = () => {}
const eventEmitter = {on: () => {}, emit: () => {}}

describe(`GeneExpressionPlotWrapper`, () => {
  test(`with random data matches snapshot`, () => {
    const tree = renderer
      .create(<GeneExpressionPlotWrapper
        height={600} expressionGradientColours={gradientColourRanges()} atlasUrl={``}
        suggesterEndpoint={``} onSelectGeneId={onSelectGeneId} loadingGeneExpression={true}
        geneExpressionData={plotData(randomSeries)} highlightClusters={[]} speciesName={``} eventEmitter={eventEmitter}/>)
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  test(`contains GeneExpressionTSnePlot`, () => {
    const wrapper = mount(<GeneExpressionPlotWrapper
      height={600} expressionGradientColours={gradientColourRanges()} atlasUrl={``}
      suggesterEndpoint={``} onSelectGeneId={onSelectGeneId} loadingGeneExpression={true}
      geneExpressionData={plotData(randomSeries)} highlightClusters={[]} speciesName={``} eventEmitter={eventEmitter}/>)
    expect(wrapper.find(GeneExpressionTSnePlot).length).toBe(1)
  })

})
