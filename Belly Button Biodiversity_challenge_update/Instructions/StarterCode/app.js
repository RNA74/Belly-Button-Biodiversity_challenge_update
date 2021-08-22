// from data.js



function buildMetadata(sample) {
     d3.json("samples.json").then(function (data) {
          var metadata = data.metadata;
          //console.log('metadata' + sample);
          var demographicInfo = metadata.filter(row => row.id == sample);
          console.log(demographicInfo);
          var samples = demographicInfo[0];
          var metadataSample = d3.select("#sample-metadata");
          metadataSample.html("");
          Object.entries(samples).forEach(([key, value]) => {
               metadataSample.append("h6").text(`${key.toUpperCase()}:${value}`);
          });

          buildGauge(samples.wfreq);
     });
}

function buildCharts(sample) {
     d3.json("samples.json").then(function (data) {
          var samplesArray = data.samples.filter(sampleObject => sampleObject.id === sample);
          var samples = samplesArray[0];

          var sample_values = samples.sample_values;
          var otu_ids = samples.otu_ids;
          var otu_labels = samples.otu_labels;

          var sample_values_slice = sample_values.slice(0, 10).reverse()
          var otu_ids_slice = otu_ids.slice(0, 10).reverse().map(item => {
               return `otu_ids ${item}`;
          });
          //console.log('sample_values_slice', sample_values_slice);
          //console.log('otu_ids_slice', otu_ids_slice);

          // Buid a bar chart
          var trace1 = {
               x: sample_values.slice(0, 10).reverse(),
               y: otu_ids.slice(0, 10).reverse().map(item => {
                    return `otu_ids ${item}`;
               }),
               text: otu_labels.slice(0, 10).reverse(),
               margin: {
                    l: 100,
                    r: 100,
                    t: 100,
                    b: 100
               },

               type: "bar",
               orientation: "h"

          };

          var layout = {
               title: "Top 10 OTUs",
               barmode: 'group',
          };

          Plotly.newPlot("bar", [trace1], layout);

          // Build a bubble chart

          var trace1 = {
               x: sample_values,
               y: otu_ids,
               text: otu_labels,
               mode: 'markers',
               marker: {
                    color: otu_ids,
                    size: sample_values,
               }
          };


          var data = [trace1];

          var layout = {
               title: 'Bacteria Sample',
               showlegend: false,
               height: 600,
               width: 600
          };

          Plotly.newPlot("bubble", data, layout);

          // Build a Gauge chart
          var data = [
               {
                    domain: { x: [0, 1], y: [0, 1] },
                    value: 450,
                    title: "Belly Button Washing Frequency Scrubs per Week",
                    type: "indicator",
                    mode: "gauge+number+delta",
                    delta: { reference: 380 },
                    gauge: {
                         axis: { range: [null, 500] },

                         steps: [
                              { range: [0, 250], color: "lightgray" },
                              { range: [250, 400], color: "gray" }
                         ],
                         threshold: {
                              line: { color: "red", width: 4 },
                              thickness: 0.75,
                              value: 490
                         }
                    }
               }
          ];

          var layout = { width: 600, height: 450, margin: { t: 100, b: 0 } };

          Plotly.newPlot("gauge", data, layout);
     })
};


function init() {
     var selector = d3.select("#selDataset");
     d3.json("samples.json").then(function (data) {
          var Names = data.names;
          Names.forEach(function (sample) {

               selector.append("option").text(sample).property("value", sample);
          });
          var fristSample = Names[0]
          buildCharts(fristSample);
          buildMetadata(fristSample);

     });

}

//On change to the Test Subject ID No
function optionChanged(newSample) {
     console.log('optionChanged' + newSample);
     buildCharts(newSample);
     buildMetadata(newSample);


}

init();