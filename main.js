//https://github.com/mxgmn/WaveFunctionCollapse/blob/master/Model.cs

function Sum(total, num) {return total + num;}

let possibleChords = [
  {type: "I", weight:1},
  {type: "ii", weight:1},
  {type: "V", weight:1},
  ]
        // this array will contain all possible chords 
        // that can be picked, chord objects
let chordPossibilities = [];
for (i = 0; i < possibleChords.length; i++)
  chordPossibilities.push(true);
let startingTotalWeight = 0;
for (i = 0; i < possibleChords.length; i++)
  startingTotalWeight += possibleChords[i].weight;

let chordRules = [
  {lead:"I", follow:"I", mod: 4},
  {lead:"I", follow:"ii", mod: 0},
  {lead:"ii", follow:"V", mod: 0},
  {lead:"V", follow:"I", mod: 0},
  {lead:"V", follow:"ii", mod: -2}
]


let model = {
  // array of sections
  // section of specific type are required to be similar
  // each section will contain 32 points which may be "holds"
  wave: [
    {type:'A', content:[], weights:[]},
    {type:'A', content:[], weights:[]},
    {type:'B', content:[], weights:[]},
    {type:'A', content:[], weights:[]}
  ],
  propagator: [[[]]],
  compatible: [[[]]],
  observer: [],

  stack: [], //stack of tuples in ref code
  stackSize: 0,

  weights : [],
  weightLogWeights : [],

  sumOfOnes : [],
  sumOfWeights : 0,
  sumOfWeightsLogWeights: 0,
  startingEntropy:0,

  sumOfWeights : [],
  sumOfWeightsLogWeights: [],
  startingEntropy:[]
}

function Init(){
  model.wave.forEach(function(section){
    for (i=0; i < 32; i++){
      section.content.push(possibleChords.slice(0, chordPossibilities.length));
      section.weights.push(startingTotalWeight);
    }
    
  })
  console.log(model.wave)
}


function Observe()
{
  let locations = [];
  model.wave.forEach(function(section){
    locations = locations.concat(section.weights)
  })
  let loc = locations.slice(0, 128).indexOf(locations.sort(function(a,b){return a-b})[0]);
  let section = Math.floor(loc / 32);
  let locInSection = loc % 32;
  console.log(locations)
  console.log(section)

  // generate a random value and select one of the possible chords
  let pick = Math.random()*model.wave[section].weights[locInSection];
  for (let i = 0; i < model.wave[section].content[locInSection].length; i++){
    if (pick < model.wave[section].content[locInSection][i].weight) {
      let winner = model.wave[section].content[locInSection][i];
      model.wave[section].content[locInSection] = [winner];
      console.log(winner);
      model.wave[section].weights[locInSection] = 1000000;
    }
    else 
      pick -= model.wave[section].content[locInSection][i].weight;
  }

}




















function drawRect(x, y){
  var c = document.getElementById("space");
  var ctx = c.getContext("2d");
  ctx.beginPath();
  ctx.rect(x*100, 7*100, 100, 100);
  ctx.fill();
}
