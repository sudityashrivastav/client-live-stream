var player;
var buffering = {};
var mainData = CryptojsDecrypt(streamData);
var securityObj = mainData.security;
//var mainParam = location.search.split('id=')[1]
//var idParam = mainParam.split(',')[0]
//var strimParam = mainParam.split(',')[1]
//console.log(window.navigator.platform)
var url = new URL(url_string);
var wsid = url.searchParams.get("id");

var config = {
    "source": {
        "h5live": {
            "server": {
                "websocket": "wss://bintu-h5live-secure.nanocosmos.de:443/h5live/authstream/stream.mp4",
                "hls": "https://bintu-h5live-secure.nanocosmos.de:443/h5live/authhttp/playlist.m3u8"
            },
            "rtmp": {
                "url": "rtmp://bintu-splay.nanocosmos.de:1935/splay",
                "streamname": mainData.streamName
            },
            "security": {
                "token": securityObj.token,
                "expires": securityObj.expires,
                "options": securityObj.options,
                "tag": securityObj.tag
            }
        }
    },
    "playback": {
        "videoId": ["myPlayer", "myPlayer2"],
        "autoplay": true,
        "automute": true,
        "muted": false,
        "allowSafariHlsFallback": true,
    "allowSafariHlsPlayback": true,
        "flashplayer": "//demo.nanocosmos.de/nanoplayer/nano.player.swf"
    },
    "style": {
        width: '100%',
        height: "100%",
        aspectratio: '16/9',
        controls: false,
        scaling: 'letterbox'
    },
    events: {
        onReady: function (e) { },
        onPlay: function (e) { },
        onPause: function (e) {
            var reason = (e.data.reason !== 'normal') ? ' (%reason%)'.replace('%reason%', e.data.reason) : '';
        },
        onLoading: function (e) { },
        onStartBuffering: function (e) {
            buffering.start = new Date();
            setTimeout(function () {
                if (buffering.start) { }
            }, 2000);
        },
        onStopBuffering: function (e) {
            buffering.stop = new Date();
            if (buffering.start) {
                var duration = Math.abs(buffering.stop - buffering.start);
                if (duration > 1000) { }
                buffering.stop = buffering.start = 0;
            }
        },
        onWarning: function (e) { },
        onError: function (e) {
            try {
                var err = JSON.stringify(e);
                if (err === '{}') {
                    err = e.message;
                }
                e = err;
            } catch (err) { }
            console.log('Error = ' + e);
            setTimeout(function () {
                startPlayer();
            }, 2000);
        },
        onDestroy: function (e) { }
    }
};  


document.addEventListener('DOMContentLoaded', function () {
    player = new NanoPlayer("playerDiv");
    startPlayer();
});

function startPlayer() {
    player.setup(config).then(function (config) { }, function (error) { });
}

function destroyPlayer() {
    if (player) {
        player.destroy();
    }
}
