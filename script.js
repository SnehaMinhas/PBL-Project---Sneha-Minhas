// Data Storage

let round = 1;
let maxRounds = 3;
let blurResults = [];
let sweepResults = [];
let chartResults = [];

let blurValue = 0;
let sweepValue = 0;
let chartScore = 0;

let diopters = [];
let sweepIndex = 0;
let sweepTimer;


// -------------------- Helpers --------------------

function hideAll(){

    document.querySelectorAll(".card")
    .forEach(c=>c.classList.add("hidden"));
}

function show(id){

    document.getElementById(id)
    .classList.remove("hidden");
}


// -------------------- Start --------------------

function startTest(){

    hideAll();
    show("blurTest");
}


// -------------------- Blur Test --------------------

function selectBlur(val){

    blurValue = val;
    blurResults.push(val);

    hideAll();
    show("focusSweep");
}


// -------------------- Focus Sweep --------------------

function startSweep(){

    diopters = [];

    for(let i=-7.5;i<=6;i+=0.25){
        diopters.push(i.toFixed(2));
    }

    sweepIndex = 0;

    sweepTimer = setInterval(runSweep,2000);
}


function runSweep(){

    let d = diopters[sweepIndex];

    let blur = Math.abs(d)*2;

    document.getElementById("sweepImg")
    .style.filter = `blur(${blur}px)`;

    document.getElementById("sweepText")
    .innerText = d+" D";

    sweepValue = parseFloat(d);

    sweepIndex++;

    if(sweepIndex >= diopters.length){
        sweepIndex = 0;
    }
}


function stopSweep(){

    clearInterval(sweepTimer);

    sweepResults.push(sweepValue);

    hideAll();
    startChart();
}


// -------------------- Chart Test --------------------

// -------------------- New Snellen Test --------------------

// ---------------- Snellen Test ----------------

let letters = "EFPTOZLDCH";
let currentLetter = "";
let letterCount = 0;
let correctCount = 0;
let letterSize = 80;


function startChart(){

    hideAll();
    show("chartTest");

    letterCount = 0;
    correctCount = 0;

    nextLetter();
}


function nextLetter(){

    if(letterCount >= 5){

        chartResults.push(correctCount);

        if(round < maxRounds){

            round++;

            hideAll();
            show("blurTest");

        }else{

            showResult();
        }

        return;
    }

    currentLetter =
    letters[Math.floor(Math.random()*letters.length)];

    let box = document.getElementById("chartLetter");

    box.innerText = currentLetter;
    box.style.fontSize = letterSize+"px";

    document.getElementById("chartInput").value = "";

    letterCount++;
}


function checkLetter(){

    let ans =
    document.getElementById("chartInput")
    .value.toUpperCase();

    if(ans === currentLetter){

        correctCount++;
    }

    nextLetter();
}


// Enter key support
document.addEventListener("keydown", function(e){

    if(e.key === "Enter"){

        if(!document.getElementById("chartTest")
        .classList.contains("hidden")){

            checkLetter();
        }
    }
});

// -------------------- AI Average --------------------

function showResult(){

    hideAll();

    let blurAvg = avg(blurResults);
    let sweepAvg = avg(sweepResults);
    let chartAvg = avg(chartResults);

    let final =
    (blurAvg+sweepAvg)/2 - (3-chartAvg)*0.4;

    document.getElementById("final")
    .innerText=
    "Estimated Power: "+
    final.toFixed(2)+" D";

    show("result");
}


function avg(arr){

    return arr.reduce((a,b)=>a+b,0)/arr.length;
}
