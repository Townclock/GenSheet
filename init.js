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
      console.log(blocks, "to be removed")

      blocks.forEach(function(b){
        model.wave.splice(model.wave.indexOf(b), 1)
        
        let index = b.section.blocks.indexOf(b)
        console.log(b.section.type, index)
        model.sections.forEach(function(section){
          if (b.section.type == section.type)
            section.blocks.splice(index, 1)
        })
      })
      console.log(model.sections)
    },
    DropFromSection: function(loc, beats){
      this.sections[GetSection(loc)+1].length -= beats;
      for (let start = GetSection(loc)+1; start < this.sections.length; start++)
      {
        this.sections[start].length -= beats;  
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
    
    
  console.log(model.sections)    
  return model;
}
