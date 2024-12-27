const levels = 6;
const bottles = 8;
const colors = ["#48392A", "#F96F5D", "#6184D8", "#533A71", "#9CEC5B", "#50C5B7", "#01200F", "#FBF2C0"];
const gameState = [];
var currentChosenBottleIdx = -1;
var finishedBottles = [];

function initializeGameState(){
    for(let i = 0; i < bottles; i++){
        gameState.push({});
        gameState[i]["colors"] = [];
        for(let j = 0; j < levels; j++){
            if(i < bottles - 2){
                gameState[i]["colors"].push(i);
            }
            else 
                gameState[i]["colors"].push(-1);
        }
    }
}

function refreshGameState(){
    const gameContainer = document.getElementById("game_container");
    
    let initialHTML = "";
    for(let i = 0; i < bottles; i++){

        if(i % 4 === 0 && i < bottles - 1){
            initialHTML += `
                <div class="items-row">
            `;
        }

        initialHTML += `
            <div class="bottle_container" id="bottle-${i}">
        `;
        for(let j = 0; j < levels; j++){

            const color = gameState[i]["colors"][j] === -1 ? "none" : colors[gameState[i]["colors"][j]];

            initialHTML += `
                <div style="height: 25px; ${j == levels - 1 ? "border-bottom-left-radius: 1em; border-bottom-right-radius: 1em;" : ""} ${j == 0 ? "border-top-left-radius: 1em; border-top-right-radius: 1em;" : ""} width: 40px; background: ${color};"></div>
            `;
        }

        initialHTML += `</div>`;
        if(i % 4 == 3){
            initialHTML += `</div>`;
        }
    }

    gameContainer.innerHTML = initialHTML;
    initializeBottleHandlers();
}

function initializeBottleHandlers(){

    const bottleContainers = document.querySelectorAll(".bottle_container");
    bottleContainers.forEach((bottle) => {
        bottle.addEventListener('click', () => {
            
            const idx = bottle.id.split("bottle-")[1];
            if(finishedBottles.find((elem) => elem === idx)) return ;

            handleGameAction(bottle);
        });
    });
}

// Check the topmost color in a bottle x
function getTop(x){

    for(let i = 0; i < levels; i++)
        if(gameState[x]["colors"][i] !== -1) return [gameState[x]["colors"][i], i];

    return [-1, levels - 1];
}


// Check if bottle x can be poured on top of bottle y
function isAllowedMove(x, y){

    if(x === y) return false;

    // Get top of x
    const [topX, Xidx] = getTop(x);
    const [topY, Yidx] = getTop(y);

    // X bottle should not be empty & Y bottle should either be empty on top or match the X bottle color (Y should have empty space as well)
    return (topX !== -1) && ( ((topX === topY) && (Yidx !== 0)) || topY === -1);
}

function checkFinishedBottles(){

    finishedBottles.length = 0;
    for(let i = 0; i < bottles; i++){

        let finished = true;
        let firstColor = gameState[i]["colors"][0];
        
        for(let j = 1; j < levels; j++){
            if(firstColor !== gameState[i]["colors"][j]){
                finished = false;
                break;
            }
        }
        
        if(finished) finishedBottles.push(i);
    }

    if(finishedBottles.length === bottles){
        alert("Congratsssssppppp!");
        location.reload();
    }
}

function moveColors(x, y){

    let [topX, Xidx] = getTop(x);
    let [topY, Yidx] = getTop(y);

    gameState[x]["colors"][Xidx] = -1;
    if(topY !== -1) Yidx--;
    gameState[y]["colors"][Yidx] = topX;

    checkFinishedBottles();
    refreshGameState();
}

function handleGameAction(bottle){

    const id = bottle.id.split("bottle-")[1];
            
    if(currentChosenBottleIdx === -1){
        document.getElementById(bottle.id).style.scale = "1.3";
    } else {

        // Game logic
        const isPossible = isAllowedMove(currentChosenBottleIdx, id);
        console.log('Possible? ' + isPossible);

        if(isPossible){
            moveColors(currentChosenBottleIdx, id);
        }

        document.getElementById("bottle-" + currentChosenBottleIdx).style.scale = "1.0";
    }
    
    if(currentChosenBottleIdx !== -1)
        currentChosenBottleIdx = -1;
    else 
        currentChosenBottleIdx = id;
}

function createRandomPuzzle(){

    let shuffleableArray = [];
    for(let i = 0; i < bottles - 2; i++){
        shuffleableArray = [... shuffleableArray, ... gameState[i]["colors"].slice(0, levels - 1)];
    }

    for(let i = shuffleableArray.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [shuffleableArray[i], shuffleableArray[j]] = [shuffleableArray[j], shuffleableArray[i]];
    }

    let k = 0;
    for(let i = 0; i < bottles - 2; i++){
        for(let j = 0; j < levels - 1; j++)
            gameState[i]["colors"][j] = shuffleableArray[k++];
    }
}

window.onload = () => {

    initializeGameState();
    createRandomPuzzle();
    refreshGameState();

    // document.getElementById("randomize_btn").addEventListener('click', () => {
    //     createRandomPuzzle();
    //     refreshGameState();
    // });
}