const audioPlayer = document.getElementById('audioPlayer');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const repeatBtn = document.getElementById('repeat-btn');
const progressBar = document.getElementById('progress-bar');
const volumeBar = document.getElementById('volume-bar');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const songTitle = document.getElementById('song-title');
const artistName = document.getElementById('artist-name');
const coverImage = document.getElementById('cover');
const lyricsText = document.getElementById('lyrics-text');
const darkModeBtn = document.getElementById('dark-mode-btn');
const canvas = document.getElementById('visualizer');
const canvasCtx = canvas.getContext('2d');

// Playlist of songs
const songs = [
  { title: "Song 1", artist: "Artist 1", cover: "images/cover1.jpg", src: "songs/song1.mp3" },
  { title: "Song 2", artist: "Artist 2", cover: "images/cover2.jpg", src: "songs/song2.mp3" },
  { title: "Song 3", artist: "Artist 3", cover: "images/cover3.jpg", src: "songs/song3.mp3" }
];

let currentSongIndex = 0;
let isShuffle = false;
let isRepeat = false;

// Load the first song initially
loadSong(songs[currentSongIndex]);

function loadSong(song) {
  songTitle.innerText = song.title;
  artistName.innerText = song.artist;
  coverImage.src = song.cover;
  audioPlayer.src = song.src;
}

function playSong() {
  audioPlayer.play();
  playBtn.innerText = "Pause";
  playBtn.classList.add('active');
}

function pauseSong() {
  audioPlayer.pause();
  playBtn.innerText = "Play";
  playBtn.classList.remove('active');
}

playBtn.addEventListener('click', () => {
  if (audioPlayer.paused) {
    playSong();
  } else {
    pauseSong();
  }
});

nextBtn.addEventListener('click', () => {
  if (isShuffle) {
    currentSongIndex = Math.floor(Math.random() * songs.length);
  } else {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
  }
  loadSong(songs[currentSongIndex]);
  playSong();
});

prevBtn.addEventListener('click', () => {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(songs[currentSongIndex]);
  playSong();
});

// Shuffle and Repeat functionality
shuffleBtn.addEventListener('click', () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle('active');
});

repeatBtn.addEventListener('click', () => {
  isRepeat = !isRepeat;
  repeatBtn.classList.toggle('active');
});

// Repeat current song when ended
audioPlayer.addEventListener('ended', () => {
  if (isRepeat) {
    playSong();
  } else {
    nextBtn.click();
  }
});

// Update progress bar and song time
audioPlayer.addEventListener('timeupdate', updateProgress);

function updateProgress() {
  const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  progressBar.value = progressPercent;

  const currentMinutes = Math.floor(audioPlayer.currentTime / 60);
  const currentSeconds = Math.floor(audioPlayer.currentTime % 60);
  const durationMinutes = Math.floor(audioPlayer.duration / 60);
  const durationSeconds = Math.floor(audioPlayer.duration % 60);

  currentTimeEl.innerText = `${currentMinutes}:${currentSeconds < 10 ? '0' + currentSeconds : currentSeconds}`;
  durationEl.innerText = `${durationMinutes}:${durationSeconds < 10 ? '0' + durationSeconds : durationSeconds}`;
}

// Update song time when progress bar is changed
progressBar.addEventListener('input', () => {
  const newTime = (progressBar.value / 100) * audioPlayer.duration;
  audioPlayer.currentTime = newTime;
});

// Volume control
volumeBar.addEventListener('input', () => {
  audioPlayer.volume = volumeBar.value;
});

// Dark mode toggle
darkModeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  darkModeBtn.classList.toggle('active');
});

// Load and display lyrics (example lyrics data)
const lyrics = [
  { time: 0, text: "Starting lyrics line 1..." },
  { time: 10, text: "Next line at 10 seconds..." },
  { time: 20, text: "And another at 20 seconds..." }
];

audioPlayer.addEventListener('timeupdate', () => {
  const currentTime = audioPlayer.currentTime;
  const currentLine = lyrics.find(line => currentTime >= line.time);

  if (currentLine) {
    lyricsText.innerText = currentLine.text;
  }
});

// Audio visualizer using Web Audio API
const audioCtx = new AudioContext();
const audioSource = audioCtx.createMediaElementSource(audioPlayer);
const analyser = audioCtx.createAnalyser();

audioSource.connect(analyser);
analyser.connect(audioCtx.destination);

analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

function draw() {
  requestAnimationFrame(draw);

  analyser.getByteFrequencyData(dataArray);
  
  canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
  
  const barWidth = (canvas.width / bufferLength) * 2.5;
  let barHeight;
  let x = 0;
  
  for (let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i];
    
    canvasCtx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
    canvasCtx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
    
    x += barWidth + 1;
  }
}

audioPlayer.onplay = () => {
  audioCtx.resume();
  draw();
};
