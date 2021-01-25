let majorPentatonic = [ 9, 12, 14, 16, 19 ]
let minorPentatonic = [ 10, 12, 15, 17, 19]
let mkeys = ["C", "C#", "D", "E@", "E", "F", "F#", "G", "A@", "A", "B@", "B"]

  let translate = {
"bII7": { mod: 1, print: "min7", scale:[]},
"biii7": { mod: 4, print: "min7", scale:[]},
"bVII6": { mod: -2, print: "Maj6", scale:[]},
"Dim": { mod: 0, print: "dim", scale:[0, 3, 5, 8, 10]},
"I": { mod: 0, print: "Maj", scale:majorPentatonic},
"i": { mod: 0, print: "min", scale:[]},
"iMaj7" : {mod: 0, print:"min+7", scale:[] }, // i minor + Major 7??
"I/V": { mod: 0, print: "I/V", scale:[]},//bleh
"i6": { mod: 0, print: "min6", scale:minorPentatonic},
"I6": { mod: 0, print: "Maj6", scale:majorPentatonic},
"i7": { mod: 0, print: "min7", scale:[]},
"ii": { mod: 2, print: "min", scale:minorPentatonic},
"ii7": { mod: 2, print: "min7", scale:minorPentatonic},
"ii7b5": { mod: 2, print: "min7b5", scale:[]},
"iii7": { mod: 4, print: "min7", scale:minorPentatonic},
"iii7b5": { mod: 4, print: "min7b5", scale:[]},
"II": { mod: 2, print: "Maj", scale: majorPentatonic},
"IIMaj7": { mod: 2, print: "Maj7", scale: majorPentatonic},
"IMaj/5": { mod: 0, print: "Maj/5", scale: majorPentatonic},
"IMaj7" : { mod: 0, print: "Maj7", scale: majorPentatonic},
"IV" : { mod: 5, print: "Maj7", scale: majorPentatonic},
"iv6" : { mod: 5, print: "min7", scale: majorPentatonic},
"IVMaj7" : { mod: 5, print: "Maj7", scale: majorPentatonic},
"V" : { mod: 7, print: "Maj", scale: majorPentatonic},
"V/IV" : { mod: 7, print: "V/IV", scale: majorPentatonic},  //bleh
"V7" : { mod: 7, print: "7", scale: majorPentatonic},
"V7#11" : { mod: 7, print: "7#11", scale: []},
"V7#9" : { mod: 7, print: "7#9", scale: []},
"V7b5" : { mod: 7, print: "7b5", scale: []},
"V7b9" : { mod: 7, print: "7b9", scale: []},
"V7sus4" : { mod: 7, print: "7sus4", scale: majorPentatonic},
"vi" : { mod: 9, print: "min", scale: minorPentatonic},
"vi7" : { mod: 9, print: "min7", scale: minorPentatonic},
"VI9" : { mod: 9, print: "Maj9", scale: majorPentatonic},
"VIMaj7" : { mod: 9, print: "Maj7", scale: majorPentatonic}
}




function Print(model){
  let output = []
  for( let b = 0; b < model.wave.length; b++){
    let block = model.wave[b];
    console.log(block.rules[0].follow)
    let mod = translate[block.rules[0].follow].mod;
    output.push( keys[((block.rules[0].key + mod+12) % 12)] + translate[block.rules[0].follow].print);

    for (let j = 0; j< block.length-1; j++){
      output.push('`');
    }
  }

  while (output.length % 16 !== 0){
      output.push('`');
  }

  let bars= [];
  for (let b = 0; b < output.length; b += 16){
    bars.push(output.slice(b, b+16))
  } 
  let vexTabOutput =  "tabstave notation=true tablature=false key=" + keys[model.wave[0].rules[0].key] +" time=4/4 \n";
  bars.forEach(function(bar, i){
  
   if (i !== 0) vexTabOutput += "tabstave notation=true tablature=false\n";
    
    vexTabOutput += "notes :w | ## | ## | ## | ## | ";
      
    vexTabOutput +=   "\n text :q, ";
    bar.forEach(function(chord, pos){
      if (pos % 4 === 0 ) vexTabOutput += "|";
      vexTabOutput += chord;
      if (pos+1 % 4 !== 0) vexTabOutput +=", ";
      if (pos+1 === 16) vexTabOutput +=" | \n ";

    });
    vexTabOutput += "options space=20\n"
  }) 

  let editor = document.getElementsByClassName("editor")[0];
  if (editor)
  {    editor.value = 
      "options space=20 font-size=11\n" + vexTabOutput + "options space=25"
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

