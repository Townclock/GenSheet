
function Propagate (model, loc){

  let propagateStack = [];
  let rightNeighbor = model.Normalize(loc+1)
  let leftNeighbor = model.Normalize(loc-1)

  let originBlock = model.wave[loc];
  let rightBlock = model.wave[rightNeighbor]
// get all the rules for next
  let focusRules = originBlock.rules;
  let nextRules = rightBlock.rules;
  let rulesToRemove = [];
  // check all rules of next and remove them, propogate if changed
  nextRules.forEach(function(followingRule, index){

      // assume no rules are valid
      let valid = false
      focusRules.forEach(function(leadingRule){
        if (leadingRule.follow === followingRule.lead 
          && ((leadingRule.key+followingRule.mod+12)%12 === followingRule.key)
        ){
          valid = true;
        }
      })
      if (!valid)
      {
        rulesToRemove.push(index);
      }
    })
  // remove the rules
  let removalOffset = 0;
  rulesToRemove.forEach(function(rule){
    rightBlock.weight -= nextRules[rule-removalOffset].weight;
    nextRules.splice(rule-removalOffset, 1)
    removalOffset +=1;
  });
  //if (rulesToRemove.length > 0)
  //      propagateStack.push(rightNeighbor);


  let leftBlock = model.wave[leftNeighbor]

  // get all the rules for previous
  let previousRules = leftBlock.rules;

    rulesToRemove = [];
    // check all rules of next and remove them, propogate if changed
    previousRules.forEach(function(leadingRule, index){
        // assume no rules are valid
        let valid = false
        focusRules.forEach(function(followingRule){
          if (leadingRule.follow === followingRule.lead  
            && ((leadingRule.key+followingRule.mod +12)%12 === followingRule.key)
          ){
            valid = true;
          }
        })
        if (!valid)
        { 
          rulesToRemove.push(index);
        }
    })
    // remove the rules
    removalOffset = 0;
    rulesToRemove.forEach(function(rule){
      leftBlock.weight -= previousRules[rule-removalOffset].weight;
      previousRules.splice(rule-removalOffset, 1)
      removalOffset +=1;
    });
    
  
  //if (rulesToRemove.length > 0)
  //        propagateStack.push(leftNeighbor);

  
  
  let sectionType = originBlock.section.type;
  let adjacentSections = model.sections.filter(function(e){return e.type === sectionType && e !== originBlock.section});
  let posInSection = originBlock.section.blocks.indexOf(originBlock);
  // create consistency across sections
  adjacentSections.forEach(function(section){
      let adjacentBlock = section.blocks[posInSection];
      
      let rulesToRemove = [];
      adjacentBlock.length = originBlock.length;


      adjacentBlock.rules.forEach(function (rule){
      let valid = false;
        originBlock.rules.forEach(function(originRule){
          if ( rule.lead === originRule.lead &&
               rule.follow === originRule.follow && 
               rule.followLength === originRule.followLength &&
               rule.mod === originRule.mod
          ){
            valid = true;
          }
         })
         if (!valid)  {
            rulesToRemove.push(rule);
          }
  })
        
    // remove the rules
    rulesToRemove.forEach(function(rule){
      adjacentBlock.weight -= rule.weight;
      adjacentBlock.rules.splice(adjacentBlock.rules.indexOf(rule), 1)
    });

    if (rulesToRemove.length > 0)
          propagateStack.push(model.wave.indexOf(adjacentBlock));

  })
    

   propagateStack.forEach(function(loc){
     Propagate(model, loc)
  })

    
    //ITERATE THROUGH THE PROPAGATE STACK
}
