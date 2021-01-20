
function Init(){

  let model = {
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
  return model;
}
