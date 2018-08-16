import React from 'react'
import PropTypes from 'prop-types'
import ReactHighcharts from 'react-highcharts'
import HighchartsExporting from 'highcharts/modules/exporting'
import HighchartsBoost from 'highcharts/modules/boost'
import HighchartsHeatmap from 'highcharts/modules/heatmap.js'
import HighchartsMap from 'highcharts-map'
import deepmerge from 'deepmerge'

import HeatsmapLegend from './HeatsmapLegend'
import SeriesPropTypes from './SeriesPropTypes'
import Yaxispanning from './Yaxispanning'


const Highcharts = ReactHighcharts.Highcharts
// Only apply modules if Highcharts isn’t a *good* mock -- Boost/Exporting can break tests
// if (Highcharts.getOptions()) {
  HighchartsExporting(Highcharts)
  HighchartsBoost(Highcharts)
  HighchartsMap(Highcharts)
  HighchartsHeatmap(Highcharts)
  HeatsmapLegend(Highcharts)
  Yaxispanning(Highcharts)


const highchartsBaseConfig = {
  credits: {
    enabled: false
  },
   
  chart: {
    type: `scatter`,
    //zoomType: `xy`,
    borderWidth: 1,
    borderColor: `dark blue`,
    height: `100%`,
    panning: true,
    spacingTop: 50,
    //panKey: 'shift'
  },
  //subtitle: {
  //  text: 'Click and drag to zoom in. Hold down shift key to pan.'
  //},
  mapNavigation: {
    enabled: true,
    enableMouseWheelZoom: false,
    buttonOptions: {
      theme: {
        fill: 'white',
        'stroke-width': 1,
        stroke: 'silver',
        r: 0,
        states: {
            hover: {
                fill: '#a4edba'
            },
            select: {
                stroke: '#039',
                fill: '#a4edba'
            }
      }
    },
    verticalAlign: 'bottom',
    }
  },
  boost: {
    useGPUTranslations: true,
    usePreAllocated: true,
    seriesThreshold: 5000
  },
  title: {
    text: null,
    style: {
      fontSize: `25px`,
      fontWeight: 'bold'
    }
  },
  xAxis: {
    title: {
      text: null
    },
    labels: {
      enabled: false
    },
    tickWidth: 0
  },
  yAxis: {
    title: {
      text: null
    },
    labels: {
      enabled: false
    },
    gridLineWidth: 0,
    lineWidth: 1,
    endOnTick: false,
    startOnTick: false
  },
  colors: [`#b25fbc`, `#76b341`, `#6882cf`, `#ce9b44`, `#c8577b`, `#4fae84`, `#c95c3f`, `#7c7f39`],
  plotOptions: {
    series: {
      turboThreshold: 0,
      animation: false,
    }
  }
}

const ScatterPlot = (props) => {
  const {chartClassName, series, highchartsConfig, children} = props

  const numPoints = series.reduce((acc, aSeries) => acc + aSeries.data.length, 0)
  const config =
    deepmerge.all([
      highchartsBaseConfig,
      {
        plotOptions: {
          series: {
            marker: {
              radius: numPoints < 1000 ? 3 : 3
            }
          }
        }
      },
      { series: series },
      highchartsConfig
    ], { arrayMerge: (destination, source) => source }) // Don’t merge

  return [
    <div key={`chart`} className={chartClassName}>
      <ReactHighcharts config={config}/>
    </div>

  ]
}

ScatterPlot.propTypes = {
  chartClassName: PropTypes.string,
  series: SeriesPropTypes,
  highchartsConfig: PropTypes.object,
  children: PropTypes.object
}

ScatterPlot.defaultProps = {
  highchartsConfig: {},
  children: null
}

export default ScatterPlot
