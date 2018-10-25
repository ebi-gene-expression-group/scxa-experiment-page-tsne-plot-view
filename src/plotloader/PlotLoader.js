import React from 'react'
import PropTypes from 'prop-types'

import LoadingOverlay from './LoadingOverlay'
import ScatterPlot from './ScatterPlot'

import SeriesPropTypes from './SeriesPropTypes'

const PlotLoader = ({loading, series, errorMessage, highchartsConfig, resourcesUrl, wrapperClassName, chartClassName,
  legendWidth, style}) =>
  errorMessage ?
    <div className={`${wrapperClassName} text-center scxa-error`}>
      <p>{errorMessage}</p>
    </div> :

    <div style={ Object.assign({}, {position: `relative`}, style) } className={wrapperClassName}>
      <ScatterPlot chartClassName={chartClassName}
        series={series}
        highchartsConfig={highchartsConfig}
        legendWidth ={legendWidth}
      />
      <LoadingOverlay show={loading}
        resourcesUrl={resourcesUrl}
      />
    </div>

PlotLoader.propTypes = {
  loading: PropTypes.bool.isRequired,
  series: SeriesPropTypes,
  errorMessage: PropTypes.string,
  highchartsConfig: PropTypes.object,
  chartClassName: PropTypes.string,
  resourcesUrl: PropTypes.string,
  legendWidth: PropTypes.number,
  wrapperClassName: PropTypes.string
}

PlotLoader.defaultProps = {
  wrapperClassName: ``,
  chartClassName: ``,
  highchartsConfig: {},
  resourcesUrl: ``
}

export default PlotLoader
