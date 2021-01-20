
function Observe(model)
{
  let locations = [];
  model.wave.forEach(function(section){
    locations = locations.concat(section.weights)
  })
  let loc = locations.slice(0, 128).indexOf(locations.sort(function(a,b){return a-b})[0]);
  let section = Math.floor(loc / 32);
  let locInSection = loc % 32;

  let changedBeats = [];

  // generate a random value and select one of the possible chords
  let pick = Math.random()*model.wave[section].weights[locInSection];
  for (let i = 0; i < model.wave[section].content[locInSection].length; i++){
    if (pick < model.wave[section].content[locInSection][i].weight) {
      let winner = model.wave[section].content[locInSection][i];
      model.wave[section].content[locInSection] = [winner];
      model.wave[section].weights[locInSection] = ALN;

      //drop the winning rule in every position for its length if possible
      //growing forward or backwards
      let growingRule = winner; 
      let size = 1;
      
      // DROP CHORDS AS LONG AS ITS LEGAL


    }
    else 
      pick -= model.wave[section].content[locInSection][i].weight;
  }


  Propagate(model, section, locInSection);
}


function CheckComplete (model){
  let locations = [];
  model.wave.forEach(function(section){
    locations = locations.concat(section.weights)
  })
  if (locations.sort(function(a,b){return a-b})[0] < ALN)
    return false
  return true
}

