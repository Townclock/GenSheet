function Print(){
  let output = []
  for (let i = 0; i<8; i++) output[i]=[];
  model.wave.forEach(function(section, sectionCount){
    section.content.forEach(function(content, count) {
      let bar = Math.floor(count/16 + sectionCount*2)

      key += content[0].mod +12;
      key %= 12;

      let chord = content[0].follow;
      console.log(key, chord)
      switch(chord)
      {
        case ("I"):
          output[bar].push(keys[(key)%12] + "+7");
          break;
        case ("ii"):
          output[bar].push(keys[(key+2)%12] + "-7");
          break
        case ("V"):
          output[bar].push(keys[(key+7)%12] + "7");
          break; 
      }
    })
  })

  let vexTabOutput =  "tabstave notation=true tablature=false key=" + startKey +" time=4/4 \n";
  
  output.forEach(function(bar, index){
    console.log(bar)
    if (index !== 0)
      vexTabOutput += "tabstave notation=true tablature=false\n";
    vexTabOutput += "notes :h  | | | | | \n text :q ";
    bar.forEach(function(chord, pos){ 
      console.log(chord)
      vexTabOutput += chord;
      vexTabOutput += (pos !== bar.length-1) ? ", " : "\n";
    });
  })

  document.getElementById("vextab").innerHTML = 
    "options space=20\n" + vexTabOutput + "options space=25"
}
