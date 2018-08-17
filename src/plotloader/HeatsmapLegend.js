import React from 'react'
//import ReactHighcharts from 'react-highcharts
//const Highcharts = ReactHighcharts.Highcharts

function HeatsmapLegend(H) {
    
    // wrap for rendering ticks: 
    H.wrap(H.Chart.prototype, "render", function(p) {
        p.call(this);
        if (this.series && this.series[0] && this.series[0].colorAxis) {
            this.colorAxis[0].render();   
        }
    });
    H.wrap(H.Chart.prototype, "getAxisMargins", function(p) {
        p.call(this);
        if (this.series && this.series[0] && this.series[0].colorAxis) {
            this.colorAxis[0].getOffset();   
        }
    });
    
    // add colorAxis
    H.seriesTypes.scatter.prototype.axisTypes.push("colorAxis");
    H.seriesTypes.scatter.prototype.optionalAxis = "colorAxis";
    H.wrap(
      H.seriesTypes.scatter.prototype,
      "init",
      function(p, chart, options) {
        p.call(this, chart, options);
      }
    );
    // draw points and add setting colors
    H.wrap(
      H.seriesTypes.scatter.prototype,
      "translate",
      function(p, positions) {
        p.call(this, positions);
        this.translateColors();
      }
    );
    // copy method from heatmap for color mixin
    H.seriesTypes.scatter.prototype.translateColors = H.seriesTypes.heatmap.prototype.translateColors;
    // use "percentage" or "value" or "custom_param" to calculate color
    H.seriesTypes.scatter.prototype.colorKey = "colorv";
}

export default HeatsmapLegend