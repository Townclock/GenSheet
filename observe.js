function Observe(model, propFlag=true)
{
  

  let loc = model.wave.indexOf(
    model.openBlocks.sort(function(a,b){return a.weight-b.weight})[0]);
  
  if (loc === -1){ // this should never happen, but we can at least catch it
    console.log(model)
    return false;
  }
  
  let observedBlock = model.wave[loc];
//        console.log(observedBlock.rules.length, observedBlock.section, model.wave)

  // generate a random value and select one of the possible chords
  let pick = Math.random()*observedBlock.weight;
  for (let i = 0; i < model.wave[loc].rules.length; i++){
    if (pick < model.wave[loc].rules[i].weight) {
      let winner = model.wave[loc].rules[i];
      observedBlock.rules = [winner];
      observedBlock.weight = ALN;
      
      if (observedBlock.length === "x"){
        observedBlock.length = winner.followLength
  // remove blocks as many bocks as possible to reach length
          model.Fit(loc)
      }

      break;
  
    }
    else 
      pick -= model.wave[loc].rules[i].weight;
  }
  //early fail state catch
  if (observedBlock.rules.length === 0) return false;

//  console.log(observedBlock)
  if (propFlag)
  {
    Propagate(model, model.wave.indexOf(observedBlock));
  }
  model.openBlocks.splice(model.openBlocks.indexOf(observedBlock),1);
  observedBlock.section.openBlocks.splice(observedBlock.section.openBlocks.indexOf(observedBlock),1);
  return true;
}


function CheckComplete (model){
  let locations = model.wave;
  if (locations.slice(0, locations.length).sort(function(a,b){return a.weight-b.weight})[0].weight < ALN)
    return false
  return true
}

function DetectErrorState(model){
  model.wave.forEach(function(block){
    if (block.rules.length<1)
      return true;
    else false;
  })
}

