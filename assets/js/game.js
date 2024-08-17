let canvas = null;
let canvasHeight = 480; // Base 480
let canvasWidth = 720; // Base 720
let world = null;
let gamepad = null;
let animationID = null;
let hitboxMode = false;
let audioMuted = false;
const DATABASE = 'https://el-pollo-loco-9a9c1-default-rtdb.europe-west1.firebasedatabase.app/';

function init() {
    canvas = document.getElementById('game-area');
    canvas.width = canvasWidth; canvas.height = canvasHeight;
    world = new World(canvas);
    setupMenu();
}

function setupMenu() {
    document.getElementById('pause').addEventListener('click', (event) => {
        world.pause();
    });

    document.getElementById('audio').addEventListener('click', (event) => {
        audioMuted = !audioMuted;
        document.getElementById('audio').classList.toggle('muted');

    });

    document.getElementById('fullscreen').addEventListener('click', (event) => {
        if (!document.fullscreenElement) {
            const game = document.getElementById('game');
            game.requestFullscreen();
            game.classList.toggle('fullscreen');
        } else {
            document.exitFullscreen();
            game.classList.toggle('fullscreen');
        }
    });
}

function newGame() {
    world.draw();
    document.getElementById('titlescreen').classList.add('d-none');
}

/**
 * Toggles the Highscore-Board and Renders results.
 */
function toggleHighscore() {
    const target = document.getElementById('highscores');
    if (target.classList.contains('d-none')) {
        renderHighscores();
    }
    target.classList.toggle('d-none');
}


/**
 * Get Scores from Database, call sort function and insert HTML.
 */
async function renderHighscores() {
    const scores = await getScores();
    const target = document.getElementById('highscore-table');
    target.innerHTML = ``;
    let rank = 1;
    scores.forEach(score => {
        const data = score[1];
        target.innerHTML += highscoreHTML(rank, data.player, data.score, data.date);
        rank++;
    });
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