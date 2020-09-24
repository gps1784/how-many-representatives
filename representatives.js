// TODO: rename
function fetchStatesByYear(yearStr) {
  console.log(yearStr);
  return fetch("data." + yearStr + ".json")
    .then(resp => resp.json())
} // fetchStatesByYear()

function representatives_calculateMember(arr, member, calculation) {
  for(const element of arr) {
    element[member] = calculation(arr, element);
  }
  return arr;
} // representatives_calculateMember()

function representatives_prepareArray(arr) {
  arr = representatives_calculateMember(arr, 'pop_per_rep', function(a, el){ return el.pop / el.reps });
  total_pop  = arr.map(e => e.pop).reduce((sum, pop)   => sum + pop);
  total_reps = arr.map(e => e.reps).reduce((sum, reps) => sum + reps);
  avg = total_pop / total_reps;
  arr = representatives_calculateMember(arr, 'cpi', function(a, el){ return avg / el.pop_per_rep});
  return arr;
} // representatives_prepareArray()

function representatives_createStatesMap(targetDivId, yearStr, calcValue = (arr, el) => el.value, suffix = "", lowClamp = 0, highClamp = Infinity) {
  fetchStatesByYear(yearStr)
    .then(arr => am4charts_helper_arrToMap(targetDivId, arr, calcValue, suffix, lowClamp, highClamp));
}

function representatives_createStatesMap_pop(targetDivId, yearStr) {
  fetchStatesByYear(yearStr)
    .then(json => representatives_prepareArray(json))
    .then(json => am4charts_helper_arrToMap(targetDivId, json, (arr, el) => el.pop));
}

function representatives_createStatesMap_rep(targetDivId, yearStr) {
  fetchStatesByYear(yearStr)
    .then(json => representatives_prepareArray(json))
    .then(json => am4charts_helper_arrToMap(targetDivId, json, (arr, el) => el.reps));
}

function representatives_createStatesMap_perRep(targetDivId, yearStr) {
  fetchStatesByYear(yearStr)
    .then(json => representatives_prepareArray(json))
    .then(json => am4charts_helper_arrToMap(targetDivId, json, (arr, el) => Math.round(el.pop / el.reps)));
}

function representatives_createStatesMap_cpi(targetDivId, yearStr) {
  fetchStatesByYear(yearStr)
    .then(json => representatives_prepareArray(json))
    .then(json => am4charts_helper_arrToMap(targetDivId, json, function(arr, el) {
      return el.cpi;
    })
  );
}
