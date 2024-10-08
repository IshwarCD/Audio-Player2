// Countdown Timer Logic
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minsEl = document.getElementById("mins");
const secEl = document.getElementById("sec");

const newYear = new Date('Jan 1, 2025 00:00:00').getTime();

function countdown() {
    const currentDate = new Date().getTime();
    const totalSeconds = (newYear - currentDate) / 1000;

    const days = Math.floor(totalSeconds / 3600 / 24);
    const hours = Math.floor((totalSeconds / 3600) % 24);
    const mins = Math.floor((totalSeconds / 60) % 60);
    const seconds = Math.floor(totalSeconds % 60);

    daysEl.innerHTML = formatTime(days);
    hoursEl.innerHTML = formatTime(hours);
    minsEl.innerHTML = formatTime(mins);
    secEl.innerHTML = formatTime(seconds);
}

function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

countdown();
setInterval(countdown, 1000);


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
  { title: "Sochta Hoon Keh Woh", artist: "Nusrat Fateh Ali Khan", cover: "images/cover1.jpg", src: "songs/song1.mp3" },
  { title: "Jhalak Dikhla Ja", artist: "Sameer and Himesh Reshammiya", cover: "images/cover2.jpg", src: "songs/song2.mp3" },
  { title: "Woofer (S&R)", artist: "Dr. Zeus", cover: "images/cover3.jpg", src: "songs/song3.mp3" },
  { title: "Chammak Challo", artist: "Akon and Hamsika Iyer", cover: "images/cover4.jpg", src: "songs/song4.mp3" },
  { title: "Chinta Ta Ta Chita Chita", artist: "Mika Singh, Wajid Ali, and Sajid Khan", cover: "images/cover5.jpg", src: "songs/song5.mp3" },
  { title: "Mere Rashke Qamar", artist: "Nusrat Fateh Ali Khan", cover: "images/cover6.jpg", src: "songs/song6.mp3" },
  { title: "Aaja We Mahiya", artist: "imran khan", cover: "images/cover7.jpg", src: "songs/song7.mp3" },
  { title: "DJ Wale Babu", artist: "Aastha Gill, Neelesh P, and Badshah", cover: "images/cover8.jpg", src: "songs/song8.mp3" },
  { title: "Desi Desi Na Bolya Kar", artist: "Raju Punjabi", cover: "images/cover9.jpg", src: "songs/song9.mp3" },
  { title: "Daru Badnaam", artist: "Param Singh, Kamal Kahlon", cover: "images/cover10.jpg", src: "songs/song10.mp3" }
];

// Load the first song initially
loadSong(songs[currentSongIndex]);

// Populate the song list dynamically
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

// Play/Pause Button
playBtn.addEventListener('click', () => {
  if (audioPlayer.paused) {
    playSong();
  } else {
    pauseSong();
  }
});

// Next and Previous Song Buttons
nextBtn.addEventListener('click', () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(songs[currentSongIndex]);
  playSong();
});

prevBtn.addEventListener('click', () => {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(songs[currentSongIndex]);
  playSong();
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

// Toggle song list visibility
songListBtn.addEventListener('click', () => {
  songListContainer.style.display = songListContainer.style.display === 'none' ? 'block' : 'none';
});

// Audio visualizer using Web Audio API
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

// Repeat and One Time Play buttons setup
setupRepeatButton();
setupOneTimePlayButton();

function setupRepeatButton() {
  const repeatBtn = document.getElementById('repeat-btn');

  repeatBtn.addEventListener('click', () => {
    isRepeating = !isRepeating;
    repeatBtn.classList.toggle('active', isRepeating);
    repeatBtn.innerText = isRepeating ? "Repeat: On" : "Repeat: Off"; // Update button text
  });
}

function setupOneTimePlayButton() {
  const oneTimePlayBtn = document.getElementById('one-time-play-btn');

  oneTimePlayBtn.addEventListener('click', () => {
    isOneTimePlay = !isOneTimePlay;
    oneTimePlayBtn.classList.toggle('active', isOneTimePlay);
    oneTimePlayBtn.innerText = isOneTimePlay ? "One Time Play: On" : "One Time Play: Off"; // Update button text
  });
}

// Automatically play next song or handle repeat/one-time play
audioPlayer.addEventListener('ended', handleSongEnd);

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

function playNextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(songs[currentSongIndex]);
  playSong();
}
