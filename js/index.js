
//Global Variables
var audio, xCor = 0, songNameList;
var currentSong = '', currSongIndex, songsList, change, currentPosition = document.querySelector(".currentPosition"), difference, duration;

//Function which returns string in human readable format for displaying in playbar
function removeChar(str, charToRemove) {
    return str.replace(new RegExp(charToRemove, 'g'), ' ');
}

//Function to update Playbar
function updatePlaybar(coverImage, title) {
    let playbarsong = document.querySelector("#playBarSong");
    playbarsong.querySelector("img").src = coverImage
    playbarsong.querySelector(".name").innerHTML = title

}

//Function to play Audio file
function playCurrentSong() {
    try {
        audio.pause();
    }
    catch (e) {
        console.log("no current audio to play")
    }
    console.log(currentSong)
    audio = new Audio(currentSong);
    audio.addEventListener('loadedmetadata', function () {
        duration = audio.duration;
        console.log('Audio duration:', duration, 'seconds');
    });
    audio.load();
    audio.play();
    let playPause = document.querySelector(".pausePlay").querySelector("i")
    playPause.classList.remove("fa-play")
    playPause.classList.add("fa-pause")
    xCor = 0
}

//Function to Play Next song
const playNextSong = () => {
    let nextSong = songsList[currSongIndex + 1]
    currSongIndex += 1
    let songCover = nextSong.slice(0, -3) + "jpg"
    currentPosition.style.left = "0"
    let title = songNameList[currSongIndex]
    currentSong = nextSong
    updatePlaybar(songCover, title)
    playCurrentSong()
}

//Function to play Previous song
const playPreviousSong = () => {
    let nextSong = songsList[currSongIndex - 1]
    currSongIndex -= 1
    let songCover = nextSong.slice(0, -3) + "jpg"
    let title = removeChar(nextSong.slice(46, -4), '%20')
    currentSong = nextSong
    currentPosition.style.left = "0"
    updatePlaybar(songCover, title)
    playCurrentSong()
}

//Function to get Songs from directory
const getSongUrl = async (url) => {
    // let targetUrl = window.location.href;
    // let currentPageUrl = targetUrl.substring(0,targetUrl.indexOf("d/")+2)
    // console.log(currentPageUrl+" ketan here")
    let a = await fetch(url);
    let response = await a.text()
    // console.log(response)
    document.querySelector("#playlist").innerHTML = ""
    let div = document.createElement("div")
    div.innerHTML = response
    let aTags = div.querySelectorAll("a")
    let songs = []
    // console.log(aTags)
    aTags.forEach(async a => {
        if (a.href.endsWith(".mp3")) {
            // console.log(a.href)
            songs.push(a.href)
        }
    })
    songNameList = []
    songs.forEach((song, index) => {
        let songCover = song.slice(0, -3) + "jpg"
        let songHtml = `<div class="song flex items-center cursor-pointer hover:bg-black">
        <img class="m-2 h-10" src="${songCover}" alt="">
        <div class="songInfo text-white">
            <div class="name text-sm">${removeChar(song.slice(url.length + 1, -4), '%20')}</div>
            <div class="artistName text-xs">Ketan Agrawal</div>
        </div>
    </div>`
        songNameList.push(removeChar(song.slice(url.length + 1, -4), '%20'))
        let title = removeChar(song.slice(url.length + 1, -4), '%20')
        let div = document.createElement("div")
        div.innerHTML = songHtml;
        div.addEventListener("click", () => {
            currentSong = song;
            currSongIndex = index
            // console.log(index)
            playCurrentSong();
            updatePlaybar(songCover, title)
        })
        document.querySelector("#playlist").appendChild(div)
    })
    return songs
}

const loadPlaylistCards = async () => {
    let targetUrl = window.location.href;
    let currentPageUrl = targetUrl.substring(0, targetUrl.indexOf("d/") + 2)
    let playlistFloders = await fetch(currentPageUrl + "songs/")
    // console.log(playlistFloders.text())
    let response = await playlistFloders.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let aTags = div.querySelectorAll("a")
    let songsFolder = []
    // console.log(aTags)
    aTags.forEach(async a => {
        if (a.href.includes("/songs/")) {
            // console.log(a.href)
            let info = await fetch(a.href + "/info.json")
            let details = await info.json()
            // console.log(details)
            let iHtml = `<div
            class="card md:w-44 w-36 mr-1 mb-2 p-3 hover:bg-gray-800 hover:rounded cursor-pointer relative">
            <div class="relative">
                <img src="${a.href}/cover.jpg" class="rounded" alt="">
                <button class="p-2 m-2 bg-green-500 rounded-full absolute bottom-1 right-1 hidden"><img
                        src="img/play.svg" class="h-6" alt=""></button>
            </div>
            <div class="title text-lg font-semibold ">${details.title}</div>
            <div class="description text-[#a7a7a7] text-sm">${details.description}</div>
        </div>`

            let div = document.createElement("div")
            div.innerHTML = iHtml;
            document.querySelector(".card-container").append(div)
            div.addEventListener("click", () => {
                // console.log(a.href)
                getSongUrl(a.href)
                let button = document.getElementById("#hamburger");

                // Create a new click event
                let clickEvent = new Event("click");

                // Dispatch the click event on the button element
                button.dispatchEvent(clickEvent);
            })
        }
    })

}


