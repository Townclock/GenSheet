
function Observe(model)
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
      observedBlock.length = winner.followLength

// remove blocks as many bocks as possible to reach length
    let blocksToRemove = [];
    let size = 1;
    let iSize = 0;
      while (
        model.wave[(loc+size + model.wave.length)%model.wave.length].rules.indexOf(winner) >= 0 &&
        size < winner.followLength
      )
      {
        let next = ((loc+size+model.wave.length)%model.wave.length)
          blocksToRemove.push(model.wave[next])
        size++;
      }
      while (
        model.wave[(loc-1 - iSize + model.wave.length)%model.wave.length].rules.indexOf(i) >= 0 &&
        size + iSize< winner.followLength
      )
      {
        let prev = ((loc-1-iSize+model.wave.length)%model.wave.length)
          blocksToRemove.push(model.wave[prev])
          iSize++;
      }

    model.RemoveBlocks(blocksToRemove);
  console.log(winner)
    }
    else 
      pick -= model.wave[loc].rules[i].weight;
  }
  //Propagate(model, model.wave.indexOf(observedBlock));
}


function CheckComplete (model){
  let locations = model.wave;
  if (locations.slice(0, locations.length).sort(function(a,b){return a.weight-b.weight})[0].weight < ALN)
    return false
  return true
}

