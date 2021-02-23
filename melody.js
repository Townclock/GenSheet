let  MelodyModel

function GetRhythm(length, carry){
  possible = rhythms[length].filter(function (r){ return (r.follow === carry) });
  return possible[Math.floor(possible.length*Math.random())];

}

function GenNote(){
  return 
}

function GenBeats(chordSection){
    
    let melodySection = [];
    let carry = false;        // tracks if there is a carry between bar across subsections
  
    chordSection.blocks.forEach(function(block) {
      let melBlock = [];
      let chordLength = block.length;
      
      let rhythm = GetRhythm(chordLength, carry)
      carry = rhythm.follow;
      let rest = false;
      let bar = carry;
      for (let i = 0; i < rhythm.rhythm.length; i++)
      {
        console.log(rhythm.rhythm, rhythm.rhythm[i], i)
        let dotted= false;

        let token = rhythm.rhythm.slice(i, i+2);
        if (token[1] === "+") dotted = true;

        switch (token[0]){
          case "W":
            melBlock.push({length: 1/*vextab length valuye*/, dotted:dotted, note:PickRandomNoteForChord(block) , rest: rest, bar:bar});
            bar = false;  
            break;
          case "H":
            melBlock.push({length: 2, dotted:dotted, note:PickRandomNoteForChord(block) , rest: rest, bar:bar});
            bar = false;  
            break;
          case "Q":
            melBlock.push({length: 4,dotted:dotted, note:PickRandomNoteForChord(block) , rest: rest, bar:bar});
            bar = false;  
            break;
          case "E":
            melBlock.push({length: 8,dotted:dotted, note:PickRandomNoteForChord(block) , rest: rest, bar:bar});
            bar = false;  
            break;
          case "S":
            melBlock.push({length: 16,dotted:dotted, note:PickRandomNoteForChord(block) , rest: rest, bar:bar});
            bar = false;  
            break;
      
          case "-":
            bar = true;
            break;

          case "R":
            rest = true;
            break;
          case ")":
            rest=false;
            break;
      }
      console.log("rest", rest)
      }
      carry = rhythm.lead;
      //console.log(melodySection);
      melodySection.push(melBlock)
    })


      return melodySection 
}


function PrepareMelodyModel(chordModel){
  MelodyModel = {};
  let types = [];
  chordModel.sections.forEach(function(section, index){
    if (types.indexOf(section.type) < 0) {
      let type = section.type;
      types.push(section.type);
      let length = section.blocks.length
      let melodySection = GenBeats(section);
    
      MelodyModel[type] = melodySection;
      //add note variation
    }


  });

}
function GenerateMelody(){
  PrepareMelodyModel(model);
  //Print(model, MelodyModel)
}
