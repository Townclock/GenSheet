let wholeTone = [0, 2, 4, 6, 8, 10, 12]
let dim = [0, 2, 3, 5, 6, 8, 9, 11, 12]
let halfDim = [0, 2, 3, 5, 6, 8, 10, 12]
let harmonicMinor = [0, 2, 3, 5, 7, 8, 11, 12]
let majorPentatonic = [0, 2, 4, 7, 9, 12 ]
let minorPentatonic = [ 0, 3, 5, 7, 10, 12]
let mkeys = ["C", "D@", "D", "E@", "E", "F", "F#", "G", "A@", "A", "B@", "B"]

let majorChord = [0,4,7,11]
let majorTriad = [0,4,7]

let majorNineChord = [0,4,7,11,14]
let majorSixChord = [0,4,7,9]
let majorOverFourChord = [-7,0,4,7,11]
let majorOverFiveChord = [-5,0,4,11]
let augChord = [0,4,8,10]
let minorChord = [0,3,7,10]
let minorTriad = [0,3,7]
let minorSixChord = [0,3,7,8]
let minorFlatFiveChord = [0,3,6,10]
let dimChord = [0,3,6,9]

let domChord = [0,4,7,10]
let domSharpElevenChord = [0,4,7,10,18]
let domSharpNineChord = [0,4,7,10,15]
let domFlatFiveChord = [0,4,6,10]
let domFlatNineChord = [0,4,7,10,13]
let domSusFourChord = [0,5,7,10]

  let translate = {
"Aug7": { mod: 0, print: (key) => keys[key]+"aug7", scale: wholeTone, root: 0, notes:augChord},
"bII7": { mod: 1, print: (key) => keys[key]+"7", scale:majorPentatonic, root: 1, notes:majorChord},
"biii7": { mod: 4, print: (key) => keys[key]+"-7", scale:minorPentatonic, root:3, notes:minorChord},
"bVII6": { mod: -2, print: (key) => keys[key]+"Maj6", scale:majorPentatonic, root:10, notes: majorSixChord},
"Dim": { mod: 0, print: (key) => keys[key]+"dim", scale: dim, root:0, notes: dimChord},
"I": { mod: 0, print: (key) => keys[key]+"Maj", scale:majorPentatonic, root:0, notes: majorTriad},
"i": { mod: 0, print: (key) => keys[key]+"-", scale:minorPentatonic, root:0, notes:minorTriad},
"iMaj7" : {mod: 0, print:(key) => keys[key]+"-(Maj7)", scale:harmonicMinor, root: 0, notes:majorChord},
"I/V": { mod: 0, print: (key) => keys[key]+"/"+keys[(key+7)%12], scale:majorPentatonic, root:0, notes: majorOverFiveChord},
"i6": { mod: 0, print: (key) => keys[key]+"-6", scale:minorPentatonic, root:0, notes: minorSixChord},
"I6": { mod: 0, print: (key) => keys[key]+"Maj6", scale:majorPentatonic, root:0, notes: majorSixChord},
"i7": { mod: 0, print: (key) => keys[key]+"-7", scale:minorPentatonic, root:0, notes:minorChord},
"ii": { mod: 2, print: (key) => keys[key]+"-", scale:minorPentatonic, root:2, notes: minorTriad},
"ii7": { mod: 2, print: (key) => keys[key]+"-7", scale:minorPentatonic, root:2, notes:minorChord},
"ii7b5": { mod: 2, print: (key) => keys[key]+"-7b5", scale:halfDim, root:2, notes:minorFlatFiveChord},
"iii7": { mod: 4, print: (key) => keys[key]+"-7", scale:minorPentatonic, root:4, notes: minorChord},
"iii7b5": { mod: 4, print: (key) => keys[key]+"-7b5", scale:halfDim, root:4, notes: minorFlatFiveChord},
"II": { mod: 2, print: (key) => keys[key]+"Maj", scale: majorPentatonic, root:2, notes: majorTriad},
"IIMaj7": { mod: 2, print: (key) => keys[key]+"Maj7", scale: majorPentatonic, root:2, notes: majorChord},
"IMaj/V": { mod: 0, print: (key) => keys[key]+"/"+keys[(key+7)%12], scale: majorPentatonic, root:0, notes: majorOverFiveChord},
"IMaj7" : { mod: 0, print: (key) => keys[key]+"Maj7", scale: majorPentatonic, root:0, notes:majorChord},
"IV" : { mod: 5, print: (key) => keys[key]+"Maj7", scale: majorPentatonic, root:5, notes:majorTriad},
"iv6" : { mod: 5, print: (key) => keys[key]+"-7", scale: majorPentatonic, root:5, notes:minorSixChord},
"IVMaj7" : { mod: 5, print: (key) => keys[key]+"Maj7", scale: majorPentatonic, root:5, notes:majorChord},
"V" : { mod: 7, print: (key) => keys[key]+"Maj", scale: majorPentatonic, root:7, notes:majorTriad},
"V/IV" : { mod: 7, print: (key) => keys[key]+"/"+keys[(key+6)%12], scale: majorPentatonic, root:7, notes: majorOverFourChord},
"V7" : { mod: 7, print: (key) => keys[key]+"7", scale: majorPentatonic, root:7, notes:domChord},
"V7#11" : { mod: 7, print: (key) => keys[key]+"7#11", scale: majorPentatonic, root:7, notes: domSharpElevenChord},
"V7#9" : { mod: 7, print: (key) => keys[key]+"7#9", scale: majorPentatonic, root:7, notes:domSharpNineChord},
"V7b5" : { mod: 7, print: (key) => keys[key]+"7b5", scale: majorPentatonic, root:7, notes:domFlatFiveChord},
"V7b9" : { mod: 7, print: (key) => keys[key]+"7b9", scale: majorPentatonic, root:7, notes:domFlatNineChord},
"V7sus4" : { mod: 7, print: (key) => keys[key]+"7sus4", scale: majorPentatonic, root:7, notes:domSusFourChord},
"vi" : { mod: 9, print: (key) => keys[key]+"-", scale: minorPentatonic, root:9, notes: minorTriad},
"vi7" : { mod: 9, print: (key) => keys[key]+"-7", scale: minorPentatonic, root:9, notes: minorChord},
"VI9" : { mod: 9, print: (key) => keys[key]+"Maj9", scale: majorPentatonic, root:9, notes: majorNineChord},
"VIMaj7" : { mod: 9, print: (key) => keys[key]+"Maj7", scale: majorPentatonic, root:9, notes: majorChord}
}

