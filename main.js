
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
      //console.log("Re-initialized. . .", quit, " times \n Copy Made: " , backup)
      model = backup.Copy();
      quit++;
    }

    if (quit >1000) { 
      console.log("DISASTER");break
    };
  }
  if (quit <= 1000)
  {  
    Print(model)
  }
  return model;
}

function ProceedSimple(){
  model.Init([{type: 'A', measures: 8}]);
  console.log("proceed simple")
  model = RunUntilComplete(model);
  model.DuplicateSection(0);
  model.AddSections([{type: 'B', measures: 8}], true);
  model.DuplicateSection(0);
  //console.log(model)
  model = RunUntilComplete(model);
}

function ProceedSimpleSparse(){
  let quit=20;
  
  while (quit > 0)
  {
    model.Init([{type: 'A', measures: 8}]);
    console.log("proceed simple")
    model = RunUntilComplete(model);
    model.DuplicateSection(0);
    model.AddSections([{type: 'B', measures: 8}], true);
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

let probWeights = [0,0,0,0,0];
	chordRules.forEach(function(rule){
		probWeights[rule.followLength] += rule.weight;
	})
	
function GenLengthOutline (measures){
	let blocks = [];

	for (let i = 0; i < measures; i++){
		let measureLeft = 4;
		
		while (measureLeft > 0){
			let pick =Math.floor(Math.random()*startingTotalWeight)
			for (let l = 4; l > 0; l--){
					//console.log(pick, probWeights[l], l, l <= measureLeft)
				if (pick < probWeights[l] && l <= measureLeft && !(l ==1 && measureLeft == 4)){
					measureLeft -= l;
					blocks.push(l);
				}
				else
					pick -= probWeights[l];
				
			}
		}
	}
	return blocks;
}