//Main Function
const main = async () => {
    // console.log(await getSongUrl())

    let targetUrl = window.location.href;
    let currentPageUrl = targetUrl.substring(0, targetUrl.indexOf("d/") + 2)

    let playlists = await fetch(currentPageUrl + "songs/")
    // console.log(playlists.text())
    let response = await playlists.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let aTags = div.querySelectorAll("a")
    // console.log(Array.from(aTags))
    let URL = ''
    aTags.forEach(async a => {
        console.log(a.href)
        if (a.href.includes("/mp3%20files")) {
            URL = a.href
        }
    })
    songsList = await getSongUrl(URL)
    console.log(songsList)
}

(async function () {
    loadPlaylistCards()
    let a = await main()
    // console.log(a)
    console.log("ketan" + songsList)
    currentSong = songsList[0];
    currSongIndex = 0;
    let songCover = currentSong.slice(0, -3) + "jpg"
    let title = removeChar(currentSong.slice(currentSong.indexOf("les/") + 4, -4), '%20')

    updatePlaybar(songCover, title);

    let nextPlaySong = document.querySelector(".next").addEventListener("click", playNextSong)

    let previousPlaySong = document.querySelector(".previous").addEventListener("click", playPreviousSong)

    let playPause = document.querySelector(".pausePlay")

    playPause.addEventListener("click", () => {
        let button = playPause.querySelector("i")
        button.classList.toggle("fa-play")
        button.classList.toggle("fa-pause")

        if (button.classList.contains("fa-play")) {
            audio.pause()
        }
        else {
            if (audio == null) {
                playCurrentSong()
            }
            audio.play()
        }
    })

    let cards = document.querySelectorAll(".card")

    cards.forEach(card => {
        card.addEventListener("mouseenter", () => {
            card.querySelector("button").classList.toggle("hidden")
        })
        card.addEventListener("mouseleave", () => {
            card.querySelector("button").classList.toggle("hidden")
        })
    });


    currentPosition.style.transition = "left 0.1s ease-in "


    let line = document.querySelector(".line");
    line.addEventListener("click", (e) => {
        let offsetX = e.clientX - line.getBoundingClientRect().left;
        console.log(offsetX)

        currentPosition.style.left = offsetX + "px"
        xCor = offsetX
        // let offsetPercent = (offsetX/(line.getBoundingClientRect().right - line.getBoundingClientRect().left))*100
        // console.log(offsetPercent)
        audio.currentTime = offsetX / change
        updateTimestamp()
    })
    let left = document.querySelector(".left");
    let right = document.querySelector(".right");
    let close = document.querySelector("#close");
    close.addEventListener("click", () => {
        // close.classList.toggle("hidden")
        left.classList.toggle("hidden")
        right.classList.toggle("hidden")
    })


    let hamburger = document.querySelector("#hamburger");
    hamburger.addEventListener("click", () => {
        right.classList.toggle("hidden")
        left.classList.toggle("hidden")
    })

    let volumeInput = document.querySelector(".volume-range");
    let currentVolume = volumeInput.value;
    volumeInput.addEventListener("input", e => {
        // console.log(volumeInput.value)
        // if(volumeInput.value==0){
        //     volumebtn.classList.toggle("fa-volume-high")
        // }
        // else{
        // volumebtn.classList.toggle("fa-volume-xmark")
        if (volumeInput.value < 50) {
            if (volumebtn.classList.contains("fa-volume-high")) {
                volumebtn.classList.toggle("fa-volume-high")
                volumebtn.classList.toggle("fa-volume-low")
                console.log("low")
            }
        }
        else {
            if (volumebtn.classList.contains("fa-volume-low")) {
                volumebtn.classList.toggle("fa-volume-low")
                volumebtn.classList.toggle("fa-volume-high")
                console.log("high")
            }
        }
        // }
        currentVolume = volumeInput.value
        audio.volume = parseInt(volumeInput.value) / 100

    })
    let volumebtn = document.querySelector(".volume")
    volumebtn.addEventListener("click", () => {
        if (volumebtn.classList.contains("fa-volume-high")) {
            volumeInput.value = 0
        }
        else {
            volumeInput.value = currentVolume
        }
        volumebtn.classList.toggle("fa-volume-xmark")
        volumebtn.classList.toggle("fa-volume-high")
    })


})()


//Function to update Timestamp when the song is being played
function updateTimestamp() {
    let timestamp = document.querySelector(".timestamp");
    let timestampfinalSeconds = (Math.floor(audio.duration % 60))
    let timestampCurrentSeconds = (Math.floor(audio.currentTime % 60))
    if (timestampfinalSeconds < 10) {
        timestampfinalSeconds = "0" + timestampfinalSeconds;
    }
    if (timestampCurrentSeconds < 10) {
        timestampCurrentSeconds = "0" + timestampCurrentSeconds;
    }
    let timestampString = "" + (Math.floor(audio.currentTime / 60)) + ":" + timestampCurrentSeconds + " / " + (Math.floor(audio.duration / 60)) + ":" + timestampfinalSeconds;
    timestamp.innerHTML = timestampString
}


//setInterval is used to perform task like update seekbar
setInterval(() => {
    if (audio) {
        // audio.load();

        if (audio.currentTime == audio.duration) {
            playNextSong()
        }
        if (!audio.paused) {
            // console.log("translate")
            updateTimestamp()
            // currentPosition.classList.remove(leftProperty)
            let line = document.querySelector(".line")
            let left = line.getBoundingClientRect().left;
            let right = line.getBoundingClientRect().right - 16;
            let difference = right - left;
            if (audio.duration != NaN) {
                change = difference / duration
                xCor += change
                // console.log(xCor)
                currentPosition.style.left = xCor + "px"
                // currentPosition.style.left = (audio.currentTime/ audio.duration) * 100 + "%"
                // currentPosition.style.left = currentPosition.style.left
                // console.log(currentPosition.style.left)
                // console.log("print")
            }
        }
    }
}, 1000);



