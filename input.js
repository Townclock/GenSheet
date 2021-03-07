let protoRules; 
let rhythms;

function loadRulesFile() {
  var result = null;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", "./rules.csv", false);
  xmlhttp.send();
  if (xmlhttp.status==200) {
    result = xmlhttp.responseText;
  }
  protoRules = ProcessRules(result);
  return result;
}
function loadRhythmsFile() {
  var result = null;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", "./rhythms.csv", false);
  xmlhttp.send();
  if (xmlhttp.status==200) {
    result = xmlhttp.responseText;
  }
  rhythms = ProcessRhythms(result);
  return result;
}
function ProcessRules (data){
  let rules = data.split("\n")
  let output = []
  rules.forEach(function(input) {
    let line = input.split(",")
    if (line[0] !== "" && line[0] !== "Leading Chord"){
      let r = {
        lead: line[0],
        leadingLength: Number(line[1]),
        follow: line [2],
        followLength: Number(line[3]),
        mod: Number(line[4]),
        weight: Number(line[5])
      }
      output.push(r);
    }
  })
  return output;
}

function ProcessRhythms (data){
  let rules = data.split("\n")
  let output = [[],[],[],[],[]]
  rules.forEach(function(input) {
    let line = input.split(",")
    if (line[0] !== "" && line[0] !== "Song ID"){
      let r = {
        length: Number(line[1]),
        rhythm: line[2],
        lead: line [3] === "TRUE",
        follow: line[4] === "TRUE",
      }
      output[r.length].push(r);
    }
  })
  return output;
}

function CompressRules (ruleList){
//  console.log(ruleList)
  for (let x = ruleList.length-1; x > -1 ; x--){
    for (let i = x-1; i > -1; i--){
      if (SameRule(ruleList[i], ruleList[x])){
        ruleList[i].weight += ruleList[x].weight;
        ruleList.splice(i, 1);
        break;
      }
    }
  }
}

function SameRule(a, b){
  return (
    a.lead === b.lead && 
    a.follow === b.follow && 
    a.leadingLength === b.leadingLength && 
    a.followingLength === b.followingLength &&
    a.mod === b.mod
  )
}

function CompressRhythms (rhythms){
  rhythms.forEach(function(group){
  for (let x = group.length-1; x > -1 ; x--){
    for (let i = x-1; i > -1; i--){
      if (SameRhythm(group[i], group[x])){
        group.splice(i, 1);
        break;
      }
    }
  }
  })
}

function SameRhythm(a, b){
  return (
    a.length === b.length && 
    a.rhythm === b.rhythm && 
    a.lead === b.lead && 
    a.follow === b.follow
  )
}

loadRulesFile()
loadRhythmsFile()
CompressRules(protoRules)
CompressRhythms(rhythms)
console.log(rhythms)
