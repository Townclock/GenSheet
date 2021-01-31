
//https://github.com/mxgmn/WaveFunctionCollapse/blob/master/Model.cs

//https://github.com/0xfe/vexflow

let ALN = 1000000  // arbitrarily large number
let keys = ["C", "Db", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"]

function CopyRule(rule){
  return {
    lead:rule.lead, 
    follow: rule.follow, 
    mod:rule.mod, 
    weight: rule.weight,
    leadingLength: rule.leadingLength,
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

let model;

let progress;

function RunUntilComplete(){
  let quit = 0;
  let br = 500;
  while (!CheckComplete(model)){
    br--;
    if (br < 0 || DetectErrorState(model) || Observe(model) == false){
      console.log("Re-initialized. . .", quit, " times")
      model = Init();
      br = 500;
      quit++;
    }

    if (quit >500) {
      progress.innerHTML = "Failure, Retry?";    
      console.log("DISASTER");break
    };
  }
  if (quit <= 500)
  {  
    Print(model)
  }
}

function ProceedSimple(){
  console.log("proceed simple")
  model = Init([{type: "A", length: 32}]);
  RunUntilComplete();
}

function Proceed(){ 
  progress = document.getElementById("progress");
  model = Init()
  RunUntilComplete()
}





