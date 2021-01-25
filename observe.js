function Observe(model, propFlag=true)
{
  let locations = model.wave;
  let loc = locations.slice(0, model.wave.length).indexOf(locations.slice(0, locations.length).sort(function(a,b){return a.weight-b.weight})[0]);
  let observedBlock = model.wave[loc];
//        console.log(observedBlock.rules.length, observedBlock.section, model.wave)


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
  //        model.Fit(loc)
      }

      break;
  
    }
    else 
      pick -= model.wave[loc].rules[i].weight;
  }
  //early fail state catch
  if (observedBlock.rules.length === 0) return false;

  if (propFlag)
  {
    Propagate(model, model.wave.indexOf(observedBlock));
  }
/*
  //clear any rules that require more blocks available in their given section
  //unless those blocks have been observerd and have a length determined
  model.sections.forEach(function(section){
    let availableBlocks = model.GetLooseBlocks(section.blocks).length;
    section.blocks.forEach(function(block){
      let rulesToRemove = [];
      block.rules.forEach(function(rule){
        if (rule.followLength > availableBlocks && block.length === "x")
          rulesToRemove.push(rule);
      })
      rulesToRemove.forEach(function(rule){
        block.weight -= rule.weight;
        block.rules.splice(block.rules.indexOf(rule), 1)
      })
    })

  })*/
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

