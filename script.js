const songs = [
{ name: "music10.mp3", title: "Sunrise", artist: "LoFi Chill", cover: "img1.jpg", genre: "LoFi", moods: ["chill"], duration: "3:15" },
{ name: "music12.mp3", title: "Rainy Days", artist: "LoFi Beats", cover: "img2.jpg", genre: "LoFi", moods: ["calm"], duration: "4:05" },
{ name: "music3.mp3", title: "Night Drive", artist: "Synthwave", cover: "img3.jpg", genre: "Synthwave", moods: ["epic"], duration: "5:10" },
{ name: "music4.mp3", title: "Ocean Breeze", artist: "Chillhop", cover: "img4.jpg", genre: "Chillhop", moods: ["relax"], duration: "3:45" },
{ name: "music5.mp3", title: "City Lights", artist: "Downtempo", cover: "img5.jpg", genre: "Downtempo", moods: ["cool"], duration: "4:20" },
{ name: "music6.mp3", title: "Midnight Walk", artist: "LoFi Chill", cover: "img6.jpg", genre: "LoFi", moods: ["calm"], duration: "3:50" },
{ name: "music7.mp3", title: "Sunset Drive", artist: "Synthwave", cover: "img7.jpg", genre: "Synthwave", moods: ["epic"], duration: "4:45" },
{ name: "music8.mp3", title: "Rainforest", artist: "Ambient", cover: "img8.jpg", genre: "Ambient", moods: ["relax"], duration: "6:00" },
{ name: "music9.mp3", title: "Morning Coffee", artist: "Jazzhop", cover: "img9.jpg", genre: "Jazzhop", moods: ["happy"], duration: "3:30" },
{ name: "music10.mp3", title: "Electric Night", artist: "Electro", cover: "img10.jpg", genre: "Electro", moods: ["energetic"], duration: "4:55" },
{ name: "music11.mp3", title: "Deep Thoughts", artist: "Ambient", cover: "img11.jpg", genre: "Ambient", moods: ["calm"], duration: "5:20" },
{ name: "music12.mp3", title: "Late Night", artist: "LoFi Chill", cover: "img12.jpg", genre: "LoFi", moods: ["chill"], duration: "4:10" },
{ name: "music13.mp3", title: "Beach Vibes", artist: "Reggae", cover: "img13.jpg", genre: "Reggae", moods: ["happy"], duration: "3:40" },
{ name: "music14.mp3", title: "Cosmic Rays", artist: "Synthwave", cover: "img14.jpg", genre: "Synthwave", moods: ["epic"], duration: "5:00" },
{ name: "music15.mp3", title: "Chill Nights", artist: "Chillhop", cover: "img15.jpg", genre: "Chillhop", moods: ["relax"], duration: "3:55" },
];

const grid = document.getElementById('music-grid');
const globalCover = document.getElementById('global-cover');
const globalTitle = document.getElementById('global-title');
const globalArtist = document.getElementById('global-artist');
const genreEl = document.getElementById('song-genre');
const moodEl = document.getElementById('song-moods');
const durationEl = document.getElementById('song-duration');

const globalPlayBtn = document.getElementById('global-play');
const globalNextBtn = document.getElementById('global-next');
const globalPrevBtn = document.getElementById('global-prev');
const globalProgress = document.getElementById('global-progress');
const globalVolume = document.getElementById('global-volume');

const likeBtn = document.getElementById('like-btn');
const bookmarkBtn = document.getElementById('bookmark-btn');
const downloadBtn = document.getElementById('download-btn');
const themeToggleBtn = document.getElementById('theme-toggle');

const currentTimeEl = document.getElementById('current-time');
const totalDurationEl = document.getElementById('total-duration');

let currentIndex = 0;
let isPlaying = false;

const audio = new Audio();
audio.volume = 0.5;

