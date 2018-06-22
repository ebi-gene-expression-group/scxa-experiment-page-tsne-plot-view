import React from 'react'
import ReactDOM from 'react-dom'
import TsnePlotView from '../src/index'

const perplexities = [1, 5, 10, 15, 20]
// const ks = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
const ks = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
const metadata = [
  {
    value: "characteristic_inferred_cell_type",
    label: "Inferred cell type"
  },
  {
    value: "factor_sampling_site",
    label: "Sampling site"
  },
  {
    value: "factor_time",
    label: "Time"
  }]

class Demo extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      k: ks[Math.round((ks.length -1) / 2)],
      perplexity: perplexities[Math.round((perplexities.length - 1) / 2)],
      geneId: `ENSG00000111640`,
      selectedColourBy: ks[Math.round((ks.length -1) / 2)].toString(),
      inputHighlightClusters: ``,
      highlightClusters: [],
      inputExperimentAccession: `E-EHCA-2`,
      experimentAccession: `E-EHCA-2`
    }

    this._handleInputChange = this._handleInputChange.bind(this)
    this._handleSubmit = this._handleSubmit.bind(this)
  }

  _handleInputChange(event) {
    const name = event.target.name

    this.setState({
      [name]: event.target.value
    })
  }

  _handleSubmit(event) {
    event.preventDefault()

    this.setState({
      experimentAccession: this.state.inputExperimentAccession,
      highlightClusters: this.state.inputHighlightClusters.split(`,`).map((e) => parseInt(e.trim())).filter((e) => !isNaN(e))
    })
  }

  render() {
    return(
      <div className={`row column`}>
        <div className={`row column`}>
          <form onSubmit={this._handleSubmit}>
            <label>Highlight clusters (cluster integer IDs separated by commas):</label>
            <input name={`inputHighlightClusters`} type={`text`} onChange={this._handleInputChange} value={this.state.inputHighlightClusters}/>
            <label>Experiment accession:</label>
            <input name={`inputExperimentAccession`} type={`text`} onChange={this._handleInputChange} value={this.state.inputExperimentAccession}/>
            <input className={`button`} type="submit" value="Submit" />
          </form>
        </div>

        <TsnePlotView atlasUrl={`http://localhost:8080/gxa/sc/`}
                            suggesterEndpoint={`json/suggestions`}
                            experimentAccession={this.state.experimentAccession}
                            perplexities={perplexities}
                            selectedPerplexity={this.state.perplexity}
                            ks={ks}
                            selectedK={this.state.k}
                            metadata={metadata}
                            selectedColourBy={this.state.selectedColourBy}
                            selectedColourByCategory={this.state.selectedColourByCategory} // Is the plot coloured by clusters or metadata
                            highlightClusters={this.state.highlightClusters}
                            geneId={this.state.geneId}
                            speciesName={'Homo sapiens'}
                            onChangePerplexity={
                              (perplexity) => { this.setState({perplexity: perplexity}) }
                            }
                            onChangeK={
                              (k) => { this.setState({k: k}) }
                            }
                            onChangeColourBy={
                              (colourByCategory, colourByValue) => {
                                this.setState({selectedColourBy : colourByValue})
                                this.setState({selectedColourByCategory : colourByCategory})

                              }
                            }
                            onSelectGeneId={
                              (geneId) => { this.setState({geneId: geneId}) }
                            }
        />
      </div>
    )
  }
}

const render = (options, target) => {
  ReactDOM.render(<Demo {...options} />, document.getElementById(target))
}

export {render}
