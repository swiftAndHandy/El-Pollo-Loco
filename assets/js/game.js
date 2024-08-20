let canvas = null;
let canvasHeight = 480; // Base 480
let canvasWidth = 720; // Base 720
let world = null;
let gamepad = null;
let animationID = null;
let hitboxMode = false;
let audioMuted = false;
let maxEnemies = 0;
const DATABASE = 'https://el-pollo-loco-9a9c1-default-rtdb.europe-west1.firebasedatabase.app/';
const MUSIC = {
    title: Object.assign(new Audio('./assets/audio/titlescreen.mp3'), { loop: true, volume: 0.1 }),
    regular: Object.assign(new Audio('./assets/audio/regular.mp3'), { loop: true, volume: 0.1 }),
    boss: Object.assign(new Audio('./assets/audio/bossfight.mp3'), { loop: true, volume: 0 }),
};

function init() {
    canvas = document.getElementById('game-area');
    canvas.width = canvasWidth; canvas.height = canvasHeight;
    world = new World(canvas);
    maxEnemies = world.level.enemies.length;
    setupMenu();
    nextControls();
}

function setupMenu() {
    document.getElementById('pause').addEventListener('click', (event) => {
        world.pause();
    });

    document.addEventListener('click', (event) => {
        if (!document.getElementById('title-screen').classList.contains('d-none')) {
            MUSIC.title.play();
        }
    });

    document.getElementById('audio').addEventListener('click', (event) => {
        audioMuted = !audioMuted;
        document.getElementById('audio').classList.toggle('muted');
        if (audioMuted) {
            Audioplayer.pauseAudio(world);
        } else {
            !world.time.paused && Audioplayer.continueAudio(world);
        }

    });

    document.getElementById('fullscreen').addEventListener('click', toggleFullscreen);
}

function newGame() {
    MUSIC.title.pause();
    world.draw();
    document.getElementById('title-screen').classList.add('d-none');
    document.getElementById('highscores').classList.add('d-none');
    document.getElementById('howtoplay').classList.add('d-none');
    document.getElementById('imprint-link').classList.add('d-none');
    document.getElementById('controls').classList.remove('d-none');
    document.getElementById('controls').classList.remove('endcard');
    document.getElementById('touch-control').classList.remove('d-none');
    document.getElementById('win-screen').classList.add('d-none');
    document.getElementById('gameover-screen').classList.add('d-none');
    MUSIC.regular.volume = 0.1;
    MUSIC.boss.volume = 0;
    Audioplayer.startSFX('', MUSIC.regular, true);
}

function resetGame() {
    MUSIC.regular.volume = 0.1;
    MUSIC.boss.volume = 0;
    if (!Level.getBoss().isDead) {
        showGameOver();
    } else {
        showWinScreen();
    }
    Audioplayer.pauseAudio(world);
    world = null;
    world = new World(canvas);
}

function showGameOver() {
    document.getElementById('gameover-screen').classList.remove('d-none');
    document.getElementById('controls').classList.add('endcard');
}

function showWinScreen() {
    console.log(world.framerate.frame);
    const enemyScore = Math.floor((maxEnemies - world.level.enemies.length) * 100);
    const healthBonus = Math.floor(world.player.stats.health * 600);
    const coinBonus = Math.floor(world.player.stats.coins * 180);
    const timeBonus = Math.floor((3200 - world.framerate.frame) * 1.6);
    const killspeedBonus = Math.floor(Level.getBoss().position.x * 1.1 - 50);
    const totalScore = enemyScore + healthBonus + coinBonus + timeBonus + killspeedBonus;
    document.getElementById('killed-enemies').innerText = enemyScore;
    document.getElementById('health-bonus').innerText = healthBonus;
    document.getElementById('coin-bonus').innerText = coinBonus;
    document.getElementById('time-bonus').innerText = timeBonus;
    document.getElementById('killspeed-bonus').innerText = killspeedBonus;
    document.getElementById('total-score').innerText = totalScore;
    document.getElementById('win-screen').classList.remove('d-none');
    document.getElementById('touch-control').classList.add('d-none');
    document.getElementById('controls').classList.add('endcard');
}

function openManual() {
    const target = document.getElementById('howtoplay');
    target.classList.toggle('d-none');
    document.getElementById('highscores').classList.add('d-none');
}


/**
 * Toggles the Highscore-Board and Renders results.
 */
function toggleHighscore() {
    const target = document.getElementById('highscores');
    if (!visible(target)) {
        renderHighscores();
    }
    target.classList.toggle('d-none');
    document.getElementById('howtoplay').classList.add('d-none');
}

/**
 * @param {HTMLElement} target - checks for d-none css class, that hides the element
 * @returns - true, if the element is visible, otherwise false
 */
function visible(target) {
    return !target.classList.contains('d-none');
}

/**
 * Get Scores from Database, call sort function and insert HTML.
 */
async function renderHighscores() {
    const scores = await getScores();
    const target = document.getElementById('highscore-table');
    target.innerHTML = ``;
    let rank = 1;
    try {
        scores.forEach(score => {
            const data = score[1];
            target.innerHTML += highscoreHTML(rank, data.player, data.score, data.date);
            rank++;
        });
    } catch (error) {
        console.warn('Please check your Internet connection');

    }
}

/**
 * Generates HTML required for the highscore-list. Before Rendering the first entry, insert th-elements.
 */
function highscoreHTML(rank, player, score, date) {
    let response = '';
    if (rank === 1) {
        response = `
        <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Score</th>
            <th>Date</th>
        </tr>
        `;
    }
    response += `
    <tr>
        <td>${rank}</td>
        <td>${player}</td>
        <td>${score}</td>
        <td>${date}</td>
    </tr>
    `;
    return response;
}

/**
 * Submits a READ-Query to Firebase
 * @param {string} path - Subpath at Firebase-Server
 * @returns {Promise<Object>}
 */
async function getScores(path = '') {
    try {
        let response = await fetch(DATABASE + path + '.json');
        response = await response.json();

        return sortScores(Object.entries(response));
    }
    catch (error) {
        console.warn("Can't connect to Database.");

    }
}

async function submitScore() {
    let date = new Date();
    const year = String(date.getFullYear());
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    date = `${year}-${month}-${day}`;
    await postData({
        'player': document.getElementById('username').value,
        'score': Number(document.getElementById('total-score').innerText),
        'date': date,
    });

    document.getElementById('title-screen').classList.remove('d-none');
    document.getElementById('highscores').classList.add('d-none');
    document.getElementById('howtoplay').classList.add('d-none');
    document.getElementById('imprint-link').classList.add('d-none');
    document.getElementById('controls').classList.add('d-none');
    document.getElementById('controls').classList.remove('endcard');
    document.getElementById('win-screen').classList.add('d-none');
    document.getElementById('gameover-screen').classList.add('d-none');
    document.getElementById('username').value = '';
    !audioMuted && MUSIC.title.play();

}


/**
 * @param {Array} array - Array that contains every entry on firebase
 * @returns - initial array, sorted by scores high to low.
 */
function sortScores(array) {
    return array.sort((a, b) => {
        return b[1].score - a[1].score;
    });
}

/**
 * Submits a POST-Query to Firebase
 * @param {string} path - Subpath at Firebase-Server
 * @param {Object} data - Data-Object transmitted 
 * @returns {Promise<Object>}
 */
async function postData(data = {}, path = "") {
    try {
        const response = await fetch(DATABASE + path + '.json', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error(`Submit highscore to Server failed.`)
    }
}