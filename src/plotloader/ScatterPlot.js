import React from 'react'
import PropTypes from 'prop-types'
import ReactHighcharts from 'react-highcharts'

import HighchartsExporting from 'highcharts/modules/exporting'
import HighchartsBoost from 'highcharts/modules/boost'
import HighchartsHeatmap from 'highcharts/modules/heatmap'
//import HighchartsMap from 'highcharts/modules/map'

// import highchartsYAxisPanningModule from './highchartsYAxisPanningModule'
import highchartsHeatmapLegendModule from './highchartsHeatmapLegendModule'

import deepmerge from 'deepmerge'
import SeriesPropTypes from './SeriesPropTypes'

const Highcharts = ReactHighcharts.Highcharts
// Only apply modules if Highcharts isn’t a *good* mock -- Boost/Exporting can break tests
// if (Highcharts.getOptions()) {
async function addModules(){
  await HighchartsExporting(Highcharts)
  await HighchartsBoost(Highcharts)
  //await HighchartsMap(Highcharts)
  await HighchartsHeatmap(Highcharts)
  await highchartsHeatmapLegendModule(Highcharts)
  // await highchartsYAxisPanningModule(Highcharts)
}

addModules()

// https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
const numberWithCommas = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, `,`)

const highchartsBaseConfig = {
  credits: {
    enabled: false
  },

  chart: {
    type: `scatter`,
    borderWidth: 1,
    borderColor: `dark blue`,
    height: `100%`,
    panning: true,
    spacingTop: 50,
    zoomType: `xy`
  },

  // mapNavigation: {
  //   enabled: true,
  //   enableMouseWheelZoom: false,
  //   buttonOptions: {
  //     theme: {
  //       fill: `white`,
  //       'stroke-width': 1,
  //       stroke: `silver`,
  //       r: 0,
  //       states: {
  //           hover: {
  //               fill: `#a4edba`
  //           },
  //           select: {
  //               stroke: `#039`,
  //               fill: `#a4edba`
  //           }
  //       }
  //     },
  //     verticalAlign: `bottom`
  //   }
  // },
  boost: {
    useGPUTranslations: true,
    usePreAllocated: true,
    seriesThreshold: 5000
  },
  title: {
    text: null,
    style: {
      fontSize: `25px`,
      fontWeight: `bold`
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
  const {chartClassName, series, highchartsConfig, legendWidth} = props

  const numPoints = series.reduce((acc, aSeries) => acc + aSeries.data.length, 0)
  const config =
    deepmerge.all([
      highchartsBaseConfig,
      {
        plotOptions: {
          series: {
            marker: {radius: 3}
          }
        },
        subtitle:{
          text: numPoints > 0 ? `Analysis results for ${numberWithCommas(numPoints)} cells` : ``
        },
      },
      {series: series},
      highchartsConfig,
      {
        legend: {symbolWidth: legendWidth}
      }
    ], {arrayMerge: (destination, source) => source}) // Don’t merge
  return (
    <div key={`chart`} className={chartClassName}>
      <ReactHighcharts config={config}/>
    </div>
  )
}

ScatterPlot.propTypes = {
  chartClassName: PropTypes.string,
  series: SeriesPropTypes,
  highchartsConfig: PropTypes.object,
  legendWidth: PropTypes.number
}

ScatterPlot.defaultProps = {
  highchartsConfig: {}
}

export default ScatterPlot
