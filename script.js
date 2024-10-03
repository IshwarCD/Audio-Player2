const audioPlayer = new Audio();
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const repeatBtn = document.getElementById('repeat-btn');
const oneTimePlayBtn = document.getElementById('one-time-play-btn');
const progressBar = document.getElementById('progress-bar');
const volumeBar = document.getElementById('volume-bar');
const currentTimeLabel = document.getElementById('current-time');
const durationLabel = document.getElementById('duration');
const songListContainer = document.querySelector('.song-list');
const songListItems = document.querySelectorAll('#song-list li');
const songTitle = document.getElementById('song-title');
const artistName = document.getElementById('artist-name');

let currentSongIndex = 0;
let isRepeatMode = false;
let isOneTimePlayMode = false;

// Load the first song
loadSong(currentSongIndex);

// Load song function
function loadSong(index) {
    const song = songListItems[index];
    audioPlayer.src = song.getAttribute('data-src');
    songTitle.innerText = song.innerText;
    artistName.innerText = "Artist Name"; // Update as per your data
}

// Play or pause song
playBtn.addEventListener('click', () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playBtn.innerText = 'Pause';
    } else {
        audioPlayer.pause();
        playBtn.innerText = 'Play';
    }
});

// Next song function
nextBtn.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex + 1) % songListItems.length;
    loadSong(currentSongIndex);
    audioPlayer.play();
    playBtn.innerText = 'Pause';
});

// Previous song function
prevBtn.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex - 1 + songListItems.length) % songListItems.length;
    loadSong(currentSongIndex);
    audioPlayer.play();
    playBtn.innerText = 'Pause';
});

// Audio ended event
audioPlayer.addEventListener('ended', () => {
    if (isRepeatMode) {
        audioPlayer.currentTime = 0; // Repeat current song
        audioPlayer.play();
    } else {
        currentSongIndex = (currentSongIndex + 1) % songListItems.length;
        loadSong(currentSongIndex);
        audioPlayer.play();
    }
});

// Repeat mode toggle
repeatBtn.addEventListener('click', () => {
    isRepeatMode = !isRepeatMode;
    repeatBtn.innerText = isRepeatMode ? 'Repeat Mode: ON' : 'Repeat Mode: OFF';
});

// One-Time Play toggle
oneTimePlayBtn.addEventListener('click', () => {
    isOneTimePlayMode = !isOneTimePlayMode;
    oneTimePlayBtn.innerText = isOneTimePlayMode ? 'One-Time Play: ON' : 'One-Time Play: OFF';
    audioPlayer.loop = isRepeatMode; // Set loop based on repeat mode
});

// Update progress bar
audioPlayer.addEventListener('timeupdate', () => {
    const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.value = progressPercent;
    currentTimeLabel.innerText = formatTime(audioPlayer.currentTime);
    durationLabel.innerText = formatTime(audioPlayer.duration);
});

// Format time
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Change progress on input
progressBar.addEventListener('input', () => {
    const newTime = (progressBar.value / 100) * audioPlayer.duration;
    audioPlayer.currentTime = newTime;
});

// Volume control
volumeBar.addEventListener('input', () => {
    audioPlayer.volume = volumeBar.value / 100;
});

// Toggle song list visibility
document.getElementById('song-list-btn').addEventListener('click', () => {
    if (songListContainer.style.display === 'none' || songListContainer.style.display === '') {
        songListContainer.style.display = 'block';
    } else {
        songListContainer.style.display = 'none';
    }
});

// Load the first song initially
loadSong(currentSongIndex);
