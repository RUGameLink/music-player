const musicPlayer = document.querySelector('.musik__player');
const playBtn = document.querySelector('#play');
const prevBtn = document.querySelector('#prev');
const nextBtn = document.querySelector('#next');
const audio = document.querySelector('#audio');

const audioTitle = document.querySelector('.music__title');
const audioImage = document.querySelector('.music__image');

function loadSongs(song){
    audioTitle.innerText = song.title;
    audio.src = `${song.audio}`;
    audioImage.style.backgroundImage = `url('${song.cover}')`;
}

let songs;
const songIndex = 0;

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