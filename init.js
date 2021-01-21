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
    Fit: function(loc, observeFlag)
    {
      let originRule = this.wave[loc].rules[0] // should contain the one winning rule
      let blocksToRemove = [];
      let size = 1;
      let iSize = 0;
      while (
        this.wave[this.Normalize(loc+size)].weight < ALN
        && this.wave[this.Normalize(loc+size+1)].rules.filter(
          function(rule){
              return (originRule.follow === rule.lead && 
                      originRule.key+rule.mod === rule.key)
          }).length > 0
        && size < originRule.followLength 
      )
      {
        let next = this.Normalize(loc+size)
          blocksToRemove.push(model.wave[next])
        size++;
      }
      while (
        this.wave[this.Normalize(loc-1 - iSize)].weight < ALN
        && this.wave[this.Normalize(loc+size+1)].rules.filter(
          function(rule){
              return (rule.follow === originRule.lead && 
                      rule.key+originRule.mod === originRule.key)
          }).length > 0
        &&  size + iSize < originRule.followLength
      )
      {
        let prev = this.Normalize(loc-1-iSize)
          blocksToRemove.push(model.wave[prev])
          iSize++;
      }

      if (size ===1)
          console.log("could not grow", originRule )
    if (observeFlag){
      this.wave[loc].length = size+iSize;
      

       this.RemoveBlocks(blocksToRemove);
    }
        
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
