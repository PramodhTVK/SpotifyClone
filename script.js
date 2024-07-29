const songNames = ["Arp-Space","Collidescope","Morax Unlocked","Movie Tickets","Hey","Summer","Ukulele","Acoustic Electronic","Drop Play","Random Thoughts","Trygve Larsen"];
const nowPlaying = new Audio();
let isPlaying = false;
let firstHit = 0;
let songs = [];
let currID;
let startIndex = 0;
let endIndex = songNames.length - 1;

const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("previous");
const songName = document.querySelector(".topPanel").getElementsByClassName("songinfo")[0];
const songDuration = document.querySelector(".topPanel").getElementsByClassName("songtime")[0];
const seekbar = document.querySelector(".seekbar");
const heading = document.querySelector(".heading");


async function getSongs(){
    const a = await fetch("http://127.0.0.1:5500/songs/");
    const response = await a.text();
    const div = document.createElement("div");
    div.innerHTML = response;
    const lis = div.getElementsByTagName("li");
    const songs = [];

    for(li of lis){
        if(li.firstChild.href.endsWith(".mp3")){
            songs.push(li.firstChild.href);
        }
    }
    
    return songs;
}

const updateLibrary = (songs, indices) => {
    const songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];

    songUL.innerHTML = '';

    songs.forEach((song, index) => {
        let songIndex = index;
        if (indices && indices.length > 0) {
            songIndex = indices[index];
        }
        songUL.innerHTML += 
            `<li class="songListItem">
                <img class="invert p-2" src="images/music.svg" alt="music">  
                <div class="info">
                    <div>${song}</div>
                </div>
                <div class="playNow p-2" id="${songIndex}">
                    <img class="invert" src="images/play.svg" alt="play">
                </div>                             
            </li>`;
        console.log(song, songIndex);
    });
};

const handleNextClick = () => {
    let newID = currID < endIndex ? currID + 1 : startIndex;
    const prevDiv = document.getElementById(currID);
    if (prevDiv) {
        prevDiv.querySelector("img").src = "images/play.svg";
    }

    currID = newID;
    const audio = new Audio(songs[currID]);
    playMusic(audio);

    const newDiv = document.getElementById(currID);
    if (newDiv) {
        newDiv.querySelector("img").src = "images/pause.svg";
    }
    
    playBtn.setAttribute("src", "images/pause.svg");
    updateSongInfo(songName, songDuration, currID);
    firstHit = true;
}

const handlePrevClick = () => {
    let newID = currID > startIndex ? currID - 1 : endIndex;
    const prevDiv = document.getElementById(currID);
    if (prevDiv) {
        prevDiv.querySelector("img").src = "images/play.svg";
    }

    currID = newID;
    const audio = new Audio(songs[currID]);
    playMusic(audio);

    const newDiv = document.getElementById(currID);
    if (newDiv) {
        newDiv.querySelector("img").src = "images/pause.svg";
    }
    
    playBtn.setAttribute("src", "images/pause.svg");
    updateSongInfo(songName, songDuration, currID);
    firstHit = true;
}

const handlePlayClick = () => {
    const currDiv = document.getElementById(currID);
    if (currDiv) {
        const child = currDiv.querySelector("img");
        if (isPlaying) {
            nowPlaying.pause();
            playBtn.setAttribute("src", "images/play.svg");
            child.src = "images/play.svg";
            isPlaying = false;
            firstHit = false;
        } else if (!isPlaying && !firstHit) {
            nowPlaying.play();
            playBtn.setAttribute("src", "images/pause.svg");
            child.src = "images/pause.svg";
            isPlaying = true;
        } else {
            const audio = new Audio(songs[currID]);
            playMusic(audio);
            playBtn.setAttribute("src", "images/pause.svg");
            child.src = "images/pause.svg";
            isPlaying = true;
            firstHit = true;
        }
    }
}


const updateLibraryContainer = (newSongs,songNames,newStartIndex,newEndIndex) => {
    const libraryContainer = document.querySelector(".songList").getElementsByClassName("playNow");
    console.log(libraryContainer);
    console.log(songs,songNames,startIndex,endIndex);  
    currID = newStartIndex;
    startIndex = newStartIndex;
    endIndex = newEndIndex;
    songs = newSongs;
    for(let ele of libraryContainer){
        ele.addEventListener("click",() => {
            // console.log(ele.id);
            if(isPlaying){
                if(currID === parseInt(ele.id) && firstHit){
                    console.log("1")
                    nowPlaying.pause();
                    ele.querySelector("img").src = "images/play.svg";
                    playBtn.setAttribute("src","images/play.svg");
                    isPlaying = false;
                    seekbar.style.opacity = 1;
                    seekbar.style.cursor = "pointer";
                }
                else{
                    console.log("2")
                    const prevDiv = document.getElementById(currID);
                    prevDiv.querySelector("img").src = "images/play.svg";
                    currID = parseInt(ele.id);
                    const audio = new Audio(songs[ele.id]);
                    playMusic(audio);
                    ele.querySelector("img").src = "images/pause.svg";
                    playBtn.setAttribute("src","images/pause.svg");
                    updateSongInfo(songName,songDuration,currID);
                    seekbar.style.opacity = 1;
                    seekbar.style.cursor = "pointer";
                    firstHit = 1;
                }
            }
            else{
                if(!firstHit || currID !== parseInt(ele.id)){
                    console.log("3")
                    currID = parseInt(ele.id);
                    const audio = new Audio(songs[ele.id]);
                    playMusic(audio);
                    ele.querySelector("img").src = "images/pause.svg";
                    playBtn.setAttribute("src","images/pause.svg");
                    updateSongInfo(songName,songDuration,currID);
                    seekbar.style.opacity = 1;
                    seekbar.style.cursor = "pointer";
                    firstHit = 1;
                }
                else{
                    console.log("4")
                    nowPlaying.play();
                    ele.querySelector("img").src = "images/pause.svg";
                    playBtn.setAttribute("src","images/pause.svg");
                    isPlaying = true;
                }
            }

        })
    }

    console.log(parseInt(currID))

}

