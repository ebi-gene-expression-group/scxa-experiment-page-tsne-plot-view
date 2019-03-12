import React from 'react'
import { withEmit } from "react-emit"

import GeneExpressionTSnePlot from './GeneExpressionTSnePlot'

class MyCoolComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state={
      clusters: []
    }
  }
  componentDidMount() {
    this.props.on(`SomeButton:clicked`, data => {
      const clusters = this.state.clusters
      clusters.includes((data+1).toString()) ? clusters.splice( clusters.indexOf((data+1).toString()), 1 ) :
        clusters.push((data+1).toString())
      this.setState({
        clusters: clusters
      })
    })
  }
  render() {
    const {expressionPlotClassName,height,geneExpressionData ,atlasUrl, suggesterEndpoint,onSelectGeneId,
      geneId, speciesName, loadingGeneExpression, resourcesUrl, geneExpressionErrorMessage} = this.props
    return(
      <div className={expressionPlotClassName}>
        <GeneExpressionTSnePlot
          height={height}
          plotData={geneExpressionData}
          atlasUrl={atlasUrl}
          suggesterEndpoint={suggesterEndpoint}
          onSelectGeneId={onSelectGeneId}
          cluster={this.state.clusters}
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

export default withEmit(MyCoolComponent)