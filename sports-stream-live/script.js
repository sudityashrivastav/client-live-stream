async function getCID(eventId) {

    const res = await fetch(`https://get-channelid.vercel.app/cid?eventid=${eventId}`)
    const data = await res.json()

    if (data.eid) {
        return data.eid
    }

    document.body.innerHTML =  `<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/><path d="M250.26 166.05L256 288l5.73-121.95a5.74 5.74 0 00-5.79-6h0a5.74 5.74 0 00-5.68 6z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><path d="M256 367.91a20 20 0 1120-20 20 20 0 01-20 20z"/></svg>`
    return false
}

async function baseFunction() {
    const mainVideoSRC = document.getElementById("main-video-source")

    const searchParams = new URLSearchParams(window.location.search);

    const myeid = searchParams.get("eventid")

    if (!myeid) {
        document.body.innerHTML =  `<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/><path d="M250.26 166.05L256 288l5.73-121.95a5.74 5.74 0 00-5.79-6h0a5.74 5.74 0 00-5.68 6z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><path d="M256 367.91a20 20 0 1120-20 20 20 0 01-20 20z"/></svg>`
        return
    }

    const streamURL = await getCID(myeid)

    if (streamURL) {
        mainVideoSRC.src = "https://sports.hr08bets.in/m3u8-proxy?cid=" + streamURL
    } else {     
         document.body.innerHTML =  `<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/><path d="M250.26 166.05L256 288l5.73-121.95a5.74 5.74 0 00-5.79-6h0a5.74 5.74 0 00-5.68 6z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><path d="M256 367.91a20 20 0 1120-20 20 20 0 01-20 20z"/></svg>`;
        return
    }
    // Get the video element
    const videoElement = document.querySelector("video");

    // Get the source of the video
    const videoSource = videoElement.getElementsByTagName("source")[0].src;

    // Object to hold Plyr options
    const plyrOptions = {
        autoplay: true
    };

    // Check if HLS is supported
    if (Hls.isSupported()) {
        // HLS configuration
        var hlsConfig = {
            maxMaxBufferLength: 100,
        };

        // Create a new Hls instance with configuration
        const hlsInstance = new Hls(hlsConfig);

        // Load video source
        hlsInstance.loadSource(videoSource);

        // Event listener for when the manifest is parsed
        hlsInstance.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
            // Get available quality levels
            const qualityLevels = hlsInstance.levels.map(level => level.height);

            // Set quality options for Plyr
            plyrOptions.quality = {
                default: qualityLevels[0], // Default quality
                options: qualityLevels,   // Available quality options
                forced: true,             // Force quality change
                onChange: quality => {
                    // Change video quality
                    hlsInstance.levels.forEach((level, index) => {
                        if (level.height === quality) {
                            hlsInstance.currentLevel = index;
                        }
                    });
                }
            };

            // Create Plyr instance with options
            new Plyr(videoElement, plyrOptions);
        });

        // Attach media to the player
        hlsInstance.attachMedia(videoElement);

        // Store Hls instance globally
        window.hls = hlsInstance;
    } else {
        // If HLS is not supported, create Plyr instance without additional options
        new Plyr(videoElement, plyrOptions);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    baseFunction()
});