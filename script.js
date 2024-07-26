const songNames = ["Arp-Space","Collidescope","Morax Unlocked","Movie Tickets","Hey","Summer","Ukulele","Acoustic Electronic","Drop Play","Random Thoughts","Trygve Larsen"];
const nowPlaying = new Audio();
let isPlaying = false;
let firstHit = 0;
let currID = 0;
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("previous");

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

async function main() {
    const songs = await getSongs();
    console.log(songs);

    const songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    
    songNames.forEach((song,index) => {
        songUL.innerHTML = songUL.innerHTML + 
                        `<li class="songListItem">
                            <img class="invert p-2" src="images/music.svg" alt="music">  
                            <div class="info">
                                <div>${song}</div>
                            </div>
                            <div class="playNow p-2" id="${index}">
                                <img class="invert" src="images/play.svg" alt="play">
                            </div>                             
                        </li>`;
        console.log(song,index);  
    });

    const libraryContainer = document.querySelector(".songList").getElementsByClassName("playNow");
    const songName = document.querySelector(".topPanel").getElementsByClassName("songinfo")[0];
    const songDuration = document.querySelector(".topPanel").getElementsByClassName("songtime")[0];

    for(let ele of libraryContainer){
        ele.addEventListener("click",() => {
            if(isPlaying && currID !== ele.id){
                nowPlaying.pause();
                const audio = new Audio(songs[ele.id]);
                playMusic(audio);
                console.log()
                const prevDiv = document.getElementById(currID);
                prevDiv.querySelector("img").src = "images/play.svg";
                ele.querySelector("img").src = "images/pause.svg";
                playBtn.setAttribute("src","images/pause.svg");
                currID = ele.id;
                updateSongInfo(songName,songDuration);
                firstHit = 1;
            }
            else if(isPlaying && currID === ele.id){
                nowPlaying.pause();
                ele.querySelector("img").src = "images/play.svg";
                playBtn.setAttribute("src","images/play.svg");
                isPlaying = false;
                firstHit = 0;
            }
            else if(!isPlaying && !firstHit && currID !== ele.id){
                const audio = new Audio(songs[ele.id]);
                ele.querySelector("img").src = "images/pause.svg";
                playBtn.setAttribute("src","images/pause.svg");
                currID = ele.id;
                updateSongInfo(songName,songDuration);
                playMusic(audio);
                firstHit = 1;
            }
            else{
                nowPlaying.play();
                ele.querySelector("img").src = "images/pause.svg";
                playBtn.setAttribute("src","images/pause.svg");
                isPlaying = true;
            }

        })
    }

    nextBtn.addEventListener("click",() => {
        const currDiv = document.getElementById(currID);
        const child = currDiv.querySelector("img");
        child.src = "images/play.svg";

        if(currID < songNames.length - 1){
            const audio = new Audio(songs[currID + 1]);
            playMusic(audio);
            currID = currID + 1;
        }
        else{
            const audio = new Audio(songs[0]);
            playMusic(audio);
            currID = 0;
        }

        const newDiv = document.getElementById(currID);
        const newChild = newDiv.querySelector("img");
        newChild.src = "images/pause.svg";
        updateSongInfo(songName,songDuration);

        firstHit = 1;
        playBtn.setAttribute("src","images/pause.svg");
    })

    prevBtn.addEventListener("click",() => {
        const currDiv = document.getElementById(currID);
        const child = currDiv.querySelector("img");
        child.src = "images/play.svg";

        if(currID > 0){
            const audio = new Audio(songs[currID - 1]);
            playMusic(audio);
            currID = currID - 1;
        }
        else{
            const audio = new Audio(songs[songs.length - 1]);
            playMusic(audio);
            currID = songs.length - 1;
        }

        const newDiv = document.getElementById(currID);
        const newChild = newDiv.querySelector("img");
        newChild.src = "images/pause.svg";
        updateSongInfo(songName,songDuration);

        firstHit = 1;
        playBtn.setAttribute("src","images/pause.svg");
    })

    playBtn.addEventListener("click",() => {
        const currDiv = document.getElementById(currID);
        const child = currDiv.querySelector("img");

        if(isPlaying){
            nowPlaying.pause();
            playBtn.setAttribute("src","images/play.svg");
            child.src = "images/play.svg";
            isPlaying = false;
            firstHit = 0;
        }
        else if(!isPlaying && !firstHit){
            nowPlaying.play();
            playBtn.setAttribute("src","images/pause.svg");
            child.src = "images/pause.svg";
            isPlaying = true;
        } 
        else{
            const audio = new Audio(songs[currID]);
            playMusic(audio);
            playBtn.setAttribute("src","images/pause.svg");
            child.src = "images/pause.svg";
            isPlaying = true;
            firstHit = 1;
        }
    })

    nowPlaying.addEventListener("timeupdate", () => {
        const duration = nowPlaying.duration;
        const currentTime = nowPlaying.currentTime;
        
        const minutes = Math.floor(currentTime / 60).toString().padStart(2, '0');
        const seconds = Math.floor(currentTime % 60).toString().padStart(2, '0');
        
        const totalMinutes = Math.floor(duration / 60).toString().padStart(2, '0');
        const totalSeconds = Math.floor(duration % 60).toString().padStart(2, '0');
        
        songDuration.innerHTML = `${minutes}:${seconds} / ${totalMinutes}:${totalSeconds}`;
    });
    
}

const updateSongInfo = (songName,songDuration) => {
    songName.innerHTML = songNames[currID];
    songDuration.innerHTML = "00:00 / 00:00";
}

const playMusic = (audio) => {
    nowPlaying.src = audio.src;
    isPlaying = true;
    nowPlaying.play();
}

main();
