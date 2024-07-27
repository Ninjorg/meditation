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
const streakDisplay = document.getElementById('streak');

// Load session history and streak from local storage
function loadSessionHistory() {
    const history = JSON.parse(localStorage.getItem('sessionHistory')) || [];
    sessionHistoryList.innerHTML = ''; // Clear existing items
    history.forEach(session => {
        const sessionItem = document.createElement('li');
        sessionItem.textContent = session;
        sessionHistoryList.appendChild(sessionItem);
    });
}

function loadStreak() {
    const today = new Date().toDateString();
    const lastMeditationDate = localStorage.getItem('lastMeditationDate');
    const streak = parseInt(localStorage.getItem('streak'), 10) || 0;

    if (lastMeditationDate === today) {
        // Today is already counted as a meditation day
        streakDisplay.textContent = `Current Streak: ${streak} days`;
    } else if (lastMeditationDate) {
        // Check if the streak is consecutive
        const lastDate = new Date(lastMeditationDate);
        const currentDate = new Date(today);
        const oneDay = 24 * 60 * 60 * 1000;
        const diffDays = Math.round((currentDate - lastDate) / oneDay);

        if (diffDays === 1) {
            // Continue streak
            localStorage.setItem('streak', streak + 1);
            streakDisplay.textContent = `Current Streak: ${streak + 1} days`;
        } else if (diffDays > 1) {
            // Reset streak if not consecutive
            localStorage.setItem('streak', 1);
            streakDisplay.textContent = `Current Streak: 1 day`;
        }
    } else {
        // First meditation day
        localStorage.setItem('streak', 1);
        streakDisplay.textContent = `Current Streak: 1 day`;
    }
    
    localStorage.setItem('lastMeditationDate', today);
}

window.addEventListener('load', () => {
    loadSessionHistory();
    loadStreak();
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
    '"When you realize nothing is lacking, the whole world belongs to you." - Lao Tzu',
    '"The only way to make sense out of change is to plunge into it, move with it, and join the dance." - Alan Watts',
    '"You yourself, as much as anybody in the entire universe, deserve your love and affection." - Buddha',
    '"The quieter you become, the more you are able to hear." - Rumi',
    '"Each morning we are born again. What we do today is what matters most." - Buddha',
    '"Life is a dance. Mindfulness is witnessing that dance." - Anonymous',
    '"If you want to conquer the anxiety of life, live in the moment, live in the breath." - Amit Ray',
    '"Let go of your mind and then be mindful. Close your ears and listen!" - Rumi',
    '"The mind is everything. What you think you become." - Buddha',
    '"Surrender to what is. Let go of what was. Have faith in what will be." - Sonia Ricotti',
    '"The only thing we have to fear is the fear of not being good enough." - Anonymous',
    '"Meditation is not about stopping thoughts, but recognizing that we are more than our thoughts." - Anonymous',
    '"In the stillness of the moment, you can hear the voice of the universe." - Anonymous',
    '"Peace comes from within. Do not seek it without." - Buddha',
    '"When you realize how perfect everything is, you will tilt your head back and laugh at the sky." - Buddha',
    '"To love oneself is the beginning of a lifelong romance." - Oscar Wilde',
    '"Your task is not to seek for love, but merely to seek and find all the barriers within yourself that you have built against it." - Rumi',
    '"Just as a candle cannot burn without fire, men cannot live without a spiritual life." - Buddha',
    '"The best way to pay for a lovely moment is to enjoy it." - Richard Bach',
    '"Mindfulness is the practice of keeping your awareness on the present moment without judgment." - Anonymous',
    '"When you let go of what you are, you become what you might be." - Lao Tzu',
    '"Be where you are; otherwise, you will miss your life." - Buddha',
    '"The greatest wealth is to live content with little." - Plato',
    '"The more you know yourself, the more clarity there is. Self-knowledge has no end." - Jiddu Krishnamurti',
    '"True love is not about perfection; it is hidden in flaws." - Anonymous',
    '"Your mind will believe comforting lies while also believing upsetting truths." - David McRaney',
    '"Sometimes you have to let go to see if there was anything worth holding on to." - Anonymous',
    '"The only way to change the world is to change yourself." - Anonymous',
    '"Happiness is not something ready-made. It comes from your own actions." - Dalai Lama',
    '"Be yourself; everyone else is already taken." - Oscar Wilde',
    '"The only limits you have are the limits you believe." - Anonymous',
    '"Every moment is a fresh beginning." - T.S. Eliot',
    '"When you can’t control what’s happening, challenge yourself to control the way you respond to what’s happening." - Anonymous',
    '"The journey of a thousand miles begins with a single step." - Lao Tzu',
    '"We do not remember days; we remember moments." - Cesare Pavese',
    '"To be calm is the highest achievement of the self." - Anonymous',
    '"When you accept yourself, the whole world accepts you." - Anonymous',
    '"Let the beauty we love be what we do." - Rumi',
    '"The present moment is the only time over which we have dominion." - Thich Nhat Hanh',
    '"You don’t have to control your thoughts. You just have to stop letting them control you." - David Foster Wallace',
    '"The only way to achieve true inner peace is to accept the things you cannot change." - Anonymous',
    '"Nothing in life is to be feared; it is only to be understood." - Marie Curie',
    '"The less you respond to negative people, the more peaceful your life will become." - Anonymous',
    '"The mind is like water. When it’s turbulent, it’s difficult to see. When it’s calm, everything becomes clear." - Prasad Mahes
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
