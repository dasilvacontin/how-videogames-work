const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

function cloneObject (obj) {
    return JSON.parse(JSON.stringify(obj));
}

const rpgState = {
    player: {
        x: 3,
        y: 4,
        hp: 10
    },
    enemy: {
        x: 10,
        y: 10,
        hp: 5
    },
    tree0: {
        x: 6,
        y: 4
    },
    tree1: {
        x: 12,
        y: 7
    },

    gameStatus: 'in progress'
}

const background = [];

// Spawn 10 random grassess/flowers
for (let i = 0; i < 10; i++) {
    const x = Math.floor(Math.random() * 20);
    const y = Math.floor(Math.random() * 20);
    background.push({ type: Math.random() < 0.5 ? 'grass' : 'flowers', x, y });
}

let state = cloneObject(rpgState);

const spriteURLs = {
    Player: 'sprites/player.png',
    Enemy: 'sprites/enemy.png',
    TreeTop: 'sprites/treeTop.png',
    TreeBottom: 'sprites/treeBottom.png',
    Grass: 'sprites/grass.png',
    Flowers: 'sprites/flowers.png'
}

const sprites = {}

Object.entries(spriteURLs).forEach(([name, url]) => {
    const img = new Image();
    img.src = url;
    sprites[name] = img;
})