// Render music cards
function createCard(song, index) {
    const card = document.createElement('div');
    card.className = 'music-card';

    const img = document.createElement('img');
    img.src = `images/${song.cover}`;
    img.alt = `${song.title} cover`;

    const info = document.createElement('div');
    info.className = 'card-info';
    info.innerHTML = `
    <h4>${song.title}</h4>
    <p>${song.artist}</p>
`;

    card.onclick = () => {
    playSong(index);
};

    card.appendChild(img);
    card.appendChild(info);
    grid.appendChild(card);
}

// Render all cards
function renderGrid() {
    grid.innerHTML = '';
    songs.forEach((song, i) => createCard(song, i));
}

// Update bottom bar info
function updateBottomBar(song) {
    globalCover.src = `images/${song.cover}`;
    globalTitle.textContent = song.title;
    globalArtist.textContent = song.artist;
    genreEl.textContent = song.genre;
    moodEl.textContent = song.moods.join(", ") || "-";
    durationEl.textContent = song.duration;

    downloadBtn.onclick = () => {
    const a = document.createElement("a");
    a.href = `musics/${song.name}`;
    a.download = song.name;
    a.click();
};
}

// Highlight current song
function highlightCurrentSong() {
    const cards = document.querySelectorAll('.music-card');
    cards.forEach((card, idx) => {
    card.classList.toggle('active', idx === currentIndex);
});
}

// Play song
function playSong(index) {
    if (index < 0 || index >= songs.length) return;

    currentIndex = index;
    audio.src = `musics/${songs[currentIndex].name}`;
    audio.load();

    audio.play().then(() => {
    isPlaying = true;
    updatePlayButton();
    updateBottomBar(songs[currentIndex]);
    highlightCurrentSong();
}).catch(console.error);
}

// Pause
function pauseSong() {
    audio.pause();
    isPlaying = false;
    updatePlayButton();
}

// Toggle play
function togglePlayPause() {
    if (!audio.src) {
    playSong(currentIndex);
    return;
}

    if (audio.paused) {
    audio.play();
    isPlaying = true;
} else {
    pauseSong();
}
    updatePlayButton();
}

// Update play icon
function updatePlayButton() {
    globalPlayBtn.textContent = isPlaying ? '⏸️' : '▶️';
}

// Next/Previous
function playNext() {
    currentIndex = (currentIndex + 1) % songs.length;
    playSong(currentIndex);
}

function playPrev() {
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    playSong(currentIndex);
}

// Format time mm:ss
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60) || 0;
    const secs = Math.floor(seconds % 60) || 0;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Time tracking
function updateProgress() {
    if (audio.duration) {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    globalProgress.value = progressPercent;
    currentTimeEl.textContent = formatTime(audio.currentTime);
}
}

function seekAudio() {
    if (audio.duration) {
    const seekTo = (globalProgress.value / 100) * audio.duration;
    audio.currentTime = seekTo;
}
}

function changeVolume() {
    const volume = parseFloat(globalVolume.value);
    audio.volume = volume;
}

// Event listeners
function setupEventListeners() {
    globalPlayBtn.addEventListener('click', togglePlayPause);
    globalNextBtn.addEventListener('click', playNext);
    globalPrevBtn.addEventListener('click', playPrev);
    globalProgress.addEventListener('input', seekAudio);
    globalVolume.addEventListener('input', changeVolume);

    audio.addEventListener('loadedmetadata', () => {
    totalDurationEl.textContent = formatTime(audio.duration);
});

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', playNext);

    likeBtn.addEventListener('click', () => {
    alert(`You liked "${songs[currentIndex].title}"!`);
});

    bookmarkBtn.addEventListener('click', () => {
    alert(`You bookmarked "${songs[currentIndex].title}"!`);
});

    themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light');
    themeToggleBtn.textContent = document.body.classList.contains('light') ? '🌙' : '🌞';
});
}

// Init app
function init() {
    renderGrid();
    updateBottomBar(songs[currentIndex]);
    highlightCurrentSong();
    setupEventListeners();

    audio.volume = 0.5;
    globalVolume.value = 0.5;
    globalProgress.value = 0;
    updatePlayButton();
}

init();
