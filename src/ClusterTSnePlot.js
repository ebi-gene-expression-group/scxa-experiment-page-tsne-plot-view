import React from 'react'
import PropTypes from 'prop-types'
import Color from 'color'

import ScatterPlotLoader from './plotloader/PlotLoader'
import PlotSettingsDropdown from './PlotSettingsDropdown'
import {_formatDropdownOption} from './PlotSettingsDropdown'

const _colourizeClusters = (highlightSeries) =>
  (series) => series.map((aSeries) => {
    // I can’t think of a better way to reconcile series.name being a string and highlightSeries being an array of
    // numbers. For more flexibility we might think of having our series be identified by an arbitrary ID string
    if (!highlightSeries.length || highlightSeries.length === series.length || highlightSeries.map((hs) => `Cluster ${hs}`).includes(aSeries.name)) {
      return aSeries
    } else {
      return {
        name: aSeries.name,
        data: aSeries.data.map((point) => ({
          ...point,
          color: Color(`lightgrey`).alpha(0.65).rgb().toString()
        }))
      }
    }
  })

const ClusterTSnePlot = (props) => {
  const {ks, perplexities, metadata, selectedPerplexity, onChangePerplexity, selectedColourBy, onChangeColourBy} = props  // Select
  const {plotData, highlightClusters, height, tooltipContent} = props   // Chart
  const {loading, resourcesUrl, errorMessage} = props   // Overlay

  const highchartsConfig = {
    plotOptions: {
      scatter: {
        marker: {
          symbol: `circle`
        }
      }
    },
    // Generated with http://tools.medialab.sciences-po.fr/iwanthue/
    colors: [
      `rgba(212, 137, 48, 0.7)`,
      `rgba(71, 193, 152, 0.7)`,
      `rgba(90, 147, 221, 0.7)`,
      `rgba(194, 73, 97, 0.7)`,
      `rgba(128, 177, 66, 0.7)`,
      `rgba(208, 76, 134, 0.7)`,
      `rgba(188, 176, 59, 0.7)`,
      `rgba(132, 43, 102, 0.7)`,
      `rgba(93, 188, 108, 0.7)`,
      `rgba(82, 45, 128, 0.7)`,
      `rgba(101, 133, 52, 0.7)`,
      `rgba(169, 107, 212, 0.7)`,
      `rgba(185, 140, 70, 0.7)`,
      `rgba(82, 88, 180, 0.7)`,
      `rgba(176, 73, 62, 0.7)`,
      `rgba(101, 127, 233, 0.7)`,
      `rgba(214, 126, 188, 0.7)`,
      `rgba(196, 86, 178, 0.7)`,
      `rgba(173, 131, 211, 0.7)`,
      `rgba(193, 84, 47, 0.7)`
    ],
    chart: {
      height: height
    },
    title: {
      text: `Clusters`
    },
    legend: {
      enabled: true
    },
    tooltip: {
      formatter: function(tooltip) {
        const text = 'Loading metadata...'
        const header = `<b>Cell ID:</b> ${this.point.name}<br>` +
                       `<b>Cluster ID:</b> ${this.series.name}<br>`

        tooltipContent(this.point.name)
          .then((response) => {
            const content = response.map((metadata) => {
              return `<b>${metadata.displayName}:</b> ${metadata.value}`
            })

            tooltip.label.attr({
              text: header + content.join("<br>")
            });
          })
          .catch((reason) => {
            tooltip.label.attr({
              text: header
            });
          })

        return header + text
      }
    }
  }

  const perplexityOptions = perplexities.sort((a, b) => a - b).map((perplexity) => ({
   value: perplexity,
   label: perplexity
  }))

  const kOptions = ks.sort((a, b) => a-b).map((k) => ({
    value: k.toString(),
    label: `k = ${k}`,
    group: 'clusters'
  }))

  const metadataOptions = metadata.map((metadata) => ({
    ...metadata,
    group: "metadata"
  }))

  const options = [
    {
      label: 'Metadata',
      options: metadataOptions,
    },
    {
      label: 'Number of clusters',
      options: kOptions,
    },
  ]

  return [
      <div key={`perplexity-k-select`} className={`row`}>
          <div className={`small-12 medium-6 columns`}>
            <PlotSettingsDropdown
              labelText={'t-SNE Perplexity'}
              options={perplexityOptions}
              defaultValue={_formatDropdownOption(selectedPerplexity, selectedPerplexity)}
              onSelect={(selectedOption) => {onChangePerplexity(selectedOption.value)}}/>
          </div>
          <div className={`small-12 medium-6 columns`}>
            <PlotSettingsDropdown
              labelText={'Colour plot by:'}
              options={metadata ? options : kOptions} // Some experiments don't have metadata in Solr, although they should do. Leaving this check in for now so we don't break the entire experiment page.
              defaultValue={_formatDropdownOption(selectedColourBy, `k = ${selectedColourBy}`)}
              onSelect={(selectedOption) => { onChangeColourBy(selectedOption.group, selectedOption.value)}}/>
          </div>
      </div>,

      <ScatterPlotLoader key={`cluster-plot`}
                         wrapperClassName={`row`}
                         chartClassName={`small-12 columns`}
                         series={_colourizeClusters(highlightClusters)(plotData.series)}
                         highchartsConfig={highchartsConfig}
                         loading={loading}
                         resourcesUrl={resourcesUrl}
                         errorMessage={errorMessage}
      />
  ]
}

ClusterTSnePlot.propTypes = {
  height: PropTypes.number.isRequired,

  plotData: PropTypes.shape({
    series: PropTypes.array.isRequired
  }),
  highlightClusters: PropTypes.array,

  ks: PropTypes.arrayOf(PropTypes.number).isRequired,
  metadata: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string
  })),
  selectedColourBy: PropTypes.string,
  onChangeColourBy: PropTypes.func,

  perplexities: PropTypes.arrayOf(PropTypes.number).isRequired,
  selectedPerplexity: PropTypes.number.isRequired,
  onChangePerplexity: PropTypes.func.isRequired,

  loading: PropTypes.bool.isRequired,
  resourcesUrl: PropTypes.string,
  errorMessage: PropTypes.string,

  tooltipContent: PropTypes.func
}

export {ClusterTSnePlot as default, _colourizeClusters}
