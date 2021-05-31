let melodyMovementArray = {};
let testMe = "9,-2,2,-10,12,-2,2,-7,10,-2,-8,,3,9,-2,-7,5,-1,1,2,-2,-1,-1,-1,-1,-1,0,0,2,-1,1,2,-2,-1,-1,-1,-1,-1,0,0,0,5,-1,1,2,2,-2,-2,-1,-1,-1,2,-1,-1,-1,-1,-1,4,-1,-1,-1,7,-2,-7";
function ParseMelodyMovement (string){
	string.split(',').forEach(function(move){
		if (melodyMovementArray[move] == undefined)
			melodyMovementArray[move] = 0;
		else
			melodyMovementArray[move] += 1;
	})
	console.log(melodyMovementArray);
	return melodyMovementArray
}
let probabilities = ParseMelodyMovement(testMe);



function ScoreNoteChoice (leadNote, followNote, relationshipData)//output of ParseMelodyMovement
{
	let score = relationshipData[followNote-leadNote]
	return (Number.isInteger(score)) ? score : 0;
}
// perform a wave motion collapse thingy~ on section melodyModel
// section melodyies are broken with resting melody blocks 1/2 measure or longer
// remove smaller rests from collapse model before running
//beginning of the song is not tied to the ending
function PickNotes (melodyModel){
	console.log(melodyModel);
	let melodySections = [];
	
	let currentSection = [];
	melodySections.push(currentSection);
	melodyModel.types.forEach(function(type){
		melodyModel[type].forEach(function(phrase){
			phrase.forEach(function(block){
				if (block.rest && block.length <= 2)
				{
						currentSection = [];
						melodySections.push(currentSection);
				}
				else if	(!block.rest)
				{
					currentSection.push(block)
				}
			})
		})
		// when you change section types you are starting a new melody section (THIS IS A FORMAL SIMPLIFICATION BECAUSE WE ARE NOT ACCOUTING FOR SECTION ADJACENCY AT THE HIGHER LEVEL WITHIN THE CODE)
		currentSection = [];
		melodySections.push(currentSection);
	})
	// pre WFC partitioning done
	
	// okay, lets score the each of the possible notes in of the possible based on the previous and following blocks
	
	melodySections.forEach(function(melodySection, i){console.log("Melody Section ", i, melodySection)
		melodySection.forEach(function(block, index){
			block.weight = 0;
			block.scoresForPossibleNotes = [];
			block.possibleNotes.forEach(function(note){
				let score=0
				if (index != 0)
					melodySection[index-1].possibleNotes.forEach(function(leadNote)
						{
							score += ScoreNoteChoice(leadNote, note, probabilities)})
				
				if (index != melodySection.length-1)
					melodySection[index+1].possibleNotes.forEach(function(followNote)
						{score += ScoreNoteChoice(note, followNote, probabilities)})
				
				block.scoresForPossibleNotes.push(score);
				block.weight += score;
				if (index === 0) block.bar = false; // sections can not begin with bared notes
				if (block.bar) block.weight = ALN - 5; // bad practice here
			})
		})
		
		MelodyWFC(melodySection)
		
	})
	
}

function RemoveFromArray(e, array){
	let index = array.indexOf(e);
	if (index > -1) {
		array.splice(index, 1);
	}
}

