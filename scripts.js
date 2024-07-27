// Timer functionality
let timer;
let isRunning = false;
let totalTime = 5 * 60; // Initial time in seconds (5 minutes)
let elapsedTime = 0;

const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const customTimeInput = document.getElementById('custom-time');
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const progressBar = document.getElementById('progress-bar');
const sessionHistoryList = document.getElementById('session-history');
const newQuoteButton = document.getElementById('new-quote');
const quoteDisplay = document.getElementById('quote');
const audio = document.getElementById('audio');
const timeError = document.getElementById('time-error');

// Load session history from local storage
function loadSessionHistory() {
    const history = JSON.parse(localStorage.getItem('sessionHistory')) || [];
    sessionHistoryList.innerHTML = ''; // Clear existing items
    history.forEach(session => {
        const sessionItem = document.createElement('li');
        sessionItem.textContent = session;
        sessionHistoryList.appendChild(sessionItem);
    });
}

window.addEventListener('load', () => {
    loadSessionHistory();
});

startButton.addEventListener('click', () => {
    if (!isRunning) {
        startTimer();
    }
});

resetButton.addEventListener('click', () => {
    resetTimer();
});

function startTimer() {
    isRunning = true;
    timer = setInterval(() => {
        elapsedTime++;
        updateTimer();
        updateProgressBar();

        if (elapsedTime === totalTime) {
            clearInterval(timer);
            isRunning = false;
            addSessionToHistory();
            alert('Meditation session completed!');
        }
    }, 1000);
}
function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    
    // Get custom time value from input
    const customTime = parseInt(customTimeInput.value, 10);
    
    // Validate custom time input
    if (isNaN(customTime) || customTime < 1 || customTime > 60) {
        timeError.textContent = 'Please enter a valid time between 1 and 60 minutes.';
        timeError.style.display = 'block';
        return;
    }
    
    timeError.style.display = 'none'; // Hide error if input is valid
    
    // Set total time based on custom time
    totalTime = customTime * 60;
    elapsedTime = 0;
    updateTimer();
    updateProgressBar();
}

function updateTimer() {
    const remainingTime = totalTime - elapsedTime;
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    minutesDisplay.textContent = String(minutes).padStart(2, '0');
    secondsDisplay.textContent = String(seconds).padStart(2, '0');
}


function updateTimer() {
    const remainingTime = totalTime - elapsedTime;
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    minutesDisplay.textContent = String(minutes).padStart(2, '0');
    secondsDisplay.textContent = String(seconds).padStart(2, '0');
}

function updateProgressBar() {
    const progress = (elapsedTime / totalTime) * 100;
    progressBar.style.transform = `scaleX(${progress / 100})`;
}

// Quotes functionality
const quotes = [
    '"Mindfulness is a way of befriending ourselves and our experience." - Jon Kabat-Zinn',
    '"The present moment is filled with joy and happiness. If you are attentive, you will see it." - Thich Nhat Hanh',
    '"Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor." - Thich Nhat Hanh',
    '"Mindfulness means being awake. It means knowing what you are doing." - Jon Kabat-Zinn',
    '"The best way to capture moments is to pay attention. This is how we cultivate mindfulness." - Jon Kabat-Zinn',
    '"To think in terms of either pessimism or optimism oversimplifies the truth. The problem is to see reality as it is." - Thich Nhat Hanh',
    '"When you realize nothing is lacking, the whole world belongs to you." - Lao Tzu'
];

newQuoteButton.addEventListener('click', () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteDisplay.textContent = quotes[randomIndex];
    quoteDisplay.classList.add('fade-in');
    setTimeout(() => {
        quoteDisplay.classList.remove('fade-in');
    }, 1000);
});

// Session History functionality
function addSessionToHistory() {
    const sessionDuration = `${Math.floor(totalTime / 60)}:${totalTime % 60 < 10 ? '0' : ''}${totalTime % 60}`;
    const sessionDateTime = new Date().toLocaleString();
    const sessionItem = `Session at ${sessionDateTime}, Duration: ${sessionDuration}`;
    const listItem = document.createElement('li');
    listItem.textContent = sessionItem;
    sessionHistoryList.prepend(listItem);

    // Save to local storage
    const history = JSON.parse(localStorage.getItem('sessionHistory')) || [];
    history.unshift(sessionItem);
    localStorage.setItem('sessionHistory', JSON.stringify(history));
}

// Audio functionality
audio.addEventListener('play', () => {
    if (isRunning) {
        audio.play();
    }
});

audio.addEventListener('pause', () => {
    if (isRunning) {
        audio.pause();
    }
});
