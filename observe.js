
function Observe(model, propFlag=true)
{

  let locations = model.wave;
  let loc = locations.slice(0, model.wave.length).indexOf(locations.slice(0, locations.length).sort(function(a,b){return a.weight-b.weight})[0]);
  let observedBlock = model.wave[loc];
  

  // generate a random value and select one of the possible chords
  let pick = Math.random()*model.wave[loc].weight;
  for (let i = 0; i < model.wave[loc].rules.length; i++){
    if (pick < model.wave[loc].rules[i].weight) {
      let winner = model.wave[loc].rules[i];
      observedBlock.rules = [winner];
      observedBlock.weight = ALN;
      
      if (observedBlock.length === "x"){
        observedBlock.length = winner.followLength
  // remove blocks as many bocks as possible to reach length
        console.log("call fit")
        model.Fit(loc)
      }

      break;
  
    }
    else 
      pick -= model.wave[loc].rules[i].weight;
  }

  if (propFlag)
    Propagate(model, model.wave.indexOf(observedBlock));
}


function CheckComplete (model){
  let locations = model.wave;
  if (locations.slice(0, locations.length).sort(function(a,b){return a.weight-b.weight})[0].weight < ALN)
    return false
  return true
}

