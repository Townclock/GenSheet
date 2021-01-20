
function Propagate (model, loc){

  let previous = (loc - 1 + model.wave.length ) % model.wave.length
  let next = (loc + 1 + model.wave.length ) % model.wave.length


  // assume that there are no changes that need to be propagate
  let propagateNext = false;
  let propagatePrevious = false;

  // get all the rules for next
  let nextBlock = model.wave[next];
  let nextRules = nextBlock.rules;


  // get rules for origin
  let focusRules = model.wave[loc].rules;

  let rulesToRemove = [];

  // check all rules of next and remove them, propogate if changed
  nextRules.forEach(function(followingRule, index){
    // assume no rules are valid
    let valid = false
    focusRules.forEach(function(leadingRule){
      if (leadingRule.follow === followingRule.lead &&
                (leadingRule.key+leadingRule.mod+12)%12 === followingRule.key){
        valid = true;
      }
    })
    if (!valid)
      rulesToRemove.push(index);
  })
  // remove the rules
  let removalOffset = 0;
  rulesToRemove.forEach(function(rule){
    nextBlock.weight -= nextRules[rule-removalOffset].weight;
    nextRules.splice(rule-removalOffset, 1)
    removalOffset +=1;
  });
  if (rulesToRemove.length > 0)
        propagateNext = true;

  // get all the rules for previous
  let previousBlock = model.wave[previous]
  let previousRules = previousBlock.rules;

  rulesToRemove = [];
  // check all rules of next and remove them, propogate if changed
  previousRules.forEach(function(leadingRule, index){
    // assume no rules are valid
    let valid = false
    focusRules.forEach(function(followingRule){
      if (leadingRule.follow === followingRule.lead && 
                (leadingRule.key+leadingRule.mod +12)%12 === followingRule.key){
        valid = true;
      }
    })
    if (!valid)
      rulesToRemove.push(index);
  })
  // remove the rules
  removalOffset = 0;
  rulesToRemove.forEach(function(rule){
    previousBlock.weight -= previousRules[rule-removalOffset].weight;
    previousRules.splice(rule-removalOffset, 1)
    removalOffset +=1;
  });
  if (rulesToRemove.length > 0)
        propagatePrevious = true;


  if (propagateNext) Propagate(model, model.wave.indexOf(nextBlock));
  if (propagatePrevious) Propagate(model, model.wave.indexOf(previousBlock));

/*
  let sectionType = model.sections[section].type;
  let adjacentSections = model.wave.sections.filter(function(e){return e.type === sectionType});
  let offset = model.GetLocOffset;
  // create consistency across sections
  adjacentSections.forEach(function(section){
      let adjacent = section.start+offset;
      let rulesToRemove = [];
      model.wave[adjacent].forEach(rule){
        model.wave[loc].forEach(pRule)
        if ( rule.lead == pRule.lead &&
             rule.foloow == pRule.follow && 
             rule.length == pRule.length &&
             rule.mod == pRule.mode
        )
      }

      


      while (
        model.wave[(loc+size + model.wave.length)%model.wave.length].indexOf(i) >= 0 &&
        size < winner.length
      )
      {
        model.wave[loc+1+model.wave.length)%model.wave.length] = [winner]
        model.weights[loc+1+model.wave.length)%model.wave.length] = winner.weight
        size++;
      }
      while (
        model.wave[(loc-1 - iSize + model.wave.length)%model.wave.length].indexOf(i) >= 0 &&
        size + iSize< winner.length
      )
      {
        iSize++;
        model.wave[loc-1 - iSize+model.wave.length)%model.wave.length] = [winner]
        model.weights[loc-1 - iSize+model.wave.length)%model.wave.length] = winner.weight
      }
 
   


    if (weight !== model.wave[adjacent].weights[loc])
      Propagate(model, adjacent, loc)
  })*/

}
