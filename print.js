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

  let editor = document.getElementsByClassName("editor")[0];
  if (editor)
  {    editor.value = 
      "options space=20\n" + vexTabOutput + "options space=25"
      document.getElementsByClassName("vextab-auto")[0].children[4].focus()
      KeyUp();
  }
  else
    document.getElementById("vextab").innerHTML = 
      "options space=20\n" + vexTabOutput + "options space=25"

}

//trigger fake keyup event to refresh tab input
function KeyUp() {
  const event = new KeyboardEvent('keyup', {
    view: window,
    bubbles: true,
    cancelable: true
  });
  const cb = document.getElementsByTagName('textarea')[0];
  const cancelled = !cb.dispatchEvent(event);
  
}