async function getAlbumSongs(matchingString){
    const a = await fetch(`http://127.0.0.1:5500/albums/${matchingString}`);
    const response = await a.text();
    const div = document.createElement("div");
    div.innerHTML = response;
    const lis = div.getElementsByTagName("li");
    const songs = [];

    for(li of lis){
        if(li.firstChild.href.endsWith(".mp3") || li.firstChild.href.endsWith(".json")){
            songs.push(li.firstChild.href);
        }
    }

    return songs;
}

async function songFiller(matchingString){
    const songs = await getAlbumSongs(matchingString);
    const songFiles = [];
    let info = ""; 
    
    for(let song of songs){
        if(song.endsWith(".json")){
            info = song;
        }
        if(song.endsWith(".mp3")){
            songFiles.push(song);
        }
    }

    const a = await fetch(info);
    const response = await a.json();
    console.log(response.indices);
    const filteredSongs = songNames.filter((ele, index) => response.indices.includes(index));
    console.log(filteredSongs);
    
    return{
        filteredSongs: filteredSongs,
        songs: songFiles,
        indices: response.indices
    }
}


async function main() {
    const songs = await getSongs();
    console.log(songs);

    updateLibrary(songNames);
    updateLibraryContainer(songs,songNames,0,songNames.length - 1);

    nextBtn.addEventListener("click", handleNextClick);
    prevBtn.addEventListener("click", handlePrevClick);
    playBtn.addEventListener("click", handlePlayClick);

    const cardContainer = document.querySelector(".cardContainer");
    const cards = cardContainer.querySelectorAll(".card");
    
    cards.forEach((card) => {
        card.addEventListener("click",async () => {
            heading.getElementsByTagName("h2")[0].innerText = card.getElementsByTagName("h2")[0].innerText;
            const matchingString = card.getElementsByTagName("h2")[0].innerText.replace(/[!\s]/g, '').toLowerCase();
            const {filteredSongs,indices} = await songFiller(matchingString);
            updateLibrary(filteredSongs,indices); 
            console.log("Filtered Songs:", filteredSongs);
            console.log("All Songs:", songs);
            console.log("Indices:", indices);
            isPlaying = false;
            firstHit = 0;
            updateLibraryContainer(songs,filteredSongs,indices[0],indices[indices.length - 1]);
        })
    })

    const seekbar = document.querySelector(".seekbar");
    const heading = document.querySelector(".heading");

    nowPlaying.addEventListener("timeupdate", () => {
        const songDuration = document.querySelector(".topPanel").getElementsByClassName("songtime")[0];
        const duration = nowPlaying.duration;
        const currentTime = nowPlaying.currentTime;

        if (isNaN(duration)) {
            songDuration.innerHTML = "00:00 / 00:00";
            return;
        }
        
        const minutes = Math.floor(currentTime / 60).toString().padStart(2, '0');
        const seconds = Math.floor(currentTime % 60).toString().padStart(2, '0');
        
        const totalMinutes = Math.floor(duration / 60).toString().padStart(2, '0');
        const totalSeconds = Math.floor(duration % 60).toString().padStart(2, '0');

        const circle = document.querySelector(".circle");
        
        songDuration.innerHTML = `${minutes}:${seconds} / ${totalMinutes}:${totalSeconds}`;
        circle.style.left = (currentTime / duration) * 100 + "%";
    });

    nowPlaying.addEventListener("ended", handleSongEnd);
    
    seekbar.addEventListener("click", (e) => {
        const offSet = e.offsetX;
        const totalWidth = e.target.getBoundingClientRect().width;
        const percentage = (offSet / totalWidth) * 100;
        document.querySelector(".circle").style.left = percentage + "%";
        nowPlaying.currentTime = (percentage / 100) * nowPlaying.duration;
    });
}

function handleSongEnd() {
    handleNextClick();
}

const updateSongInfo = (songName,songDuration,currID) => {
    songName.innerHTML = songNames[currID];
    songDuration.innerHTML = "00:00 / 00:00";
}

const playMusic = (audio) => {
    if(!nowPlaying.paused){
        nowPlaying.pause();
    }
    nowPlaying.src = audio.src;
    isPlaying = true;
    nowPlaying.play();
}

main();