function MelodyPropagate(melodySection, melodyBlock){ 
console.log ("hi")
		//left hand
        
        // if we are not the 0th block
		if (melodySection.indexOf(melodyBlock) > 0){
            
            // identify the block to the left
			let neighbor = melodySection[melodySection.indexOf(melodyBlock) - 1]
            let weightChange = neighbor.weight;
            
            // if it doesn't bar into this one and if it hasn't been collapsed
			if (!neighbor.bar && neighbor.weight <ALN){
                
                // create a copy of all of its possible pitches
				let possibleRemovals = neighbor.possibleNotes.slice(0, neighbor.possibleNotes.length);
                
                // for each of the possible pitches in this block
				melodyBlock.possibleNotes.forEach(function(melodyNote, i){
                
                // for each possible pitch in the neighbor
				neighbor.possibleNotes.forEach(function(neighborNote, j){
                    
                    // if a note in the origin block is possible
					if (melodyBlock.scoresForPossibleNotes[i] > 0){
                        // and it is possible for a neighbord note to lead into this block
						if (probabilities[melodyNote - neighborNote] > 0){
                            // remove that possible neighbor pitch from the list of pitches to remove
							RemoveFromArray(neighborNote, possibleRemovals)
                            
                            
                            // in theory this keeps all valid notes leading from the neighbor into this note
					}
					else
					{
														// we are not adjusting weights unless to remove probability
														// we could adjust the weights, based on likehood to follow
														//like a weighted propagation because weights are a sum of 
														//leading note weights, we're not doing that right now}
														//that would go here
														
														//This will be much more important if chord restrictions were weights (which they should be) rather
														// than discrete allowances 
					}
					
				}
				})
				})
                
                // this removes all the weight from notes which will not be used

				possibleRemovals.forEach(function(noteToRemove){
					let index = neighbor.possibleNotes.indexOf(noteToRemove)
					neighbor.weight -= neighbor.scoresForPossibleNotes[index];
					neighbor.scoresForPossibleNotes[index]=0;

				})
                
			}
            if (neighbor.weight !== weightChange) MelodyPropagate(melodySection, neighbor)
		}
        
        
		//right hand
		if (melodySection.indexOf(melodyBlock) < melodySection.length - 2){
			console.log(melodySection.indexOf(melodyBlock),  melodySection.length, melodySection)
			let neighbor = melodySection[melodySection.indexOf(melodyBlock) + 1]
            let weightChange = neighbor.weight;
			if (!neighbor.bar && neighbor.weight <ALN){
				let possibleRemovals = neighbor.possibleNotes.slice(0, neighbor.possibleNotes.length);
				melodyBlock.possibleNotes.forEach(function(melodyNote, i){
				neighbor.possibleNotes.forEach(function(neighborNote, j){
					if (melodyBlock.scoresForPossibleNotes[i] > 0){
						if (probabilities[ neighborNote - melodyNote] > 0){
							RemoveFromArray(neighborNote, possibleRemovals)
					}
					else
					{
										
														// we are not adjusting weights unless to remove probability
														// we could adjust the weights, based on likehood to follow
														//like a weighted propagation because weights are a sum of 
														//leading note weights, we're not doing that right now}
														//that would go here
														
														//This will be much more important if chord restrictions were weights rather
														// than discrete allowances (which they should be)
					}
				}
				})
				})
				possibleRemovals.forEach(function(noteToRemove){
					let index = neighbor.possibleNotes.indexOf(noteToRemove)
					neighbor.weight -= neighbor.scoresForPossibleNotes[index];
					neighbor.scoresForPossibleNotes[index]=0;

				})
			}
            if (neighbor.weight !== weightChange) MelodyPropagate(melodySection, neighbor)
		}

}

function MelodyWFC(melodySection){
	for (let i = 0; i < melodySection.length; i++){
		
		melodyBlock = melodySection.slice(0, melodySection.length).sort(function(a,b){return a.weight-b.weight})[0];
		if (melodyBlock.bar === false) {
			let pick = Math.random()*melodyBlock.weight;
            console.log(melodyBlock.weight)
			let winner = false;
				for (let j = 0; j < melodyBlock.possibleNotes.length; j++){
					if (pick < melodyBlock.scoresForPossibleNotes[j]) {
					console.log(pick, (melodyBlock.scoresForPossibleNotes[j] / melodyBlock.weight), melodyBlock.possibleNotes[j])
						if (melodyBlock.weight === melodyBlock.scoresForPossibleNotes[j]) console.log("was the only options")
						winner = melodyBlock.possibleNotes[j];
						melodyBlock.note = winner
					}
					else {
						pick -= melodyBlock.scoresForPossibleNotes[j];
						melodyBlock.scoresForPossibleNotes[j] = 0;
					}
				}
			if (!winner) {console.log("defaulting to random bote in chord scale for melody block")}
		}
		else {
			melodyBlock.note = melodySection[melodySection.indexOf(melodyBlock) - 1].note;
			console.log(melodySection[melodySection.indexOf(melodyBlock)].note)
			console.log(melodySection[melodySection.indexOf(melodyBlock) - 1].note)
		}
		
		
		melodyBlock.weight = ALN;
		
		MelodyPropagate(melodySection, melodyBlock)
	}
	
}


