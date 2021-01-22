let majorPentatonic = [ 9, 12, 14, 16, 19 ]
let minorPentatonic = [ 10, 12, 15, 17, 19]
let mkeys = ["C", "C#", "D", "E@", "E", "F", "F#", "G", "A@", "A", "B@", "B"]


function Print(model){
  let output = []
  let melody = []
  let mp = 0; //melody position
  for (let i = 0; i<8; i++) {output[i]=[];melody[i] = []};
  let i = 0;
  for( let b = 0; b < model.wave.length; b++){
    let block = model.wave[b];
    switch (block.rules[0].follow){
    case ("I"): 
      output[Math.floor(i/16)].push( keys[block.rules[0].key] + "Maj7");
      for (let m = 0; m < block.length; m++){
          melody[Math.floor(mp/16)].push(mkeys[(block.rules[0].key+majorPentatonic[Math.floor(Math.random()*5)])%12])
        mp++
      }
     break;
    case ("ii"): 
      output[Math.floor(i/16)].push( keys[(block.rules[0].key+2)%12] + "min7");
      for (let m = 0; m < block.length; m++){
          melody[Math.floor(mp/16)].push(mkeys[(block.rules[0].key+minorPentatonic[Math.floor(Math.random()*5)])%12])
      mp++}
    break;
    case ("V"): 
      output[Math.floor(i/16)].push( keys[(block.rules[0].key+7)%12] + "7");
      for (let m = 0; m < block.length; m++){
        melody[Math.floor(mp/16)].push(mkeys[(block.rules[0].key+majorPentatonic[Math.floor(Math.random()*5)])%12])
    mp++;}  
    break;
    }

    for (let j = 0; j< block.length-1; j++){
      output[Math.floor(i/16)].push( "`")
    }
    i+= block.length;
  }

  console.log("melody", melody)

  let vexTabOutput =  "tabstave notation=true tablature=false key=" + keys[model.wave[0].rules[0].key] +" time=4/4 \n";
  
  output.forEach(function(bar, index){
    if (index !== 0)
      vexTabOutput += "tabstave notation=true tablature=false\n";
    vexTabOutput += "notes :h  | ";
      melody[index].forEach(function(note, q){
      if ((q+1)%4 !== 0)  
        vexTabOutput += note+ "-";
      else
        vexTabOutput += note+"/4 |";
      })
    vexTabOutput +=   "\n text :q, ";
    bar.forEach(function(chord, pos){ 
      vexTabOutput += chord;
      vexTabOutput += (pos !== bar.length-1) ? ", " : "\n";
    });
    vexTabOutput += "options space=20\n"
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

