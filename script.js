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

    document.querySelector(".songList")
    //Play the first song
    const audio = new Audio(songs[0]);
}

main();