const spanPlayerX = document.getElementById('playerX');
const spanPlayerY = document.getElementById('playerY');
const spanPlayerHP = document. getElementById('playerHP');
const spanEnemyX = document.getElementById('enemyX');
const spanEnemyY = document.getElementById('enemyY');
const spanEnemyHp = document.getElementById('enemyHP');
const spanTree0X = document.getElementById('tree0X');
const spanTree0Y = document.getElementById('tree0Y');
const spanTree1X = document.getElementById('tree1X');
const spanTree1Y = document.getElementById('tree1Y');
const spanGameStatus = document.getElementById('gameStatus');
const gameStateVariables = [spanPlayerX, spanPlayerY, spanPlayerHP, spanEnemyX, spanEnemyY, spanEnemyHp, spanTree0X, spanTree0Y, spanTree1X, spanTree1Y, spanGameStatus];
function updateStateBasedOnGameVariables () {
    state.player.x = Number(spanPlayerX.innerText);
    state.player.y = Number(spanPlayerY.innerText);
    state.player.hp = Number(spanPlayerHP.innerText);
    state.enemy.x = Number(spanEnemyX.innerText);
    state.enemy.y = Number(spanEnemyY.innerText);
    state.enemy.hp = Number(spanEnemyHp.innerText);
    state.tree0.x = Number(spanTree0X.innerText);
    state.tree0.y = Number(spanTree0Y.innerText);
    state.tree1.x = Number(spanTree1X.innerText);
    state.tree1.y = Number(spanTree1Y.innerText);
    state.gameStatus = spanGameStatus.innerText.replace(/"/g, '');
    // updateGameState();
}
let onInputTimeout;
gameStateVariables.forEach(span => {
    span.onfocus = () => console.log(span, 'focused')
    span.oninput = () => {
        clearTimeout(onInputTimeout);
        onInputTimeout = setTimeout(() => {
            updateStateBasedOnGameVariables();
        }, 1000);
    }
    span.onblur = () => {
        updateStateBasedOnGameVariables();
    }
})

const jsonModeCheckbox = document.getElementById('jsonModeCheckbox');
const slowModeCheckbox = document.getElementById('slowModeCheckbox');
const executionSpeedSelect = document.getElementById('executionSpeedSelect');
const jsonGameState = document.getElementById('jsonGameState');
const humanGameState = document.getElementById('humanGameState');
const artStyleSelect = document.getElementById('artStyleSelect');

const screen = document.getElementById('screen');
const rendererBoard = document.getElementById('rendererBoard');
const rendererModifiesScreen = document.getElementById('rendererModifiesScreen');
const gameStateBoard = document.getElementById('gameStateBoard');
const rendererReadsGameState = document.getElementById('rendererReadsGameState');
const logicBoard = document.getElementById('logicBoard');
const logicReadsModifiesGameState = document.getElementById('logicReadsModifiesGameState');
const inputBoard = document.getElementById('inputBoard');
const logicReadsInput = document.getElementById('logicReadsInput');

const boards = [screen, rendererBoard, rendererModifiesScreen, gameStateBoard, rendererReadsGameState, logicBoard, logicReadsModifiesGameState, inputBoard, logicReadsInput];
let boardIndex = 8//-1;
boards.forEach(el => {
    el.style.opacity = 0
    setTimeout(() => el.style.transition = `opacity 0.5s`, 100)
})
function handleBoardLogic (event) {
    if (event.key === '+') {
        boardIndex++
        if (boardIndex === 3) boardIndex++
        if (boardIndex === 4) {
            resetStateButton.click();
            updateGameState();
        }
        if (boardIndex === 5) boardIndex++
        if (boardIndex === 7) boardIndex++
    } else if (event.key === '-') boardIndex--
    if (boardIndex < -1) boardIndex = -1;
    console.log(boardIndex)
    if (boardIndex >= boards.length) boardIndex = boards.length - 1;
    updateBoardVisibility();
}
function updateBoardVisibility () {
    boards.forEach((el, i) => {
        el.style.opacity = i <= boardIndex ? 1 : 0;
    })
}
updateBoardVisibility();

const resetStateButton = document.getElementById('resetStateButton');
resetStateButton.onclick = () => {
    console.log("Resetting state");
    state = cloneObject(rpgState);
    updateGameState();
    resetStateButton.blur();
}
let isPaused = true
const pauseButton = document.getElementById('pauseButton');
pauseButton.onclick = () => {
    isPaused = !isPaused;
    if (isPaused) {
        pauseButton.innerHTML = `<div class="pause">
                <span class="reset1">Resume </span>
                <span class="span">▶️</span>
            </div>`
    } else {
        pauseButton.innerHTML = `<div class="pause">
                <span class="reset1">Pause </span>
                <span class="span">⏸️</span>
            </div>`
    }
    pauseButton.blur();
}

const rpgGameRules = {}
for (let i = 1; i <= 7; ++i) rpgGameRules[i] = document.getElementById(`rpgGameRule${i}`);

function highlightRule (ruleNumber) {
    Object.entries(rpgGameRules).forEach(([i, rpgGameRule]) => {
        rpgGameRule.style.opacity = (Number(i) === ruleNumber) ? 1 : 0.5;
    })
}

ctx.drawImage(sprites.Grass, 0, 0, canvas.width, canvas.height);
ctx.drawImage(sprites.Flowers, 0, 0, canvas.width, canvas.height);

const SPRITE_SIZE = 32
function render () {
    requestAnimationFrame(render);
    if (boardIndex < 2) return;
    if (boardIndex < 3) {
        state.player.x = randomInt(0, 14);
        state.player.y = randomInt(0, 14);
        state.player.hp = randomInt(0, 10);
        state.enemy.x = randomInt(0, 14);
        state.enemy.y = randomInt(0, 14);
        state.enemy.hp = randomInt(0, 5);
        state.tree0.x = randomInt(0, 14);
        state.tree0.y = randomInt(0, 14);
        state.tree1.x = randomInt(0, 14);
        state.tree1.y = randomInt(0, 14);
    }
    if (artStyleSelect.value === 'Kenney') {
        renderKenneyStyle();
    } else {
        renderAbstractStyle();
    }
}

function randomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function renderKenneyStyle () {
    ctx.fillStyle = '#84C669';
    ctx.globalAlpha = 0.2;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;

    background.forEach(({ type, x, y}) => {
        ctx.drawImage(type === 'grass' ? sprites.Grass : sprites.Flowers, x * SPRITE_SIZE, y * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE);
    })

    let rectHeight = 6
    let rectYOffset = -8
    if (state.player.hp) {
        ctx.drawImage(sprites.Player, state.player.x * SPRITE_SIZE, state.player.y * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE);
        let rectWidth = 10 * 5
        ctx.beginPath()
        ctx.rect(
            state.player.x * SPRITE_SIZE - rectWidth/2 + SPRITE_SIZE/2,
            state.player.y * SPRITE_SIZE - rectHeight + rectYOffset,
            rectWidth,
            rectHeight
        );
        ctx.strokeStyle = '#3D212D'
        ctx.lineWidth = 6
        ctx.stroke()
        ctx.beginPath()
        ctx.rect(
            state.player.x * SPRITE_SIZE - rectWidth/2  + SPRITE_SIZE/2,
            state.player.y * SPRITE_SIZE - rectHeight + rectYOffset,
            state.player.hp * 5,
            rectHeight
        );
        ctx.fillStyle = state.player.hp / 10 > 0.5 ? '#479F4A' : '#E38628'
        ctx.fill()
    }
    if (state.enemy.hp) {
        ctx.drawImage(sprites.Enemy, state.enemy.x * SPRITE_SIZE, state.enemy.y * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE);

        let rectWidth = 5 * 5
        ctx.beginPath()
        ctx.rect(
            state.enemy.x * SPRITE_SIZE - rectWidth/2 + SPRITE_SIZE/2,
            state.enemy.y * SPRITE_SIZE - rectHeight + rectYOffset,
            rectWidth,
            rectHeight
        );
        ctx.strokeStyle = '#3D212D'
        ctx.lineWidth = 6
        ctx.stroke()
        ctx.beginPath()
        ctx.rect(
            state.enemy.x * SPRITE_SIZE - rectWidth/2  + SPRITE_SIZE/2,
            state.enemy.y * SPRITE_SIZE - rectHeight + rectYOffset,
            state.enemy.hp * 5,
            rectHeight
        );
        ctx.fillStyle = state.enemy.hp / 5 > 0.5 ? '#479F4A' : '#E38628'
        ctx.fill()
    }
    ctx.drawImage(sprites.TreeTop, state.tree0.x * SPRITE_SIZE, state.tree0.y * SPRITE_SIZE - SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE);
    ctx.drawImage(sprites.TreeBottom, state.tree0.x * SPRITE_SIZE, state.tree0.y * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE);
    ctx.drawImage(sprites.TreeTop, state.tree1.x * SPRITE_SIZE, state.tree1.y * SPRITE_SIZE - SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE);
    ctx.drawImage(sprites.TreeBottom, state.tree1.x * SPRITE_SIZE, state.tree1.y * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '48px "Not Jam UI Condensed 16"';
    ctx.fillStyle = 'white';

    if (state.gameStatus !== 'in progress') {
        let gameStatusXOffset = Math.random() * 6 - 3
        let gameStatusYOffset = Math.random() * 6 - 3
        let message = state.gameStatus === 'won' ? (state.player.hp === 10 ? 'PERFECT' : 'YOU WIN')  : 'YOU LOSE'
        ctx.fillText(
            message,
            canvas.width/2 + gameStatusXOffset,
            canvas.height/2 + gameStatusYOffset
        )
    }
}

function renderAbstractStyle () {
    ctx.fillStyle = '#cccccc';
    ctx.globalAlpha = 0.2;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;

    let rectHeight = 6
    let rectYOffset = -8
    if (state.player.hp) {
        ctx.fillStyle = 'blue'
        ctx.beginPath()
        ctx.arc(state.player.x * SPRITE_SIZE + SPRITE_SIZE/2, state.player.y * SPRITE_SIZE + SPRITE_SIZE/2, SPRITE_SIZE/2, 0, Math.PI * 2);
        ctx.fill()
        let rectWidth = 10 * 5
        ctx.beginPath()
        ctx.rect(
            state.player.x * SPRITE_SIZE - rectWidth/2 + SPRITE_SIZE/2,
            state.player.y * SPRITE_SIZE - rectHeight + rectYOffset,
            rectWidth,
            rectHeight
        );
        ctx.fillStyle = 'black'
        ctx.fill()
        ctx.beginPath()
        ctx.rect(
            state.player.x * SPRITE_SIZE - rectWidth/2  + SPRITE_SIZE/2,
            state.player.y * SPRITE_SIZE - rectHeight + rectYOffset,
            state.player.hp * 5,
            rectHeight
        );
        ctx.fillStyle = state.player.hp / 10 > 0.5 ? '#479F4A' : '#E38628'
        ctx.fill()
    }
    if (state.enemy.hp) {
        ctx.fillStyle = 'red'
        ctx.fillRect(state.enemy.x * SPRITE_SIZE, state.enemy.y * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE);

        let rectWidth = 5 * 5
        ctx.beginPath()
        ctx.rect(
            state.enemy.x * SPRITE_SIZE - rectWidth/2 + SPRITE_SIZE/2,
            state.enemy.y * SPRITE_SIZE - rectHeight + rectYOffset,
            rectWidth,
            rectHeight
        );
        ctx.fillStyle = 'black'
        ctx.fill()
        ctx.beginPath()
        ctx.rect(
            state.enemy.x * SPRITE_SIZE - rectWidth/2  + SPRITE_SIZE/2,
            state.enemy.y * SPRITE_SIZE - rectHeight + rectYOffset,
            state.enemy.hp * 5,
            rectHeight
        );
        ctx.fillStyle = state.enemy.hp / 5 > 0.5 ? '#479F4A' : '#E38628'
        ctx.fill()
    }

    // Draw abstract tree
    ctx.beginPath();
    ctx.moveTo(state.tree0.x * SPRITE_SIZE, state.tree0.y * SPRITE_SIZE + SPRITE_SIZE);
    ctx.lineTo(state.tree0.x * SPRITE_SIZE + SPRITE_SIZE, state.tree0.y * SPRITE_SIZE + SPRITE_SIZE);
    ctx.lineTo(state.tree0.x * SPRITE_SIZE + SPRITE_SIZE/2, state.tree0.y * SPRITE_SIZE);
    ctx.closePath();
    ctx.fillStyle = 'yellow';
    ctx.fill();

    // Repeat for the other tree
    ctx.beginPath();
    ctx.moveTo(state.tree1.x * SPRITE_SIZE, state.tree1.y * SPRITE_SIZE + SPRITE_SIZE);
    ctx.lineTo(state.tree1.x * SPRITE_SIZE + SPRITE_SIZE, state.tree1.y * SPRITE_SIZE + SPRITE_SIZE);
    ctx.lineTo(state.tree1.x * SPRITE_SIZE + SPRITE_SIZE/2, state.tree1.y * SPRITE_SIZE);
    ctx.closePath();
    ctx.fill();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '48px "Not Jam UI Condensed 16"';
    ctx.fillStyle = 'black';

    if (state.gameStatus !== 'in progress') {
        let gameStatusXOffset = Math.random() * 6 - 3
        let gameStatusYOffset = Math.random() * 6 - 3
        let message = state.gameStatus === 'won' ? (state.player.hp === 10 ? 'PERFECT' : 'YOU WIN')  : 'YOU LOSE'
        ctx.fillText(
            message,
            canvas.width/2 + gameStatusXOffset,
            canvas.height/2 + gameStatusYOffset
        )
    }
}

render()

const keyboard = {}
document.addEventListener('keydown', (event) => {
    keyboard[event.key] = true;
    if (inputBoardButtons[event.key]) {
        inputBoardButtons[event.key].classList.add('active');
    }
    handleBoardLogic(event)
    if (document.activeElement === document.body && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) event.preventDefault();
})
document.addEventListener('keyup', (event) => {
    keyboard[event.key] = false;
    if (inputBoardButtons[event.key]) {
        inputBoardButtons[event.key].classList.remove('active');
    }
})

async function realWait (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

//slowModeCheckbox.onchange = () => slowModeCheckbox.blur();
artStyleSelect.onchange = executionSpeedSelect.onchange = artStyleSelect.onselect = executionSpeedSelect.onselect = function (event) { console.log(this, event.type); this.blur() };
const waitBetweenRules = {
    fast: 10,
    slow: 0.5 * 1000,
    snail: 3 * 1000
}
async function wait (ms) {
    while (isPaused) await realWait(100);
    updateGameState();
    return new Promise(resolve => setTimeout(resolve, waitBetweenRules[executionSpeedSelect.value]))
}

function updateGameState () {
    humanGameState.style.display = jsonModeCheckbox.checked ? 'none' : 'flex';
    jsonGameState.style.display = jsonModeCheckbox.checked ? 'block' : 'none';

    if (jsonModeCheckbox.checked) {
        // Keep the cursor in the same position even if the code updates the text
        const selectionStart = jsonGameState.selectionStart;
        const selectionEnd = jsonGameState.selectionEnd;
        jsonGameState.value = `\n${JSON.stringify(state, null, 2)}\n`;
        jsonGameState.selectionStart = selectionStart;
        jsonGameState.selectionEnd = selectionEnd;
    }
    updateHumanGameState();
}

function updateHumanGameState () {
    const changes = [
        [spanPlayerX, state.player.x],
        [spanPlayerY, state.player.y],
        [spanPlayerHP, state.player.hp],
        [spanEnemyX, state.enemy.x],
        [spanEnemyY, state.enemy.y],
        [spanEnemyHp, state.enemy.hp],
        [spanTree0X, state.tree0.x],
        [spanTree0Y, state.tree0.y],
        [spanTree1X, state.tree1.x],
        [spanTree1Y, state.tree1.y],
        [spanGameStatus, `"${state.gameStatus}"`]
    ]    

    /*
    if (Number(spanPlayerX.innerText) !== state.player.x) {
        spanPlayerX.classList.remove('active');
        setTimeout(() => spanPlayerX.classList.add('active'), 1);
    } else {
        setTimeout(() => spanPlayerX.classList.remove('active'), 500);
    }
        */

    changes.forEach(([span, value]) => {
        if (span.innerText !== String(value)) {
            span.classList.remove('active');
            setTimeout(() => span.classList.add('active'), 1);
        } else {
            setTimeout(() => span.classList.remove('active'), 500);
        }
        span.innerText = value;
    })

    /*
    spanPlayerX.innerText = state.player.x;
    spanPlayerY.innerText = state.player.y;
    spanPlayerHP.innerText = state.player.hp;
    spanEnemyX.innerText = state.enemy.x;
    spanEnemyY.innerText = state.enemy.y;
    spanEnemyHp.innerText = state.enemy.hp;
    spanTree0X.innerText = state.tree0.x;
    spanTree0Y.innerText = state.tree0.y;
    spanTree1X.innerText = state.tree1.x;
    spanTree1Y.innerText = state.tree1.y;
    spanGameStatus.innerText = `"${state.gameStatus}"`;
    */
}
jsonModeCheckbox.onchange = updateGameState;

// jsonGameState has contenteditable = true.
// Make it so that when the user changes the text, the game state gets updated. Make it also so that if the code updates the text in jsonGameState, the user's cursor stays at the same place
jsonGameState.oninput = () => {
    if (!jsonModeCheckbox.checked) return;
    try {
        state = JSON.parse(jsonGameState.value);
        console.log('successfully updated state');
        updateHumanGameState()
    } catch (e) {
        console.error(e);
    }
}

const inputBoardButtons = {
    ArrowUp: document.getElementById('ArrowUp'),
    ArrowDown: document.getElementById('ArrowDown'),
    ArrowLeft: document.getElementById('ArrowLeft'),
    ArrowRight: document.getElementById('ArrowRight'),
    ' ': document.getElementById('Spacebar')
}

const WAIT_BETWEEN_RULES = 0.5 * 1000;
async function logic () {

    highlightRule(1);

    await wait(WAIT_BETWEEN_RULES);

    if (state.player.hp > 0) {
        if (keyboard.ArrowUp && state.player.y > 0) {
            state.player.y--;
        }
        if (keyboard.ArrowDown && state.player.y < canvas.height / SPRITE_SIZE - 1) {
            state.player.y++;
        }
        if (keyboard.ArrowLeft && state.player.x > 0) {
            state.player.x--;
        }
        if (keyboard.ArrowRight && state.player.x < canvas.width / SPRITE_SIZE - 1) {
            state.player.x++;
        }
    }

    await wait(WAIT_BETWEEN_RULES);
    highlightRule(2);
    await wait(WAIT_BETWEEN_RULES);

    // Enemy attack
    // If the Enemy is 1 space away from the Player, reduce the Player’s health by 1
    if (state.enemy.hp > 0 && state.player.hp > 0 && Math.abs(state.player.x - state.enemy.x) <= 1 && Math.abs(state.player.y - state.enemy.y) <= 1) {
        state.player.hp--;
    }

    await wait(WAIT_BETWEEN_RULES);
    highlightRule(3);
    await wait(WAIT_BETWEEN_RULES);

    // Enemy AI
    // If the Enemy is more than 1 space away from the Player, move the Enemy 1 space towards the Player (including diagonally)
    if (state.enemy.hp > 0) {
        if (state.player.x + 1 < state.enemy.x) {
            state.enemy.x--;
        } else if (state.player.x - 1 > state.enemy.x) {
            state.enemy.x++;
        }
        if (state.player.y + 1 < state.enemy.y) {
            state.enemy.y--;
        } else if (state.player.y - 1 > state.enemy.y) {
            state.enemy.y++;
        }
    }

    await wait(WAIT_BETWEEN_RULES);
    highlightRule(4);
    await wait(WAIT_BETWEEN_RULES);

    // Player attack
    // If the Player is 1 space away from the Enemy and the spacebar key is pressed,reduce the Enemy’s health by 1
    if (state.player.hp > 0 && state.enemy.hp > 0 && keyboard[' ']) {
        if (Math.abs(state.player.x - state.enemy.x) <= 1 && Math.abs(state.player.y - state.enemy.y) <= 1) {
            state.enemy.hp--;
        }
    }

    await wait(WAIT_BETWEEN_RULES);
    highlightRule(5);
    await wait(WAIT_BETWEEN_RULES);

    // If the Player’s health is 0,set the Game status to “lost”
    if (state.player.hp <= 0) {
        state.gameStatus = 'lost';
    } else {
        await wait(WAIT_BETWEEN_RULES);
        highlightRule(6);
        await wait(WAIT_BETWEEN_RULES);
        if (state.enemy.hp <= 0) { // Otherwise if the Enemy’s health is 0,set the Game status to “won”
            state.gameStatus = 'won';
        }
    }

    await wait(WAIT_BETWEEN_RULES);
    highlightRule(7);
    await wait(WAIT_BETWEEN_RULES);

    // Execute Logic again in 1 second
    setTimeout(logic, 1 * 1000);
    highlightRule(0);
}

logic()