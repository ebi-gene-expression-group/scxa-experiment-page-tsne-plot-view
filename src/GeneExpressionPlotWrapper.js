import React from 'react'
import PropTypes from 'prop-types'

import GeneExpressionTSnePlot from './GeneExpressionTSnePlot'

class GeneExpressionPlotWrapper extends React.Component {
  constructor(props) {
    super(props)
    this.state={
      clusters: []
    }
  }
  componentDidMount() {
    this.props.eventEmitter.on(`scream`, data => {
      const clusters = this.state.clusters
      clusters.includes(data) ? clusters.splice( clusters.indexOf(data), 1 ) : clusters.push(data)
      this.setState({
        clusters: clusters
      })
    })
  }

  componentDidUpdate(previousProps) {
    if (previousProps.selectedColourByCategory !== this.props.selectedColourByCategory ||
      previousProps.selectedPerplexity  !== this.props.selectedPerplexity ||
      previousProps.experimentAccession !== this.props.experimentAccession ||
      previousProps.selectedColourBy !== this.props.selectedColourBy ||
      previousProps.geneId !== this.props.geneId) {
      this.setState({
        clusters: []
      })
    }
  }

  render() {
    const {expressionPlotClassName,height,geneExpressionData ,atlasUrl, suggesterEndpoint,onSelectGeneId,
      geneId, speciesName, loadingGeneExpression, resourcesUrl, geneExpressionErrorMessage, eventEmitter} = this.props
    return(
      <div className={expressionPlotClassName}>
        <GeneExpressionTSnePlot
          height={height}
          plotData={geneExpressionData}
          atlasUrl={atlasUrl}
          suggesterEndpoint={suggesterEndpoint}
          onSelectGeneId={onSelectGeneId}
          cluster={this.state.clusters}
          eventEmitter={eventEmitter}
          geneId={geneId}
          speciesName={speciesName}
          highlightClusters={[]}
          loading={loadingGeneExpression}
          resourcesUrl={resourcesUrl}
          errorMessage={geneExpressionErrorMessage}
        />
      </div>)
  }
}

GeneExpressionPlotWrapper.propTypes = {
  atlasUrl: PropTypes.string.isRequired,
  loadingGeneExpression: PropTypes.bool,
  geneExpressionErrorMessage: PropTypes.string,
  expressionPlotClassName: PropTypes.string,
  suggesterEndpoint: PropTypes.string.isRequired,
  experimentAccession: PropTypes.string.isRequired,

  selectedPerplexity: PropTypes.number.isRequired,
  geneExpressionData: PropTypes.shape({
    series: PropTypes.array.isRequired,
    unit: PropTypes.string.isRequired,
    max: PropTypes.number,
    min: PropTypes.number
  }),
  selectedColourBy: PropTypes.string,
  selectedColourByCategory: PropTypes.string,
  eventEmitter: PropTypes.func,

  geneId: PropTypes.string.isRequired,
  speciesName: PropTypes.string.isRequired,
  height: PropTypes.number,
  resourcesUrl: PropTypes.string,
  onSelectGeneId: PropTypes.func
}

export default GeneExpressionPlotWrapper