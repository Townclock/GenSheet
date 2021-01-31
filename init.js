function Block(rules, weight, section) {
  let block = {
    rules: rules,
    weight: weight,
    length: 'x',
    section: section,
    Copy: function(){
      let b = new Block(this.rules.slice(0, this.rules.length), this.weight, "orphan")
      b.length = this.length;
      return b;
    }
  }


  return block
}
function Section(id, type, length){
  let section = {
    id:id,
    type:type,
    blocks: [],
    openBlocks: [],
    Copy: function(){
      let section = this;
      let s = new Section (this.id, this.type, 0)
      this.blocks.forEach(function(block){
        let b = block.Copy()
        b.section = s;
        s.blocks.push(b);
        if (section.openBlocks.indexOf(block) !== -1)
          s.openBlocks.push(b)
      });
      return s;
    }
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

class Model {
  constructor() {
    this.wave = [];
    this.openBlocks = [];
    this.sections = [];
    return this
  }
  
  Copy() {
    let model = new Model();
    this.sections.forEach(function(section){
      model.sections.push(section.Copy());
    })
    model.sections.forEach(function(section){
      section.blocks.forEach(function(block){ model.wave.push(block)})
      section.openBlocks.forEach(function(block){ model.openBlocks.push(block)})
    })

      return model;
  }

  Init(sections=form){
  // array of sections
  // section of specific type are required to be similar
  let model = this;
  this.wave = [];
  this.openBlocks = [];
  this.sections = [];
  this.AddSections(sections);
  }

  AddSections(sections, late=false){
    let model = this;
    let neighbors = [];
    if (late){
      neighbors.push(0)
      neighbors.push(this.wave.length-1)
    }
    //generate sections
    sections.forEach(function(section, index) {
      let newSection = new Section(index, section.type, section.length)
      model.sections.push(newSection);
      newSection.blocks.forEach(function(block){
        model.wave.push(block);
      })
      newSection.openBlocks.forEach(function(block){
        model.openBlocks.push(block);
      })
    })
  
  // if you add a section late, make sure to propagate immediately before and after it, so that when collapsing is started only valid chords are tested  
    neighbors.forEach(function(neighbor) {Propagate(model, neighbor)});
  }

  DuplicateSection (index) {
    let copy = this.sections[index].Copy();
    let model = this;
    this.sections.push(copy);
    copy.blocks.forEach(function(block){
      model.wave.push(block);
    })
    copy.openBlocks.forEach(function(block){
      model.openBlocks.push(block);
    })
  }

  GetLocOffset(loc) {
    let section = this.sections[this.GetSection(loc)];
    return loc - section.start
  }

  RemoveBlocks(blocks){
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
  }

  //normalizes transform across the tail ends of wave
  Normalize (exp) {
    return (exp + this.wave.length) % this.wave.length
  }

  BlocksCanBeAdjacent (lead, follow){
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
  }
   
  //get a block by removal priority , 
    //  valid to be removed
    //  weight not set to ALN
    //  sorted by sum of adjacent block weights
  GetLooseBlocks (blocks){
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

  Fit (loc) {
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
//        console.log("could not grow", originBlock.rules[0] )
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
