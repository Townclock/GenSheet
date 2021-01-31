function Block(rules, weight, section) {
  let block = {
    rules: rules,
    weight: weight,
    length: 'x',
    section: section,
    hold: false
  }

  return block
}
function Section(id, type, length){
  let section = {
    id:id,
    type:type,
    blocks: [],
    openBlocks: []
  }

  for (i=0; i < length; i++){
    let block = new Block(
      chordRules.slice(0, chordRules.length), 
      startingTotalWeight,
      section);
    section.blocks.push(block) 
    section.openBlocks.push(block) 
  }
  return section;
}


let form = [
  {type:'A', length:32},
  {type:'A', length:32},
  {type:'B', length:32},
  {type:'A', length:32},

]

function Init(sections=form){
  console.log(sections)
  let model = {
    // array of sections
    // section of specific type are required to be similar
    wave: [],
    openBlocks: [],
    sections: [],
  
    GetLocOffset: function (loc) {
      let section = this.sections[this.GetSection(loc)];
      return loc - section.start
    },
    RemoveBlocks: function(blocks){
      let model = this;
      blocks.forEach(function(b){
        let index = b.section.blocks.indexOf(b)
        model.sections.forEach(function(section){
          if (b.section.type == section.type)
          {
            let adjacentBlockToRemove = section.blocks[index];
            model.wave.splice(model.wave.indexOf(adjacentBlockToRemove), 1)
            model.openBlocks.splice(model.openBlocks.indexOf(adjacentBlockToRemove),1);

            section.blocks.splice(index, 1)
            section.openBlocks.splice(section.openBlocks.indexOf(adjacentBlockToRemove), 1)
          }

        })
      })
    },
    //normalizes transform across the tail ends of wave
    Normalize: function(exp) {
      return (exp + this.wave.length) % this.wave.length
    },
    BlocksCanBeAdjacent: function(lead, follow){
      let canBeAdjacent = false
      follow.rules.forEach(function(followingRule, index){
        lead.rules.forEach(function(leadingRule){
        if (leadingRule.follow === followingRule.lead 
          && ((leadingRule.key+followingRule.mod+12)%12 === followingRule.key)
          )
          {
            canBeAdjacent = true;
          }
        })
      })
      return canBeAdjacent;
    },
      //get a block by removal priority , 
      //  valid to be removed
      //  weight not set to ALN
      //  sorted by sum of adjacent block weights
    GetLooseBlocks:function(blocks){
        let removableBlocks = blocks.slice(0, blocks.length)
        .filter(function(block){
          let loc = model.wave.indexOf(block);
          let canBeAdjacent = model.BlocksCanBeAdjacent(model.wave[model.Normalize(loc-1)], model.wave[model.Normalize(loc+1)])
          return (block.weight < ALN/2 && canBeAdjacent)
          // there is no reason why dividing ALN by two should work unless I was subtracting weight when I should not ahve
        })
        .sort(function(a, b){
          return b.weight - a.weight;
        })
        
        // test print here and find out why this array is empty
      return removableBlocks;
      } ,
    Fit: function(loc)
    {
      // assume that each chord has 2 beats
      // remove a chord block if it has 3 or 4 beats
      let model = this;
      let originBlock = model.wave[loc]
      let originSectionBlocks = originBlock.section.openBlocks
      let ruleLength = originBlock.rules[0].followLength;

      let size = 1;

      while (ruleLength > size){
        let blockToRemove = model.GetLooseBlocks(originSectionBlocks).slice(0, 1)
        if (blockToRemove < 1){
          console.log("could not grow", originBlock.rules[0] )
          break;
        }
        else {
          this.RemoveBlocks(blockToRemove)
          size += 1;
          console.log ("block removed")
          //propagate to clear gap
          let neighbor = model.Normalize(model.wave.indexOf(blockToRemove[0])-1);
          Propagate(model, neighbor);
        }
      }
         originBlock.length = size; 
        
    }

  }
  //generate sections
  sections.forEach(function(section, index) {
    let newSection = new Section(index, section.type, section.length)
    model.sections.push(newSection);
    newSection.blocks.forEach(function(block){
      model.wave.push(block);
      model.openBlocks.push(block);
    })
  })
  model.openBlocks = model.wave.slice(0, model.wave.length);
  return model;
}
