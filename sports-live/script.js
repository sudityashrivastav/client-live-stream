
async function getCID(eventId) {

    const res = await fetch(`http://46.101.91.237:8085/api/live-stream-source?eventid=${eventId}`)
    const data = await res.json()

    if (data.eid) {
        return data.eid
    }
    alert("invalid event id")
}


async function baseFunction() {
    const mainVideoSRC = document.getElementById("main-video-source")

    const searchParams = new URLSearchParams(window.location.search);

    const myeid = searchParams.get("eventid")

    if (!myeid) {
        alert("eventid missing")
        return
    }

    const streamURL = await getCID(myeid)

    if (streamURL) {
        mainVideoSRC.src = "https://sports.hr08bets.in/m3u8-proxy?cid="+ streamURL
    } else {
        document.body.innerHTML = "invalid event id"
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