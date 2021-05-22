

function createcharts(inputsample){
  d3.json("samples.json").then(function(data) {
      console.log(data);

      // Grab values from the response json object to build the plots
      var samples = data.samples;
      var result =samples.filter(sampleobj => sampleobj.id == inputsample);
    // console.log(result);
      var result1 = result[0];

      //console.log(samples);
      var ids_otu= result1.otu_ids;
    //console.log(ids_otu);

      var otu_labels = result1.otu_labels;
      //console.log(otu_labels);
      var sample_values= result1.sample_values;
      //console.log(sample_values);
      

      var LayoutBubble = {
        title: "Bacteria culture for sample" + inputsample,
        margin: {t:0},
        hovermode: "closest",
        xaxis: {title:"otu ids"},
        margin: {t:30}
      };

      var DataBubble = [
        {
          x:ids_otu,
          y:sample_values,
          text: otu_labels,
          mode:"markers",
          marker: {
            size: sample_values,
            color: ids_otu,
            colorscale: "Earth"
          }
        }
      ];

      Plotly.newPlot("bubble", DataBubble, LayoutBubble);

      var yticks = ids_otu.slice(0,10).map(otu_id => `OTU ${otu_id}`).reverse();

      var Databar = [
        {
          x:sample_values.slice(0,10).reverse(),
          y: yticks,
          text: otu_labels.slice(0,10).reverse(),
          type: "bar",
          orientation:"h"
        }
      ];

      var Layoutbar = {
        title : "Top 10 found data",
        margin: {
          t:30,
          l:150
        }
      };

      Plotly.newPlot("bar", Databar, Layoutbar);

    });
}

function buildinfo(inputsample){
  var selectbox = d3.select ("#sample-metadata");
  d3.json("samples.json").then((data) => {
    var metadata= data.metadata;
    var result_meta =metadata.filter(sampleobj => sampleobj.id == inputsample);
    var result= result_meta[0]
    console.log(result);
    selectbox.html("");
    Object.entries(result).forEach(([key, value]) => {
      selectbox.append("h5")
      .text(`${key}: ${value}`); //chneged text
    });
  });
}

function initialise(){
  var selectbox = d3.select("#selDataset");
  d3.json("samples.json").then((data) => {
    var names = data.names;
    names.forEach((sample)=> {
      selectbox.append("option")
      .text(sample).property("value",sample);
      });
    var firstdata=names[0];
    createcharts(firstdata);
    buildinfo(firstdata);
  });
};


function optionChanged(new_selector){
  createcharts(new_selector);
  buildinfo(new_selector);

}
//id="sample-metadata"


initialise();