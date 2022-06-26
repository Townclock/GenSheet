
//https://github.com/mxgmn/WaveFunctionCollapse/blob/master/Model.cs

//https://github.com/0xfe/vexflow

let ALN = 1000000  // arbitrarily large number
let keys = ["C", "Db", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"]

function CopyRule(rule){
  return {
    lead:rule.lead, 
    follow: rule.follow, 
    mod:rule.mod, 
    weight: rule.weight,
    leadingLength: rule.leadingLength,
    followLength: rule.followLength
  };
}


let chordRules = [];

protoRules.forEach(function(rule){
  for (let i = 0; i < 12; i++){
    let keyedRule = CopyRule(rule);
    keyedRule.key = i;
    chordRules.push(keyedRule);
    
    cadences["types"].forEach(function(type) {
        if (FilterRulesThatFitsCadence([rule], type).length === 1 )
            cadenceRules[type].push(keyedRule);
    })
    
  }
});


let startingTotalWeight = 0;
for (i = 0; i < chordRules.length; i++)
  startingTotalWeight += chordRules[i].weight;



let key = Math.floor(Math.random()*12);
let startKey = keys[key]

let model = new Model();

let progress;

function RunUntilComplete(song){
  let backup = song.Copy();
  let model = song;
  let quit = 0;
  while (!CheckComplete(model)){
    if ( Observe(model) == false){
      //console.log("Re-initialized. . .", quit, " times \n Copy Made: " , backup)
      model = backup.Copy();
      quit++;
    }

    if (quit >10000) { 
      console.log("DISASTER");break
    };
  }
  if (quit <= 1000)
  {  
    Print(model)
  }
  return model;
}

function ProceedSimple(){
  model.Init([{type: 'A', measures: 8, cadences:[  {type: "half"} ]}]); // cadence resolve at the end
  console.log("proceed simple")
  model = RunUntilComplete(model);
  model.DuplicateSection(0);
  model.AddSections([{type: 'B', measures: 8}], true);
  model.DuplicateSection(0);
  //console.log(model)
  model = RunUntilComplete(model);
}

function ProceedSimpleSparse(){
  let quit=20;
  
  while (quit > 0)
  {
    model.Init([{type: 'A', measures: 8}]);
    console.log("proceed simple")
    model = RunUntilComplete(model);
    model.DuplicateSection(0);
    model.AddSections([{type: 'B', measures: 8}], true);
    model.DuplicateSection(0);
    console.log(model)
    model = RunUntilComplete(model);
    if (model.wave.length < 48)
      break;
    quit--;
  }
  if (quit < 0) alert("after 20 attempts did not generate a sparse song")
}

function Proceed(){ 
  progress = document.getElementById("progress");
  model.Init()
  model = RunUntilComplete(model)
}


let chordTime = 0;
let bpm = 120;
let quarterNote = 60/bpm; 


const synth = new Tone.Sampler({
    urls: {
        "A0": "audio/A0.mp3",
        "A1": "audio/A1.mp3",
        "A2": "audio/A2.mp3",
        "A3": "audio/A3.mp3",
        "A4": "audio/A4.mp3",
        "A5": "audio/A5.mp3",
        "A6": "audio/A6.mp3",
        "A7": "audio/A7.mp3",
        "C1": "audio/C1.mp3",
        "C2": "audio/C2.mp3",
        "C3": "audio/C3.mp3",
        "C4": "audio/C4.mp3",
        "C5": "audio/C5.mp3",
        "C6": "audio/C6.mp3",
        "C7": "audio/C7.mp3",
        "C8": "audio/C8.mp3",
        "D#1": "audio/Ds1.mp3",
        "D#2": "audio/Ds2.mp3",
        "D#3": "audio/Ds3.mp3",
        "D#4": "audio/Ds4.mp3",
        "D#5": "audio/Ds5.mp3",
        "D#6": "audio/Ds6.mp3",
        "D#7": "audio/Ds7.mp3",
        "F#1": "audio/Fs1.mp3",
        "F#2": "audio/Fs2.mp3",
        "F#3": "audio/Fs3.mp3",
        "F#4": "audio/Fs4.mp3",
        "F#5": "audio/Fs5.mp3",
        "F#6": "audio/Fs6.mp3",
        "F#7": "audio/Fs7.mp3"
    
    },
    release: 1, 
    baseURL : ".", 
}).toDestination();

function PlayModel(){
	
		  //create a synth and connect it to the main output (your speakers)
	//const synth = new Tone.PolySynth().toDestination();
	
    // sampler developed later, also lives in playback.js, but i'm feeling hacky and want that sweet dopamine hit
    
    //
    //synth.options.envelope.release = 0.3
	console.log(synth)

model.wave.forEach(function(block){
		
			let chordNotes = translate[block.rules[0].follow].notes
			let root = translate[block.rules[0].follow].root
			let key = block.rules[0].key
			
			let chordArray = []
			chordNotes.forEach(function(note){
				chordArray.push(
					keys[(key + root + note+12)%12] + (((key + root + note) > 12)?"4":"3")
				)
			});
			console.log(chordArray)
			chordTime += block.length;
			synth.triggerAttackRelease(chordArray, quarterNote, quarterNote*chordTime+2);
			
			//set melody notes
			let position = block.section.blocks.indexOf(block);
			
			
			let noteTime = 0;
			MelodyModel[block.section.type][position].forEach(function(melBlock){
				console.log(quarterNote*chordTime +   quarterNote*noteTime/(melBlock.length)/4   + 2)
				if (!melBlock.rest)
				  synth.triggerAttackRelease( 
					keys[(melBlock.note+12)%12]+"6", 
					(quarterNote * 4/melBlock.length) * ((melBlock.dotted)?1.5:1), 
					quarterNote*chordTime +   quarterNote*noteTime *((melBlock.playTriplet) ? (2/3) : 1 )  + 2
				  );
				noteTime += (4 / (melBlock.length) * (melBlock.dotted)?1.5:1);
			})
		
	})


Tone.Transport.start();


	
}


let probWeights = [0,0,0,0,0];
// based on what previous length is inputed, what are the chances of the next of some length
let chainWeights = [[],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];
// the sum of all chances for the following lengths
let chainTotals = [0,0,0,0,0];

	chordRules.forEach(function(rule){
		probWeights[rule.followLength] += rule.weight;
		chainWeights[rule.leadingLength][rule.followLength] += rule.weight;
		chainTotals[rule.leadingLength] += rule.weight;
	})
console.log(chainWeights, chainTotals);

	
function GenLengthOutline (measures){
	let blocks = [];
	let prevLength = 2; // arbitray, should be input from previous section if it exists
	for (let i = 0; i < measures; i++){
		let measureLeft = 4;
		
		while (measureLeft > 0){
			//let pick =Math.floor(Math.random()*startingTotalWeight)
			let pick = Math.floor(Math.random()*chainTotals[prevLength])
			for (let l = 4; l > 0; l--){
			  //console.log(pick, chainWeights[prevLength][l], l, l <= measureLeft)
				//if (pick < probWeights[l] && l <= measureLeft && !(l ==1 && measureLeft == 4)){
				if (pick < chainWeights[prevLength][l] && l <= measureLeft && !(l ==1 && measureLeft == 4)){
					measureLeft -= l;
					blocks.push(l);
					prevLength = l;
				}
				else
					pick -= chainWeights[prevLength][l];
				
			}
		}
	}
	return blocks;
}



