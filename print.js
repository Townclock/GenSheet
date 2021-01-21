function Print(model){
  let output = []
  for (let i = 0; i<8; i++) output[i]=[];
  let i = 0;
  for( let b = 0; b < model.wave.length; b++){
    let block = model.wave[b];
    switch (block.rules[0].follow){
    case ("I"): 
      output[Math.floor(i/16)].push( keys[block.rules[0].key] + "Maj7");
      break;
    case ("ii"): 
      output[Math.floor(i/16)].push( keys[(block.rules[0].key+2)%12] + "min7");
      break;
    case ("V"): 
      output[Math.floor(i/16)].push( keys[(block.rules[0].key+7)%12] + "7");
      break;
    }

    for (let j = 0; j< block.length-1; j++){
      output[Math.floor(i/16)].push( "`")
    }
    i+= block.length;
  }

  let vexTabOutput =  "tabstave notation=true tablature=false key=" + keys[model.wave[0].rules[0].key] +" time=4/4 \n";
  
  output.forEach(function(bar, index){
    if (index !== 0)
      vexTabOutput += "tabstave notation=true tablature=false\n";
    vexTabOutput += "notes :h  | | | | | \n text :q, ";
    bar.forEach(function(chord, pos){ 
      vexTabOutput += chord;
      vexTabOutput += (pos !== bar.length-1) ? ", " : "\n";
    });
  })

  document.getElementById("vextab").innerHTML = 
    "options space=20\n" + vexTabOutput + "options space=25"
}
