const audioPlayer = document.getElementById('audioPlayer');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');
const volumeBar = document.getElementById('volume-bar');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const songTitle = document.getElementById('song-title');
const artistName = document.getElementById('artist-name');
const coverImage = document.getElementById('cover');
const darkModeBtn = document.getElementById('dark-mode-btn');
const songListElement = document.getElementById('song-list');
const songListContainer = document.getElementById('song-list-container');
const canvas = document.getElementById('visualizer');
const canvasCtx = canvas.getContext('2d');
const songListBtn = document.getElementById('song-list-btn');

let isRepeating = false; // For repeat mode
let isOneTimePlay = false; // For one-time play mode
let currentSongIndex = 0; // To keep track of the current song

// Playlist of songs
const songs = [
  { title: "Song 1", artist: "Artist 1", cover: "images/cover1.jpg", src: "songs/song1.mp3" },
  { title: "Song 2", artist: "Artist 2", cover: "images/cover2.jpg", src: "songs/song2.mp3" },
  { title: "Song 3", artist: "Artist 3", cover: "images/cover3.jpg", src: "songs/song3.mp3" }
];

// Load the first song initially
loadSong(songs[currentSongIndex]);

// Populate the song list dynamically
populateSongList();

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

// Event listeners for buttons
playBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', playNextSong);
prevBtn.addEventListener('click', playPrevSong);

// Automatically play next song
audioPlayer.addEventListener('ended', handleSongEnd);

// Update progress bar and song time
audioPlayer.addEventListener('timeupdate', updateProgress);

// Volume control
volumeBar.addEventListener('input', () => {
  audioPlayer.volume = volumeBar.value;
});

// Dark mode toggle
darkModeBtn.addEventListener('click', toggleDarkMode);

// Toggle song list visibility
songListBtn.addEventListener('click', toggleSongList);

// Audio visualizer setup
setupAudioVisualizer();

// Repeat and One Time Play buttons
setupRepeatButton();
setupOneTimePlayButton();

function togglePlay() {
  if (audioPlayer.paused) {
    playSong();
  } else {
    pauseSong();
  }
}

function playNextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(songs[currentSongIndex]);
  playSong();
}

function playPrevSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(songs[currentSongIndex]);
  playSong();
}

function handleSongEnd() {
  if (isRepeating) {
    loadSong(songs[currentSongIndex]);
    playSong();
  } else if (isOneTimePlay) {
    pauseSong();
    isOneTimePlay = false; // Reset after playing once
  } else {
    playNextSong();
  }
}

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

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  darkModeBtn.classList.toggle('active');
}

function toggleSongList() {
  songListContainer.style.display = songListContainer.style.display === 'none' ? 'block' : 'none';
}

function populateSongList() {
  songs.forEach((song, index) => {
    const li = document.createElement('li');
    li.innerText = `${song.title} - ${song.artist}`;
    li.addEventListener('click', () => {
      currentSongIndex = index;
      loadSong(songs[currentSongIndex]);
      playSong();
    });
    songListElement.appendChild(li);
  });
}

// Audio visualizer using Web Audio API
function setupAudioVisualizer() {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
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
    let x = 0;
    
    for (let i = 0; i < bufferLength; i++) {
      const barHeight = dataArray[i];
      canvasCtx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
      canvasCtx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
      x += barWidth + 1;
    }
  }

  audioPlayer.onplay = () => {
    audioCtx.resume();
    draw();
  };
}

function setupRepeatButton() {
  const repeatBtn = document.getElementById('repeat-btn');
  repeatBtn.addEventListener('click', () => {
    isRepeating = !isRepeating; // Toggle repeat mode
    repeatBtn.classList.toggle('active', isRepeating);
    repeatBtn.innerText = isRepeating ? "Repeat On" : "Repeat Off"; // Update button text
  });
}

function setupOneTimePlayButton() {
  const oneTimePlayBtn = document.getElementById('one-time-play-btn');
  oneTimePlayBtn.addEventListener('click', () => {
    isOneTimePlay = !isOneTimePlay; // Toggle one-time play mode
    oneTimePlayBtn.classList.toggle('active', isOneTimePlay);
    oneTimePlayBtn.innerText = isOneTimePlay ? "One Time Play On" : "One Time Play Off"; // Update button text
  });
}
