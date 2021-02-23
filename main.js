
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

let model = new Model();

let progress;

function RunUntilComplete(song){
  let backup = song.Copy();
  let model = song;
  let quit = 0;
  while (!CheckComplete(model)){
    if ( Observe(model) == false){
      console.log("Re-initialized. . .", quit, " times \n Copy Made: " , backup)
      model = backup.Copy();
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
  return model;
}

function ProceedSimple(){
  model.Init([{type: 'A', length: 32}]);
  console.log("proceed simple")
  model = RunUntilComplete(model);
  model.DuplicateSection(0);
  model.AddSections([{type: 'B', length: 32}], true);
  model.DuplicateSection(0);
  console.log(model)
  model = RunUntilComplete(model);
}

function ProceedSimpleSparse(){
  let quit=20;
  
  while (quit > 0)
  {
    model.Init([{type: 'A', length: 32}]);
    console.log("proceed simple")
    model = RunUntilComplete(model);
    model.DuplicateSection(0);
    model.AddSections([{type: 'B', length: 32}], true);
    model.DuplicateSection(0);
    console.log(model)
    model = RunUntilComplete(model);
    if (model.wave.length < 48)
      break;
    quit--;
  }
  if (quit < 0) alert("after 20 attempts did not generate a sparse song")
}

function Proceed(){ 
  progress = document.getElementById("progress");
  model.Init()
  model = RunUntilComplete(model)
}





