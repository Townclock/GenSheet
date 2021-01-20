function Print(){
  let output = []
  for (let i = 0; i<8; i++) output[i]=[];
  let i = 0;
  for( let b = 0; b < model.wave.length; b++){
    let block = model.wave[b];
    output[Math.floor(i/16)].push( keys[block.rules[0].key] + " " + block.rules[0].follow)
    for (let j = 0; j< block.length-1; j++){
      output[Math.floor(i/16)].push( "`")
    }
    i+= block.length;
  }

  let vexTabOutput =  "tabstave notation=true tablature=false key=" + startKey +" time=4/4 \n";
  
  output.forEach(function(bar, index){
    console.log(bar)
    if (index !== 0)
      vexTabOutput += "tabstave notation=true tablature=false\n";
    vexTabOutput += "notes :h  | | | | | \n text :q, ";
    bar.forEach(function(chord, pos){ 
      console.log(chord)
      vexTabOutput += chord;
      vexTabOutput += (pos !== bar.length-1) ? ", " : "\n";
    });
  })

  document.getElementById("vextab").innerHTML = 
    "options space=20\n" + vexTabOutput + "options space=25"
}
