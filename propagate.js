
function Propagate (model, section, loc){
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
      if (leadingRule.follow == followingRule.lead &&
          leadingRule.key == followingRule.key){
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
      if (leadingRule.follow == followingRule.lead && 
          leadingRule.key == followingRule.key){
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


  if (propagateNext) Propagate(model, next[0], next[1]);
  if (propagatePrevious) Propagate(model, previous[0], previous[1]);


  // create consistency across sections
  adjacents.forEach(function(adjacent){
    adjacent = model.wave.indexOf(adjacent)
    let weight = model.wave[adjacent].weights[loc] 
    model.wave[adjacent].weights[loc] = model.wave[section].weights[loc]
    model.wave[adjacent].content[loc] = model.wave[section].content[loc]
    
    if (weight !== model.wave[adjacent].weights[loc])
      Propagate(model, adjacent, loc)
  })

}
