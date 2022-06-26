// create an audio context

//attach a click listener to a play button
document.querySelector('#activateAudio')?.addEventListener('click', async () => {
	await Tone.start()
	console.log('audio is ready')
})
// create a button that will let me test my sampler
document.querySelector('#testSampler')?.addEventListener('click', async () => {
	TestSampler();
})

//attach a click listener to a play button



// load audio samples
const sampler = new Tone.Sampler({
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

function TestSampler (){
    console.log("test trigger")
	sampler.triggerAttackRelease(["Eb4", "G4", "Bb4"], 2);
}

// create a referable chord chart here or the keys to it in dictionary
/*{"chord_codes":{"M":"Maj","M7":"Maj7","m":"min","m7":"min7","m7b5":"min7b5","m7/4":"min7/iv","d7":"7","d7#9":"7#9","d7b5":"7b5","d7b9":"7b9","d9":"9","d13":"13"},
"chord_form":{
"Maj":["0", "4", "7"],
 "Maj7" : ["0", "4", "7", "11"], "min" : ["0", "3", "7"],
 "min7": ["0","3","7","10"],  "min7b5": ["0","3","6","10"], "min7/iv":["-7","0","3","6","10"], "7": ["0", "4", "7", "10"], "7#9": ["0", "4", "7", "10", "15"],  "7b5": ["0", "4", "6", "10"],"7b9":["0", "4", "7", "9"],"9": ["0", "4", "7", "10", "14"], "13":["0", "4", "7", "10", "14", "21"]},


"key_codes":["C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B"]}*/

// create a function that can play an array of chords while
function PlayChord(root, form, time=Tone.now()){
    let rootNote = 36 + root;
    console.log(DICTIONARY.key_codes.indexOf(root), form)
    let chord = DICTIONARY.chord_form[form].slice();
    console.log(chord)
    for (note in chord) chord[note] = midiNumberToNoteCode(Number(chord[note]) + rootNote);
    console.log(chord)
    sampler.triggerAttackRelease(chord, 1, time)
}
function midiNumberToNoteCode(num) {
    let octave = Math.floor(num / 12);
    let code = DICTIONARY.key_codes[num%12];
    return code + octave;
    
}

// the function which allows the user to input a chain of chords for playback
function PlayChordChain(chordChain){
    chordChain.forEach(function(chord, index){PlayChord(chord.root, chord.form, Tone.now()+index)})
}

// user interface should create this array and pass into this function with times

// connect this function to chord blocks and control playback with mouse down/up