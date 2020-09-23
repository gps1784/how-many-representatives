// TODO: rename
function fetchStatesByYear(yearStr) {
  return fetch("data." + yearStr + ".json")
    .then(resp => resp.json())
} // fetchStatesByYear()

function representatives_createStatesMap(targetDivId, yearStr, calcValue = (arr, el) => el.value, suffix = "", lowClamp = 0, highClamp = Infinity) {
  fetchStatesByYear(yearStr)
    .then(arr => am4charts_helper_arrToMap(targetDivId, arr, calcValue, suffix, lowClamp, highClamp));
}

function representatives_createStatesMap_pop(targetDivId, yearStr) {
  fetchStatesByYear(yearStr).then(json => am4charts_helper_arrToMap(targetDivId, json, (arr, el) => el.population));
}

function representatives_createStatesMap_rep(targetDivId, yearStr) {
  fetchStatesByYear(yearStr).then(json => am4charts_helper_arrToMap(targetDivId, json, (arr, el) => el.representatives));
}

function representatives_createStatesMap_perRep(targetDivId, yearStr) {
  fetchStatesByYear(yearStr).then(json => am4charts_helper_arrToMap(targetDivId, json, (arr, el) => Math.round(el.population / el.representatives)));
}

function representatives_createStatesMap_cpi(targetDivId, yearStr) {
  fetchStatesByYear(yearStr).then(json => am4charts_helper_arrToMap(targetDivId, json, function(arr, el) {
    let average = arr.map(e => e.population).reduce((sum, pop) => sum + pop) /
                  arr.map(e => e.representatives).reduce((sum, rep) => sum + rep);
    return (average / (el.population / el.representatives));
  }));
}
