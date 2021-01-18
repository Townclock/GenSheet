
//https://github.com/mxgmn/WaveFunctionCollapse/blob/master/Model.cs

//https://github.com/0xfe/vexflow

let ALN = 1000000  // arbitrarily large number


let chordRules = [
  {lead:"I", follow:"I", mod: 4, weight: 1},
  {lead:"I", follow:"ii", mod: 0, weight: 1},
  {lead:"ii", follow:"V", mod: 0, weight: 1},
  {lead:"V", follow:"I", mod: 0, weight: 1},
  {lead:"V", follow:"ii", mod: -2, weight: 1}
]

let startingTotalWeight = 0;
for (i = 0; i < chordRules.length; i++)
  startingTotalWeight += chordRules[i].weight;



let model;

function Init(){

  model= {
    // array of sections
    // section of specific type are required to be similar
    wave: [
      {type:'A', content:[], weights:[]},
      {type:'A', content:[], weights:[]},
      {type:'B', content:[], weights:[]},
      {type:'A', content:[], weights:[]}
    ]
  }
  
  model.wave.forEach(function(section){
    for (i=0; i < 32; i++){
      section.content.push(chordRules.slice(0, chordRules.length));
      section.weights.push(startingTotalWeight);
    }
    
  })
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

  // generate a random value and select one of the possible chords
  let pick = Math.random()*model.wave[section].weights[locInSection];
  for (let i = 0; i < model.wave[section].content[locInSection].length; i++){
    if (pick < model.wave[section].content[locInSection][i].weight) {
      let winner = model.wave[section].content[locInSection][i];
      model.wave[section].content[locInSection] = [winner];
      model.wave[section].weights[locInSection] = ALN;
    }
    else 
      pick -= model.wave[section].content[locInSection][i].weight;
  }
  Propagate(section, locInSection);
}

function CheckComplete (){
  let locations = [];
  model.wave.forEach(function(section){
    locations = locations.concat(section.weights)
  })
  if (locations.sort(function(a,b){return a-b})[0] < ALN)
    return false
  return true
  
}

function Propagate (section, loc){
  let previous, next, adjactents;
  if (loc === 0){
    if (section === 0)
      previous = [3, 31]
    else
      previous = [section-1, 31]
  }
  else
    previous = [section, loc-1]

  if (loc === 31){
    if (section === 3)
      next = [0, 0]
    else
      next = [section+1, 0]
  }
  else next = [section, loc+1]

  let sectionType = model.wave[section].type;
  adjacents = model.wave.filter(function(e){return e.type === sectionType});


  // assume that there are no changes that need to be propagate
  let propagateNext = false;
  let propagatePrevious = false;

  // get all the rules for next
  let nextRules = model.wave[next[0]].content[next[1]];
  // get rules for origin
  let focusRules = model.wave[section].content[loc]

  let rulesToRemove = [];
  // check all rules of next and remove them, propogate if changed
  nextRules.forEach(function(followingRule, index){
    // assume no rules are valid
    let valid = false
    focusRules.forEach(function(leadingRule){
      if (leadingRule.follow == followingRule.lead){
        valid = true;
      }
    })
    if (!valid)
      rulesToRemove.push(index);
  })
  // remove the rules
  let removalOffset = 0;
  rulesToRemove.forEach(function(rule){
    model.wave[next[0]].weights[next[1]] -= nextRules[rule-removalOffset].weight;
    nextRules.splice(rule-removalOffset, 1)
    removalOffset +=1;
  });
  if (rulesToRemove.length > 0)
        propagateNext = true;

  // get all the rules for previous
  let previousRules = model.wave[previous[0]].content[previous[1]];

  rulesToRemove = [];
  // check all rules of next and remove them, propogate if changed
  previousRules.forEach(function(leadingRule, index){
    // assume no rules are valid
    let valid = false
    focusRules.forEach(function(followingRule){
      if (leadingRule.follow == followingRule.lead){
        valid = true;
      }
    })
    if (!valid)
      rulesToRemove.push(index);
  })
  // remove the rules
  removalOffset = 0;
  rulesToRemove.forEach(function(rule){
    model.wave[previous[0]].weights[previous[1]] -= previousRules[rule-removalOffset].weight;
    previousRules.splice(rule-removalOffset, 1)
    removalOffset +=1;
  });
  if (rulesToRemove.length > 0)
        propagatePrevious = true;


  if (propagateNext) Propagate(next[0], next[1]);
  if (propagatePrevious) Propagate(previous[0], previous[1]);


  // create consistency across sections
  adjacents.forEach(function(adjacent){
    adjacent = model.wave.indexOf(adjacent)
    let weight = model.wave[adjacent].weights[loc] 
    model.wave[adjacent].weights[loc] = model.wave[section].weights[loc]
    model.wave[adjacent].content[loc] = model.wave[section].content[loc]
    
    if (weight !== model.wave[adjacent].weights[loc])
      Propagate(adjacent, loc)
  })

}

let key = Math.floor(Math.random()*12);
let keys = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"]
let startKey = keys[key]
function Print(){
  let output = []
  for (let i = 0; i<8; i++) output[i]=[];
  model.wave.forEach(function(section, sectionCount){
    section.content.forEach(function(content, count) {
      let bar = Math.floor(count/16 + sectionCount*2)

      key += content[0].mod +12;
      key %= 12;

      let chord = content[0].follow;
      console.log(key, chord)
      switch(chord)
      {
        case ("I"):
          output[bar].push(keys[(key)%12] + "+7");
          break;
        case ("ii"):
          output[bar].push(keys[(key+2)%12] + "-7");
          break
        case ("V"):
          output[bar].push(keys[(key+7)%12] + "7");
          break; 
      
      }
    
    })
  })

  let vexTabOutput =  "tabstave notation=true tablature=false key=" + startKey +" time=4/4 \n";
  
  output.forEach(function(bar, index){
    console.log(bar)
    if (index !== 0)
      vexTabOutput += "tabstave notation=true tablature=false\n";
    vexTabOutput += "notes :h  | | | | | \n text :q ";
    bar.forEach(function(chord, pos){ 
      console.log(chord)
      vexTabOutput += chord;
      vexTabOutput += (pos !== bar.length-1) ? ", " : "\n";
    });
  })



  document.getElementById("vextab").innerHTML = 
    "options space=20\n" + vexTabOutput + "options space=25"
}



let br = 500;
Init()
while (!CheckComplete()){
  Observe()
  console.log("done?")
  br--;
  if (br < 0){
    Init();
    console.log("break loop")
    br = 500;
  }
};
console.log("DONE")
Print()



