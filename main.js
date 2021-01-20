
//https://github.com/mxgmn/WaveFunctionCollapse/blob/master/Model.cs

//https://github.com/0xfe/vexflow

let ALN = 1000000  // arbitrarily large number
let keys = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"]


let protoRules = [
  {lead:"I", follow:"I", mod: 4, weight: 0.5, length: 2},
  {lead:"I", follow:"ii", mod: 0, weight: 1, length: 4},
  {lead:"ii", follow:"V", mod: 0, weight: 1, length: 2},
  {lead:"V", follow:"I", mod: 0, weight: 0.5, length: 2},
  {lead:"V", follow:"I", mod: 0, weight: 0.5, length: 2},
  {lead:"V", follow:"ii", mod: -2, weight: 0.5, length: 1},
  {lead:"V", follow:"ii", mod: -2, weight: 0.5, length: 1}

]
function CopyRule(rule){
  return {
    lead:rule.lead, 
    follow: rule.follow, 
    mod:rule.mod, 
    weight: rule.weight,
    length: rule.length
  };
}


let chordRules = [];

protoRules.forEach(function(rule){
  for (let i = 0; i < 12; i++){
    let keyedRule = CopyRule(rule);
    rule.key = i;
    chordRules.push(rule);
  }
});



let startingTotalWeight = 0;
for (i = 0; i < chordRules.length; i++)
  startingTotalWeight += chordRules[i].weight;



let key = Math.floor(Math.random()*12);
let startKey = keys[key]



let br = 500;
let model = Init()
while (!CheckComplete(model)){
  Observe(model)
  console.log("done?")
  br--;
  if (br < 0){
    model = Init();
    console.log("break loop")
    br = 500;
  }
};
console.log("DONE")
Print()