let  MelodyModel

function GetRhythm(length, carry){
  possible = rhythms[length].filter(function (r){ return (r.follow === carry) });
  return possible[Math.floor(possible.length*Math.random())];

}

function GenBeats(chordSection){
    
    let melodySection = [];
    let carry = false;        // tracks if there is a carry between bar across subsections
	let previousNote = 0;
  
    chordSection.blocks.forEach(function(block) {
      let melBlock = [];
      let chordLength = block.length;
      
      let rhythm = GetRhythm(chordLength, carry)
      carry = rhythm.follow;
      let rest = false;
      let bar = carry;
      for (let i = 0; i < rhythm.rhythm.length; i++)
      {
		let note = (bar) ? previousNote : PickRandomNoteForChord(block);//(rest) ? null : "unchosen";
		let possibleNotes = GetScaleForChord(block);
        //console.log(rhythm.rhythm, rhythm.rhythm[i], i)
        let dotted= false;

        let token = rhythm.rhythm.slice(i, i+2);
        if (token[1] === "+") dotted = true;

        switch (token[0]){
          case "W":
            melBlock.push({length: 1/*vextab length valuye*/, dotted:dotted, note:note, possibleNotes:possibleNotes,  rest: rest, bar:bar});
			previousNote = note;
            bar = false;  
            break;
          case "H":
            melBlock.push({length: 2, dotted:dotted, note:note, possibleNotes:possibleNotes , rest: rest, bar:bar});
			previousNote = note;
            bar = false;  
            break;
          case "Q":
            melBlock.push({length: 4,dotted:dotted, note:note, possibleNotes:possibleNotes , rest: rest, bar:bar});
			previousNote = note;
            bar = false;  
            break;
		  case "q":
            melBlock.push({length: 4,dotted:dotted, note:note, possibleNotes:possibleNotes , rest: rest, bar:bar, playTriplet:true});
			previousNote = note;
            bar = false;  
            break;
          case "E":
            melBlock.push({length: 8,dotted:dotted, note:note, possibleNotes:possibleNotes , rest: rest, bar:bar});
			previousNote = note;
            bar = false;  
            break;
          case "e":
            melBlock.push({length: 8,dotted:dotted, note:note, possibleNotes:possibleNotes , rest: rest, bar:bar, playTriplet: true});
			previousNote = note;
            bar = false;  
            break;
          case "S":
            melBlock.push({length: 16,dotted:dotted, note:note, possibleNotes:possibleNotes , rest: rest, bar:bar});
			previousNote = note;
            bar = false;  
            break;
      
	  
	  
	  	  case "3":
			console.log(melBlock)
            melBlock[melBlock.length-1].triplet = true;  
            break;
	  
          case "-":
            bar = true;
            break;

          case "R":
            rest = true;
			bar = false;  
            break;
          case ")":
            rest=false;
            break;
      }
      //console.log("rest", rest)
      }
      carry = rhythm.lead;
      //console.log(melodySection);
      melodySection.push(melBlock)
    })


	
    return melodySection 
}


function PrepareMelodyModel(chordModel){
  MelodyModel = {};
  let types = [];
  chordModel.sections.forEach(function(section, index){
    if (types.indexOf(section.type) < 0) {
      let type = section.type;
      types.push(section.type);
      let length = section.blocks.length
      let melodySection = GenBeats(section);
    
      MelodyModel[type] = melodySection;
    
    }	


  });
  MelodyModel.types = types;
	PickNotes (MelodyModel);
	return
}

function GenerateMelody(){
  PrepareMelodyModel(model);
  Print(model, MelodyModel)
}
