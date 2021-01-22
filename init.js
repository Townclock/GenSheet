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


function Init(){

  let model = {
    // array of sections
    // section of specific type are required to be similar
    wave: [],

    sections: [
      {id: 0, type:'A', blocks:[]},
      {id: 1, type:'A', blocks:[]},
      {id: 2, type:'B', blocks:[]},
      {id: 3, type:'A', blocks:[]}
    ],
  
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

            section.blocks.splice(index, 1)
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
    Fit: function(loc)
    {
      // get the section to create space in 
      let model = this;
      let originBlock = model.wave[loc]
      let originSectionBlocks = originBlock.section.blocks
      let ruleLength = originBlock.rules[0].followLength;

    console.log("Block killed itself???", model.wave.indexOf(originBlock), originBlock.section.id, originBlock.section.blocks.indexOf(originBlock),model)
      //get a block by removal priority , 
      //  valid to be removed
      //  weight not set to ALN
      //  sorted by sum of adjacent block weights
      function GetLooseBlock(blocks){
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
      } 
      let size;
      for ( size = 1; size < ruleLength; size++){
        let blocksToRemove = GetLooseBlock(originSectionBlocks).slice(0, 1)
        let neighbor = model.Normalize(model.wave.indexOf(blocksToRemove[0])+1);
        Propagate(model, neighbor);
        if (blocksToRemove < 1) break;
        this.RemoveBlocks(blocksToRemove);
      }

      if (size ===1)
          console.log("could not grow", originBlock.rules[0] )
      originBlock.length = size;
        
    console.log("Block killed itself???", model.wave.indexOf(originBlock))
    }

  }
  for (i=0; i < 128; i++){
    section = model.sections[Math.floor(i/32)];
    let block = new Block(
      chordRules.slice(0, chordRules.length), 
      startingTotalWeight,
      section);
    
    model.wave.push(block);
    section.blocks.push(block)  
  }
  return model;
}
