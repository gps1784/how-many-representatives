function generateMapByYear(divId, yearString, valFunct) {
  fetch("data." + yearString + ".json")
    .then(resp => resp.json())
    .then(json => generateMapWithJson(divId, json, valFunct));
} // generateMapByYear()

function generateMapWithJson(divId, json, valFunct) {
  for(const el of json) {
    el.value = valFunct(el);
  }
  console.log(json);
  am4core.ready(function() {
    // Load themes
    am4core.useTheme(am4themes_dark);

    // Create map instance
    var ch = am4core.create(divId, am4maps.MapChart);
    // Set map definition
    ch.geodata = am4geodata_usaLow;
    // Set projection
    ch.projection = new am4maps.projections.AlbersUsa();

    // Create map polygon series
    var polyS = ch.series.push(new am4maps.MapPolygonSeries());
    //polyS.include = ["US", "GU", "MP", "PR", "AS", "VI"];
    // Make map load polygon data (state shapes and names) from GeoJSON
    polyS.useGeodata = true;
    // Set heatmap values for each state
    polyS.data = json;
    // Set min/max fill color for each area
    polyS.heatRules.push({
      property: "fill",
      target: polyS.mapPolygons.template,
      //min: am4core.color("#00cc55"),
      //max: am4core.color("#cc0055"),
      min: ch.colors.getIndex(1).brighten(1),
      max: ch.colors.getIndex(1).brighten(-0.3),
      logarithmic: true
    });

    // Set up heat legend
    let values = json.map(el => el.value);
    let heatL = ch.createChild(am4maps.HeatLegend);
    heatL.series = polyS;
    heatL.align = "right";
    heatL.valign = "bottom";
    heatL.width = am4core.percent(15);
    heatL.marginRight = am4core.percent(4);
    heatL.minValue = Math.min(...values);
    heatL.maxValue = Math.max(...values);

    // Set up custom heat map legend labels using axis ranges
    var minR = heatL.valueAxis.axisRanges.create();
    minR.value = heatL.minValue;
    minR.label.text = heatL.minValue.toLocaleString();
    var maxR = heatL.valueAxis.axisRanges.create();
    maxR.value = heatL.maxValue;
    maxR.label.text = heatL.maxValue.toLocaleString();
    // Blank out internal heat legend value axis labels
    heatL.valueAxis.renderer.labels.template.adapter.add("text", function(labelText) {
      return "";
    });


    // Configure series tooltip
    var polyT = polyS.mapPolygons.template;
    polyT.tooltipText = "{name}: {value}";
    polyT.nonScalingStroke = true;
    polyT.strokeWidth = 0.5;

    // Create hover state and set alternative fill color
    var hs = polyT.states.create("hover");
    hs.properties.fill = am4core.color("#3c5bdc");

  }); // end am4core.ready()
}
