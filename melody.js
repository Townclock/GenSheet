let userMelodyModel, MelodyModel
function GetMelodyDistribution(){
  userMelodyModel = {
    weights : [ { symbol: "1", rest:false, weight:document.getElementById("wholeNote").value, mass:4},
    { symbol: "2", rest:false, weight:document.getElementById("halfNote").value, mass:2},
    { symbol: "4", rest:false, weight:document.getElementById("quarterNote").value, mass:1},
    { symbol: "8", rest:false, weight:document.getElementById("eighthNote").value, mass:0.5},
    { symbol: "16", rest:false, weight:document.getElementById("sixteenthNote").value, mass:0.25},
    { symbol: "1", rest:true, weight:document.getElementById("wholeRest").value, mass:4},
    { symbol: "2", rest:true, weight:document.getElementById("halfRest").value, mass:2},
    { symbol: "4", rest:true, weight:document.getElementById("quarterRest").value, mass:1},
    { symbol: "8", rest:true, weight:document.getElementById("eighthRest").value, mass:0.5},
    { symbol: "16", rest:true, weight:document.getElementById("sixteenthRest").value, mass:0.25}]
    
,
    GenBeats: function(size, block){
      let allo = size;
      let beats = [];
      while (allo >0){
      let pick = Math.random()*this.sum;
      for (let i = 0; i < this.weights.length; i++){
        if (pick < this.weights[i].weight && this.weights[i].mass <= allo){
          
          let note = PickRandomNoteForChord(block);
          beats.push({length: this.weights[i].symbol, note: note%12, octave: Math.floor(3+note/12), rest: this.weights[i].rest});
          allo-= this.weights[i].mass
          console.log("hot")
          break;
        }
        else {
          pick -= this.weights[i].weight;
        }
      }
      }
      console.log(beats)
    
      return beats 
      }
  }
  userMelodyModel.sum = 0;
  userMelodyModel.weights.forEach(function(ob){userMelodyModel.sum+=Number(ob.weight);})

}
function PrepareMelodyModel(chordModel){
  MelodyModel = {};
  let types = [];
  chordModel.sections.forEach(function(section, index){
    if (types.indexOf(section.type) < 0) {
      let type = section.type;
      let length = section.blocks.length
      let melodySection = []
      MelodyModel[type] = melodySection;
      types.push(section.type);
      section.blocks.forEach(function(block){
        melodySection.push(userMelodyModel.GenBeats(block.length, block));
      })
    }

  });

}
function GenerateMelody(){
  GetMelodyDistribution()
  PrepareMelodyModel(model);
  Print(model, MelodyModel)
}