function GetScaleForChord(block){
    let mod = translate[block.rules[0].follow].mod;
    let key = block.rules[0].key;
    let data = translate[block.rules[0].follow];
	let scale = [];
	data.scale.forEach(function(interval){
		scale.push(data.root + key + mod/*this gets root*/ + interval)
	})
	return scale;
	
}

function PickRandomNoteForChord(block){
    let mod = translate[block.rules[0].follow].mod;
    let key = block.rules[0].key;
    let data = translate[block.rules[0].follow];
//  console.log(data.scale)
    let scaleNote = data.scale[Math.floor(Math.random()*data.scale.length)]
    
    //console.log(data, key, mod, scaleNote) 
    return data.root + key + mod/*this gets root*/ + scaleNote
	
	// outputs absolute position of the note
}

function Print(model, melodyModel=false){
  let output = [];
  let melodyOutput = []
  for( let b = 0; b < model.wave.length; b++){
    let block = model.wave[b];
    let mod = translate[block.rules[0].follow].mod;
    output.push(
	{ 
		length: block.length,
		text: translate[block.rules[0].follow].print((block.rules[0].key + mod +12)%12)
	}
	);

    if (melodyModel){
    // console.log(melodyModel[block.section.type][block.section.blocks.indexOf(block)])
      melodyOutput.push(melodyModel[block.section.type][block.section.blocks.indexOf(block)])
    }

    for (let j = 0; j< block.length-1; j++){
      output.push('`');
      melodyOutput.push('`');
    }


  }
  //console.log(output)
  let bars = [];
  let melodyBars = [];
  for (let b = 0; b < output.length; b += 12){
    bars.push(output.slice(b, b+12))
    melodyBars.push(melodyOutput.slice(b, b+12))
  } 
//console.log(melodyOutput.length, output.length)



  let vexTabOutput =  "tabstave notation=true tablature=false key=" + keys[model.wave[0].rules[0].key] +" time=4/4 \n";
  bars.forEach(function(bar, i){
  
   if (i !== 0) vexTabOutput += "tabstave notation=true tablature=false\n";
    
    vexTabOutput += "notes :q |"
    
    for (let m = 0; m < bar.length; m++){ 
      if (melodyModel){
        //console.log(melodyBars[i][m], i, m, melodyBars, bars)
        if (melodyBars[i][m] != "`"){
          melodyBars[i][m].forEach(function(beat){
            vexTabOutput += 
              " :" +beat.length + 
              ((beat.dotted) ? "d" : "") + 
              " "  +  
              ((beat.bar && !beat.rest) ? "b" : "") + " " + 
              ((beat.rest) ? "##" : (mkeys[beat.note%12]+"/"+"4"+" ")); 
			  if (beat.triplet) vexTabOutput += " ^3^ ";
          })
        }
      }
      else{
        vexTabOutput += "##";
      }
      if ((m+1) % 4 === 0) {vexTabOutput += " |"}
    }
      
  
	let count = 0;
    bar.forEach(function(chord, pos){
	  let lengthKey = [0, "q", "h", "hd", "w" ]
      if( chord !== "`"){
		  
		if (count % 4 === 0 )     vexTabOutput +=   "\n text ";
		  
		count += chord.length;

        vexTabOutput += ":" + lengthKey[chord.length] + ", "
		
        
		vexTabOutput +=  chord.text + ", ";
		
		if (count % 4 === 0 ) vexTabOutput += " | ";
        
		if (pos+1 === bar.length) vexTabOutput +="  \n ";
      }
    });
    vexTabOutput += " \noptions space=20\n"
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

