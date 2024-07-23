const songNames = ["Arp-Space","Collidescope","Morax Unlocked","Movie Tickets","Hey","Summer","Ukulele","Acoustic Electronic","Drop Play","Random Thoughts","Trygve Larsen"]

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
    
    for(let song of songNames){
        songUL.innerHTML = songUL.innerHTML + `<li class="songListItem">
                            <img class="invert p-2" src="images/music.svg" alt="music">  
                            <div class="info">
                                <div>${song}</div>
                            </div>
                            <div class="playNow p-2">
                                <img class="invert" src="images/play.svg" alt="play">
                            </div>                             
                        </li>`;
        console.log(song);  
    }
    //Play the first song
    const audio = new Audio(songs[0]);
}

main();