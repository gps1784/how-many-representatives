function am4charts_helper_map__initialize(_target, _geo, _proj, _series=new am4maps.MapPolygonSeries(), _geobool=true) {
  let map;
  am4core.ready(function() {
    am4core.useTheme(am4themes_dark);

    map               = am4core.create(_target, am4maps.MapChart);
    map.geodata       = _geo;
    map.projection    = _proj;
  });
  return map;
} // am4charts_helper_map__initialize()

function am4charts_helper_map__addSeries(_map, _series=new am4maps.MapPolygonSeries(), _geobool=true) {
  let series;
  am4core.ready(function() {
    series            = _map.series.push(_series);
  });
  return series;
} // am4charts_helper_map__addSeries()

function am4charts_helper_map__setHeatRules(_series, _color1, _color2, _log) {
  _series.heatRules.push({
    property:    "fill",
    target:      _series.mapPolygons.template,
    min:         _color1,
    max:         _color2,
    logarithmic: true
  });
} // am4charts_helper_map__setHeatRules()

function am4charts_helper_map__loadSeriesData(_series, _data, _geobool=true) {
  _series.useGeodata = _geobool;
  _series.data       = _data;
} // am4charts_helper_map__loadSeriesData()

function am4charts_helper_map__setHeatLegend(_map, _series, _arr, _suffix="") {
  let values = _arr.map(el => el.value);
  let legend, minR, maxR;
  am4core.ready(function() {
    if( (legend = _map.heatLegend) === undefined ) {
      legend = _map.createChild(am4maps.HeatLegend);
    } else {
      legend.valueAxis.axisRanges.clear();
    }
    legend.series = _series;
    legend.align  = "right";
    legend.valign = "bottom";
    legend.width       = am4core.percent(15);
    legend.marginRight = am4core.percent(4);
    legend.minValue = Math.min(...values);
    legend.maxValue = Math.max(...values);
    minR            = legend.valueAxis.axisRanges.create();
    minR.value      = legend.minValue;
    minR.label.text = legend.minValue.toLocaleString() + _suffix;
    maxR            = legend.valueAxis.axisRanges.create();
    maxR.value      = legend.maxValue;
    maxR.label.text = legend.maxValue.toLocaleString() + _suffix;
    legend.valueAxis.renderer.labels.template.adapter.add("text", label => "");
  });
  _map.heatLegend = legend;
  return legend;
} // am4charts_helper_map__setHeatLegend()

function am4charts_helper_map__setTooltip(_series, _suffix="", _text="[bold]{name}:[/] {value}") {
  let tooltip, hover;
  am4core.ready(function() {
    tooltip                  = _series.mapPolygons.template;
    tooltip.tooltipText      = _text + _suffix;
    tooltip.nonScalingStroke = true;
    tooltip.strokeWidth      = 0.5;
    hover                    = tooltip.states.create("hover");
  });
  return tooltip;
} // am4charts_helper_map__setTooltip()

function am4charts_helper_map__loadData(_map, _series, _data, _suffixL="", _suffixS="") {
  console.log(_data);
  am4charts_helper_map__setHeatRules(_series, am4core.color("#00cc55"), am4core.color("#0055cc"));
  am4charts_helper_map__loadSeriesData(_series, _data);
  am4charts_helper_map__setHeatLegend(_map, _series, _data, _suffixS);
  am4charts_helper_map__setTooltip(_series, _suffixL);
} // am4charts_helper_map__loadData()

function am4charts_helper_map_create(_target, _data, _suffixL="", _suffixS="") {
  let map = am4charts_helper_map__initialize(_target, am4geodata_usaLow, new am4maps.projections.AlbersUsa());
  let series = am4charts_helper_map__addSeries(map);
  am4charts_helper_map__loadData(map, series, _data, _suffixL, _suffixS);
  return map;
} // am4charts_helper_map_create()

function am4charts_helper_map_edit(_target, _data, _suffixL="", _suffixS="") {
  let map = am4core.registry.baseSprites.find(map => map.htmlContainer.id === _target);
  am4charts_helper_map__loadData(map, map.series.values[0], _data, _suffixL, _suffixS);
} // am4charts_helper_map_edit()
//// END revamp

function am4charts_helper_scatter_createFromArray(target, arr, calcValue = function(arr, el) {return el.value}, suffix = "") {
  for(const el of arr) {
    el.value = calcValue(arr, el);
  }
  am4core.ready(function() {

    // Themes begin
    am4core.useTheme(am4themes_dark);
    // Themes end

    var chart = am4core.create(target, am4charts.XYChart);

    var valueAxisX = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxisX.renderer.ticks.template.disabled = true;
    valueAxisX.renderer.axisFills.template.disabled = true;

    var valueAxisY = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxisY.renderer.ticks.template.disabled = true;
    valueAxisY.renderer.axisFills.template.disabled = true;

    var series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueX = "x";
    series.dataFields.valueY = "y";
    series.dataFields.value = "value";
    series.strokeOpacity = 0;
    series.sequencedInterpolation = true;
    series.tooltip.pointerOrientation = "vertical";

    var bullet = series.bullets.push(new am4core.Circle());
    bullet.fill = am4core.color("#00cc55");
    bullet.propertyFields.fill = "color";
    bullet.strokeOpacity = 0;
    bullet.strokeWidth = 2;
    bullet.fillOpacity = 0.5;
    bullet.stroke = am4core.color("#ffffff");
    bullet.hiddenState.properties.opacity = 0;
    bullet.tooltipText = "[bold]{name}:[/]\nPopulation: {valueX.value}\nRepresentatives: {value.value}\nCPI: {valueY.value}";

    var outline = chart.plotContainer.createChild(am4core.Circle);
    outline.fillOpacity = 0;
    outline.strokeOpacity = 0.8;
    outline.stroke = am4core.color("#ff0000");
    outline.strokeWidth = 2;
    outline.hide(0);

    var blurFilter = new am4core.BlurFilter();
    outline.filters.push(blurFilter);

    bullet.events.on("over", function(event) {
      var target = event.target;
      outline.radius = target.pixelRadius + 2;
      outline.x = target.pixelX;
      outline.y = target.pixelY;
      outline.show();
    })

    bullet.events.on("out", function(event) {
      outline.hide();
    })

    var hoverState = bullet.states.create("hover");
    hoverState.properties.fillOpacity = 1;
    hoverState.properties.strokeOpacity = 1;

    series.heatRules.push({ target: bullet, min: 2, max: 60, property: "radius" });

    bullet.adapter.add("tooltipY", function (tooltipY, target) {
      return -target.radius;
    })

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = "zoomX";
    chart.cursor.snapToSeries = series;

    chart.scrollbarX = new am4core.Scrollbar();

    chart.data = arr;

  }); // end am4core.ready()
}
