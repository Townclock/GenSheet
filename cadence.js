let cadences = {
    "types" : ["pure authentic cadence", "impure authentic cadence nontonic", "impure authentic cadence inverted", "impure authentic cadence dim" , "half" , "plagal" , "minor plagal" , "deceptive"  ], 
    "pure authentic cadence" : {
        lead : ["V", "V7", "V7#11", "V7#9", "V7b5", "V7b9", "V7sus4"],
        follow: ["I", "I6", "IMaj7"],
        melody: [0],
        mod: [0]
    }, 
    "impure authentic cadence nontonic" : {
        lead : ["V", "V7", "V7#11", "V7#9", "V7b5", "V7b9", "V7sus4"],
        follow: ["I", "I6", "IMaj7"],
        melody: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        mod: [0]
    }, 
    "impure authentic cadence inverted" : {
        lead : ["V/IV"],
        follow: ["I/V", "IMaj/5"],
        melody: [0]
    }, 
    "impure authentic cadence dim" : {
        lead : ["Dim"],
        follow: ["I", "I6", "Imaj7", "I/V", "IMaj/5"],
        mod: [1, -11],
        melody: [0]
    },
    "half" : {
        follow: ["V", "V7", "V7#11", "V7#9", "V7b5", "V7b9", "V7sus4", "V/IV"]
    },
    "plagal" : {
        lead : ["IV, IVMaj7"],
        follow: ["I", "I6", "IMaj7", "I/V", "IMaj/5"]
    },        
    "minor plagal" : {
        lead : ["iv6"],
        follow: ["I", "I6", "IMaj7", "I/V", "IMaj/5"]
    },    
    "deceptive" : {
        lead : ["V", "V7", "V7#11", "V7#9", "V7b5", "V7b9", "V7sus4", "V/IV"],
        notFollow:["I", "I6", "IMaj7", "I/V", "IMaj/5"]
    },   
}

/*  WHAT A RULE LOOKS LIKE
    a.lead === b.lead && 
    a.follow === b.follow && 
    a.leadingLength === b.leadingLength && 
    a.followingLength === b.followingLength &&
    a.mod === b.mod  */
    
function FilterRulesThatFitsCadence (RuleArray, type) {
    let cadence = cadences[type];
    let qualifiers = [];
    RuleArray.forEach(function(rule){
        let lead, follow, mod, notFollow = false;
        if (cadence.lead)
            cadence.lead.forEach(function(chord) {if (chord == rule.lead) lead=true})
        else lead = true;
        if (cadence.follow)
            cadence.follow.forEach(function(chord) {if (chord == rule.follow) follow=true})
        else follow = true;
        if (cadence.notFollow)
            cadence.lead.forEach(function(chord) {if (chord !== rule.follow) notFollow=true})
        else notFollow = true;
        if (cadence.mod)
            cadence.lead.forEach(function(chord) {if (chord !== rule.mod) mod=true})
        else mod = true;
    
        if (lead && follow && mod && notFollow)
            qualifiers.push(rule)
    })  
    return qualifiers;
}

let cadenceRules = {};
cadences["types"].forEach(function(type){cadenceRules[type] = [];})