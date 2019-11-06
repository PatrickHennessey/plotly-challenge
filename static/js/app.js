function buildMetadata(sample) {

  // @TODO: Compvare the following function that builds the metadata panel

    // Use d3 to select the panel with id of `#sample-metadata`
    var selectData = d3.select('#sample-metadata');

    // Use `d3.json` to fetch the metadata for a sample
    d3.json(`/metadata/${sample}`).then(d => {
      // Use `.html("") to clear any existing metadata
      selectData.html('');
      Object
          // Use `Object.entries` to add each key and value pair to the panel
        .entries(d)
        .forEach(([k, v]) => {
          selectData
            /* Hint: Inside the loop, you will need to use d3 to append new
            tags for each key-value in the metadata. */
            .append('p').text(`${k}: ${v}`)
            .append('hr')
      });
    })
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(d => {

    /* @TODO: Build a Pie Chart
    HINT: You will need to use slice() to grab the top 10 sample_values, otu_ids, and labels (10 each).
    Use `sample_values` as the values for the PIE chart.
    Use `otu_ids` as the labels for the pie chart.
    Use `otu_labels` as the hovertext for the chart. */  
    var labels = d.otu_ids.slice(0, 10);
    var values = d.sample_values.slice(0, 10);
    var hovertext = d.otu_labels.slice(0, 10);

    var trace = [{
      values: values,
      labels: labels,
      type: "pie",
      textposition: "inside",
      hovertext: hovertext,
      hole: 0.5
    }];

    var layoutPie = {
      title: '<b> Belly Button Pie Chart </b>',
      plot_bgcolor: 'rgba(0, 0, 0, 0)',
      paper_bgcolor: 'LightSteelBlue',
      
    };

    Plotly.newPlot('pie', trace, layoutPie, {
      responsive: true
    });

    /* @TODO: Build a Bubble Chart using the sample data
    Use `otu_ids` for the x values.
    Use `sample_values` for the y values.
    Use `sample_values` for the marker size.
    Use `otu_ids` for the marker colors.
    Use `otu_labels` for the text values. */
    var x = d.otu_ids;
    var y = d.sample_values;
    var markersize = d.sample_values;
    var markercolors = d.otu_ids;
    var textvalues = d.otu_labels;

    var trace =[{
      x: x,
      y: y,
      mode: 'markers',
      marker: {
        size: markersize,
        color: markercolors,
      },
      text: textvalues
    }];

    let layoutBubbles ={
      title:"<h2> Belly Button Bubbles </h2>",
      xaxis: {
        title: 'OTU ID',
      },
      yaxis: {
        title: 'Sample Value'
      },
      width:1280,
      plot_bgcolor: 'rgba(0, 0, 0, 0)',
      paper_bgcolor: 'rgba(0, 0, 0, 0)',
    };

    Plotly.newPlot('bubble', trace, layoutBubbles, {responsive: true});
    });



}


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();