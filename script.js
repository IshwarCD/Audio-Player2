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

// Playlist of songs
const songs = [
  { title: "Song 1", artist: "Artist 1", cover: "cover1.jpg", src: "songs/song1.mp3" },
  { title: "Song 2", artist: "Artist 2", cover: "cover2.jpg", src: "songs/song2.mp3" },
  { title: "Song 3", artist: "Artist 3", cover: "cover3.jpg", src: "songs/song3.mp3" }
];

let currentSongIndex = 0;

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
}

function pauseSong() {
  audioPlayer.pause();
  playBtn.innerText = "Play";
}

playBtn.addEventListener('click', () => {
  if (audioPlayer.paused) {
    playSong();
  } else {
    pauseSong();
  }
});

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
