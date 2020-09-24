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
  arr = representatives_calculateMember(arr, 'cpi', function(a, el){ return (avg / el.pop_per_rep).toFixed(3) });
  return arr;
} // representatives_prepareArray()

function representatives_updateStatesMap(_target, _year, _value=(arr, el) => el.value, _suffixL="", _suffixS="") {
  fetchStatesByYear(_year)
    .then(json => representatives_prepareArray(json))
    .then(arr => representatives_calculateMember(arr, 'value', _value))
    .then(arr => am4charts_helper_map_edit(_target, arr, _suffixL, _suffixS));
}

function representatives_createStatesMap(_target, _year, _value=(arr, el) => el.value, _suffixL="", _suffixS="") {
  fetchStatesByYear(_year)
    .then(json => representatives_prepareArray(json))
    .then(arr => representatives_calculateMember(arr, 'value', _value))
    .then(arr => am4charts_helper_map_create(_target, arr, _suffixL, _suffixS));
}
