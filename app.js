const musicPlayer = document.querySelector('.music__player');
const playBtn = document.querySelector('#play');
const prevBtn = document.querySelector('#prev');
const nextBtn = document.querySelector('#next');
const audio = document.querySelector('#audio');

const progressContainer = document.querySelector('.music__player--progress');
const progress = document.querySelector('.progress');

const audioTitle = document.querySelector('.music__title');
const audioImage = document.querySelector('.music__img');

const speedIndicator = document.querySelector('.speed');
const speedNumber = document.querySelector('.speed p');
const speedOptions = [1.0, 1.5, 2.0, 0.75];
let speedIndex = 0;

function loadSongs(song){
    audioTitle.innerText = song.title;
    audio.src = `${song.audio}`;
    audioImage.style.backgroundImage = `url('${song.cover}')`;
}

function isAudioPlaying(){
    return musicPlayer.classList.contains('playing');
}

function playAudio(){
    musicPlayer.classList.add('playing');
    playBtn.querySelector('i').classList.remove('ph-play');
    playBtn.querySelector('i').classList.add('ph-pause');
    audio.playbackRate = `${speedOptions[speedIndex]}`;
    audio.play();
}

function pauseAudio(){
    musicPlayer.classList.remove('playing');
    playBtn.querySelector('i').classList.remove('ph-pause');
    playBtn.querySelector('i').classList.add('ph-play');
    audio.pause();
}

function prevSong(){
    songIndex = songIndexTemp;
    if(songIndex < 0){
        songIndex = songs.length - 1
    }
    loadSongs(songs[songIndex]);
    progress.style.width = '0%';
    isAudioPlaying() === true ? playAudio() : pauseAudio();
}

function nextSong(){
    songIndexTemp = songIndex;
    songIndex = getRandomIndex(songs.length - 1);
    while(songIndex === songIndexTemp){
        songIndex = getRandomIndex(songs.length - 1);
    }
    console.log(songIndex)
    if(songIndex < 0){
        songIndex = songs.length - 1
    }
    loadSongs(songs[songIndex]);
    progress.style.width = '0%';
    isAudioPlaying() === true ? playAudio() : pauseAudio();
}

function getRandomIndex(max) {
    songIndex = 0;
    return Math.floor(Math.random() * max);
  }

let songs;
let songIndex = 0;
let songIndexTemp = 0;

async function retrieveSongFromServer(){
    await fetch('audio.json')
        .then((response) => {
            if(!response.ok){
                throw new Error('Ошибка загрузки списка треков');
            }
            return response.json();
        })
        .then((data) => {
            songs = data.songs;
            loadSongs(songs[songIndex]);
        })
        .catch((error) => {
            console.error('Не получилось извлечь файл треков:', error);
        });
}

retrieveSongFromServer();

function updateProgressBarPlayPosition(e){
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const { duration } = audio;
    audio.currentTime = (clickX / width) * duration;
}

function updateProgressBar(e){
    const{ duration, currentTime} = e.srcElement;
    const progressPercentage = (currentTime / duration) * 100;
    progress.style.width = `${progressPercentage}%`;
    console.log(progressPercentage);
    if(progressPercentage == 100){
        nextSong();
    }
}

function updateSpeedIndicator() {
    speedIndex += 1;
    if (speedIndex > speedOptions.length - 1) {
        speedIndex = 0;
    }
    speedNumber.textContent = `${speedOptions[speedIndex]}x`;
    playAudio();
}

playBtn.addEventListener('click', () => {
    isAudioPlaying() ? pauseAudio(): playAudio();
});

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

speedIndicator.addEventListener('click', updateSpeedIndicator);

audio.addEventListener('timeupdate', updateProgressBar);

progressContainer.addEventListener('click', updateProgressBarPlayPosition);