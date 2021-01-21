
//https://github.com/mxgmn/WaveFunctionCollapse/blob/master/Model.cs

//https://github.com/0xfe/vexflow

let ALN = 1000000  // arbitrarily large number
let keys = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"]

//leadLength?
let protoRules = [
  {lead:"I", follow:"I", mod: 4, weight: 0.5, followLength: 4},
  {lead:"I", follow:"ii", mod: 0, weight: 1, followLength: 4},
  {lead:"ii", follow:"V", mod: 0, weight: 1, followLength: 4},
  {lead:"V", follow:"I", mod: 0, weight: 0.5, followLength: 4},
  {lead:"V", follow:"ii", mod:-2 , weight: 0.5, followLength: 4},
  /*{lead:"I", follow:"I", mod: 4, weight: 0.5, followLength: 2},
  {lead:"I", follow:"ii", mod: 0, weight: 1, followLength: 2},
  {lead:"ii", follow:"V", mod: 0, weight: 1, followLength: 2},
  {lead:"V", follow:"I", mod: 0, weight: 0.5, followLength: 2},
  {lead:"V", follow:"ii", mod:-2 , weight: 0.5, followLength: 2}
*/
]
function CopyRule(rule){
  return {
    lead:rule.lead, 
    follow: rule.follow, 
    mod:rule.mod, 
    weight: rule.weight,
    followLength: rule.followLength
  };
}


let chordRules = [];

protoRules.forEach(function(rule){
  for (let i = 0; i < 12; i++){
    let keyedRule = CopyRule(rule);
    keyedRule.key = i;
    chordRules.push(keyedRule);
  }
});



let startingTotalWeight = 0;
for (i = 0; i < chordRules.length; i++)
  startingTotalWeight += chordRules[i].weight;



let key = Math.floor(Math.random()*12);
let startKey = keys[key]


let quit = 100;
let br = 500;
let model = Init()
console.log(CheckComplete(model))

//function Proceed(){ 
  while (!CheckComplete(model)){
//for (let i = 0; i < 100; i++){
Observe(model)
  console.log("done?")
  br--;
  if (br < 0){
    model = Init();
    console.log("break loop")
    br = 500;
    quit--;
  }
  if (quit < 0) {console.log("DISASTER");break};}
console.log(model.sections, model.wave)
//}


//console.log(model.wave)
Print(model)



