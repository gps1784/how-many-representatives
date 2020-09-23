// TODO: theme helper?

// only reinitialize if the projection style or geodata resolution is changing
function am4charts_helper_initMap(targetDivId, geodata, projection) {
  var map;
  am4core.ready(function() {
    map            = am4core.create(targetDivId, am4maps.MapChart);
    map.geodata    = geodata;
    map.projection = projection;
  });
  return map;
}

function am4charts_helper_pushMapSeries(chart, seriesType, arr, geo = true) {
  var series;
  am4core.ready(function() {
    series            = chart.series.push(seriesType);
    series.useGeodata = geo;
    series.data       = arr;
  });
  return series;
}

function am4charts_helper_createMapHeatLegend(chart) {
  var legend;
  am4core.ready(function() {
    legend = chart.createChild(am4maps.HeatLegend);
  });
  return legend;
}

function am4charts_helper_setMapHeatLegend(legend, series, values) {
  am4core.ready(function() {
    legend.series = series;
    legend.align  = "right";
    legend.valign = "bottom";
    legend.width  = am4core.percent(15);
    legend.marginRight = am4core.percent(4);
    legend.minValue = Math.min(...values);
    legend.maxValue = Math.max(...values);
  });
}

function am4charts_helper_createMapAxisLabels(legend) {
  am4core.ready(function() {
    let minR        = legend.valueAxis.axisRanges.create();
    minR.value      = legend.minValue;
    minR.label.text = legend.minValue.toLocaleString();
    let maxR        = legend.valueAxis.axisRanges.create();
    maxR.value      = legend.maxValue;
    maxR.label.text = legend.maxValue.toLocaleString();
    // Blank out internal heat legend value axis labels
    legend.valueAxis.renderer.labels.template.adapter.add("text", function(label) { return "" });
  });
}

function am4charts_helper_arrToMap(targetDivId, arr, calcValue = function(arr, el) {return el.value}, suffix = "", lowClamp = 0, highClamp = Infinity) {
  for(const el of arr) {
    el.value = calcValue(arr, el);
  }
  am4core.ready(function() {
    // Load themes
    am4core.useTheme(am4themes_dark);

    let ch = am4charts_helper_initMap(targetDivId, am4geodata_usaLow, new am4maps.projections.AlbersUsa());
    let se = am4charts_helper_pushMapSeries(ch, new am4maps.MapPolygonSeries(), arr);
    console.log(arr);
    let va = arr.map(el => el.value).sort(); // values array
    let cv = va.slice(lowClamp, highClamp); // clamped values

    // Set min/max fill color for each area
    se.heatRules.push({
      property: "fill",
      target: se.mapPolygons.template,
      min: am4core.color("#00cc55"),
      max: am4core.color("#0055cc"),
      //min: ch.colors.getIndex(1).brighten(1),
      //max: ch.colors.getIndex(1).brighten(-0.3),
      logarithmic: true
    });

    // Set up heat legend
    let le = am4charts_helper_createMapHeatLegend(ch);
    am4charts_helper_setMapHeatLegend(le, se, va);

    am4charts_helper_createMapAxisLabels(le);

    // Configure series tooltip
    var polyT = se.mapPolygons.template;
    polyT.tooltipText = "{name}: {value}" + suffix;
    polyT.nonScalingStroke = true;
    polyT.strokeWidth = 0.5;

    // Create hover state and set alternative fill color
    var hs = polyT.states.create("hover");
    hs.properties.fill = am4core.color("#3c5bdc");

  }); // end am4core.ready()
}
