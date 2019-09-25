// ==UserScript==
// @name         SpeakFluently
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include 	 http://www.youtube.com/*
// @include 	 https://www.youtube.com/*
// @require 	 http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require 	 https://unpkg.com/wavesurfer.js

// @grant        none
// ==/UserScript==

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function fixNum(x) {
    return Number.parseFloat(x).toFixed(2);
}

// return string like "RW1ChiWyiZQ",  from "https://www.youtube.com/watch?v=RW1ChiWyiZQ"
// or null
function get_video_id(){
    return getURLParameter('v');
}

//https://stackoverflow.com/questions/11582512/how-to-get-url-parameters-with-javascript/11582513#11582513
function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}


function getAudioOnly(vid, audio_tag, wavesurfer)
{
    var audio_streams = {};
    //var vid = "3Iq9f5pLzRc",

        //audio_tag = document.getElementById('youtube');

    fetch("https://"+vid+"-focus-opensocial.googleusercontent.com/gadgets/proxy?container=none&url=https%3A%2F%2Fwww.youtube.com%2Fget_video_info%3Fvideo_id%3D" + vid).then(response => {
        if (response.ok) {
            response.text().then(data => {

                var data1 = parse_str(data);
                console.log("data1:");
                console.log(data1);

                var streams = (data1.url_encoded_fmt_stream_map + ',' + data1.adaptive_fmts).split(',');
                console.log(data1.url_encoded_fmt_stream_map + ',' + data1.adaptive_fmts);

                streams.forEach(function(s, n) {
                    var stream = parse_str(s),
                        itag = stream.itag * 1,
                        quality = false;
                    console.log(s);

                    switch (itag) {
                        case 139:
                            quality = "48kbps";
                            break;
                        case 140:
                            quality = "128kbps";
                            break;
                        case 141:
                            quality = "256kbps";
                            break;
                    }
                    if (quality) audio_streams[quality] = stream.url;
                });

                console.log(audio_streams);
                let url128 = audio_streams['128kbps'];
                //let url128 = audio_streams['48kbps'];


                //url128 = "http://127.0.0.1:9999/"+url128
                url128 = "https://cors-anywhere.herokuapp.com/"+url128

                console.log(url128);
                wavesurfer.load(url128);
                //wavesurfer.load("https://cors-anywhere.herokuapp.com/https://r6---sn-a5mlrn7l.googlevideo.com/videoplayback?expire=1569361184&ei=wDiKXYW1FPODsfIPpZaMsAo&ip=66.249.84.44&id=o-ALvQxb4Ky8_osroIgBh2ThfaboXrg5a6KDdyvaYjPPQj&itag=140&source=youtube&requiressl=yes&mime=audio%2Fmp4&gir=yes&clen=18696579&dur=1155.215&lmt=1568923440327733&fvip=2&keepalive=yes&c=WEB&txp=4531432&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cmime%2Cgir%2Cclen%2Cdur%2Clmt&sig=ALgxI2wwRAIgCFwcz87UoomGPu7U15hmZ3Ez0t38DQQYp2J1a5k1tWMCICYDIouz8jNdX6P6T9YY5037Hs7fORIJuRQX60t1kswR&redirect_counter=1&rm=sn-5hnely7l&req_id=f401c6d8c66ea3ee&cms_redirect=yes&ipbypass=yes&mip=67.230.184.177&mm=31&mn=sn-a5mlrn7l&ms=au&mt=1569339533&mv=m&mvi=5&pl=21&lsparams=ipbypass,mip,mm,mn,ms,mv,mvi,pl&lsig=AHylml4wRQIhAIikom6bYSr6fEclzVW_We9Ft06usl_DBZHVOhcfR4GmAiA0Fo3MGqiLnvOAX4UYx5kOmPrCHhJNXEwRFTlNzKHhAw==");
                /*

                fetch(url128,{ mode: 'cors', // no-cors, cors, *same-origin
                             }).then(async resp =>{
                    console.log(resp.ok);
                    console.log(resp);
                    const reader = resp.body.getReader();
                    new ReadableStream({
                        start(controller) {
                            return pump();
                            function pump() {
                                return reader.read().then(({ done, value }) => {
                                    // When no more data needs to be consumed, close the stream
                                    if (done) {
                                        controller.close();
                                        return;
                                    }
                                    // Enqueue the next data chunk into our target stream
                                    controller.enqueue(value);
                                    return pump();
                                });
                            }
                        }
                    })
                })
                    .then(stream => new Response(stream))
                    .then(response => response.blob())
                    .then(blob => URL.createObjectURL(blob))
                    .then(url => console.log(audio_tag.src = url))
                    //.catch(err => console.error(err));

*/


                //wavesurfer.load(url128);
                //audio_tag.src = url128;
                //audio_tag.play();
            })
        }
    });

}

function parse_str(str) {
    return str.split('&').reduce(function(params, param) {
        var paramSplit = param.split('=').map(function(value) {
            return decodeURIComponent(value.replace('+', ' '));
        });
        params[paramSplit[0]] = paramSplit[1];
        return params;
    }, {});
}



function inject_our_script(){
    var div      = document.createElement('div'),
        divWave      = document.createElement('div'),
        select   = document.createElement('select'),
        option   = document.createElement('option'),
        textLabel = document.createTextNode("None"),
        markBT = document.createElement('button'),
        replayBT = document.createElement('button'),
        startRecordingBT = document.createElement('button'),
        stopRecordingBT = document.createElement('button'),
        audioCtrl = document.createElement('audio'),

        controls = document.getElementById('watch7-headline');  // Youtube video title DIV


    divWave.id = "waveform";
    var wavesurfer = WaveSurfer.create({
        container: divWave,
        waveColor: '#FF6666',
        progressColor: 'violet'
    });
    //wavesurfer.loadBlob();
    divWave.setAttribute('style', `display: table;
width:100%;
margin-top:4px;
border: 1px solid rgb(200, 183, 10);
cursor: pointer; color: rgb(255, 255, 255);
border-radius: 3px;
background-color: #FFFF66;


`);
    div.appendChild(divWave);

    let vid = get_video_id();
    getAudioOnly(vid, audioCtrl, wavesurfer);


    let audioDiv = document.createElement('div');
        //set audio
    audioCtrl.id       = 'audio';
    audioCtrl.controls = 'controls';
    audioCtrl.src      = '';
    //audioCtrl.type     = 'audio/mpeg';
    audioDiv.appendChild(audioCtrl);
    audioDiv.setAttribute('style', `display: table;
width:100%;
margin-top:4px;
border: 1px solid rgb(200, 183, 10);
cursor: pointer; color: rgb(255, 255, 255);
border-radius: 3px;
background-color: #ffB711;


`);
    div.appendChild(audioDiv);




    div.setAttribute('style', `display: table;
width:100%;
margin-top:4px;
border: 1px solid rgb(0, 183, 90);
cursor: pointer; color: rgb(255, 255, 255);
border-radius: 3px;
background-color: #00B75A;
font-size: 10px;
text-align:center;
padding:30px 0;

`);

    div.id = 'myButton';
    




    //display info
    textLabel.textContent = "Ready"
    let textDiv = document.createElement('div');

    textDiv.appendChild(textLabel);
        textDiv.setAttribute('style', `
font-size: 30px;
text-align:center;
padding:10px;

`);
    div.appendChild(textDiv);


    let buttonsDiv = document.createElement('div');
    buttonsDiv.setAttribute( 'style', `
width: 100%;
padding:10px;
`);
    //start logic

    let appStatus = "IDEL"
    let bAudioReady = false


    let markTime = 0;
    let endTime = 0;

    //mark button
    markBT.innerHTML = "Mark"
    markBT.setAttribute( 'style', ` width: 100px;
height: 80px;
background: #FF9900;
border: none;
border-radius: 3px;
position: relative;
font-size: 10px;
text-align: middle;
cursor: pointer;


margin: 100px, 100px, 100px, 100px;
`);
    buttonsDiv.appendChild(markBT);
    markBT.addEventListener('click', async () => {

        var ytplayer = document.getElementById("movie_player");
		markTime = ytplayer.getCurrentTime();


        textLabel.textContent = "Start:" + fixNum(markTime) + " to ??";
        appStatus = 'MARKED'
        bAudioReady = false;
        ytplayer.playVideo();

	});

    //Replay button
    replayBT.innerHTML = "Replay"
    replayBT.setAttribute( 'style', ` width: 100px;
height: 80px;
background: #FF9900;
border: none;
border-radius: 3px;
position: relative;
font-size: 10px;
text-align: middle;

`);
    buttonsDiv.appendChild(replayBT);
    replayBT.addEventListener('click', async () => {
        var ytplayer = document.getElementById("movie_player");
        let time = ytplayer.getCurrentTime();
		
        let dt = time - markTime;

        //the duration should at least 2 second
        if(dt > 2)
        {
            endTime = time;
        }

        textLabel.textContent = "Start:" + fixNum(markTime) + " to " + fixNum(endTime);
		ytplayer.seekTo(markTime, true);
        ytplayer.playVideo();
        appStatus = 'REPLAYING'
        while(ytplayer.getCurrentTime() < endTime)
        {
            await sleep(5);
        }


        ytplayer.pauseVideo();
        if(bAudioReady)
        {
            //audioCtrl.play();
        }

        appStatus = 'IDLE';

	});


    // recoding vars
    let shouldStop;
    let stopped;
    let mediaRecorder;


    //Start Record Button
    startRecordingBT.innerHTML = "Rec";
    startRecordingBT.setAttribute( 'style', ` width: 80px;
  height: 80px;
  background: #00bfff;
  border: none;
  border-radius: 50px;
  position: relative;
  font-size: 10px;
  text-align: middle;

`);

    let handleSuccess = (stream) => {
        //textLabel.textContent = "Recoding...";
        startRecordingBT.innerHTML = "Stop";
        startRecordingBT.style.background = 'Crimson';
        appStatus = 'RECORDING';

        let options;
        let recordedChunks = [];
        shouldStop = false;
        stopped = false;

        if (typeof MediaRecorder.isTypeSupported == 'function'){
            if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
                options = {mimeType: 'audio/webm;codecs=opus'};
            } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
                options = {mimeType: 'audio/ogg;codecs=opus'};
            }
            console.log('mimeType: '+options.mimeType);
            mediaRecorder = new MediaRecorder(stream, options);
        } else {
            console.log('mimeType DEFAULT');
            mediaRecorder = new MediaRecorder(stream);
        }


        mediaRecorder.start(10);

        mediaRecorder.addEventListener('dataavailable', function(e) {
            if (e.data.size > 0) {
                recordedChunks.push(e.data);
                console.log(e.data);
            }

            if(shouldStop === true && stopped === false) {
                console.log('Stop');
                mediaRecorder.stop();
                stream.getAudioTracks().forEach(function (track) {
                    track.stop();
                });
                stopped = true;
            }
        });

        mediaRecorder.addEventListener('start', function(e) {
            console.log('Started, state = ' + mediaRecorder.state);
        });

        mediaRecorder.addEventListener('stop', function() {
            let auidoSource = URL.createObjectURL(new Blob(recordedChunks));
            audioCtrl.src = auidoSource;
            wavesurfer.load(auidoSource);
            bAudioReady = true;
            appStatus = 'IDLE';
            //downloadLink.href = URL.createObjectURL(new Blob(recordedChunks));
            //downloadLink.download = 'AudioTest.wav';
            //downloadLink.classList.remove('hide');
        });

        mediaRecorder.addEventListener('warning', function(e) {
            Debug.log('Warning: ' + e);
        });

        mediaRecorder.addEventListener('error', evt => {
            console.log(evt);
            reject(evt);
        });
    }
    let errorCallback = (error) => {
			alert(error);
			console.log('navigator.getUserMedia error: ', error);
	};

    startRecordingBT.addEventListener('click', async () => {
        if(appStatus === 'RECORDING')
        {
            shouldStop = true;
            startRecordingBT.innerHTML = "Rec";
            startRecordingBT.style.background = '#00bfff';
            return;
        }

        var ytplayer = document.getElementById("movie_player");

        ytplayer.pauseVideo();
        navigator.getUserMedia({"audio": true, "video": false}, handleSuccess, errorCallback);

	});
    buttonsDiv.appendChild(startRecordingBT);
    div.appendChild(buttonsDiv);






    // put the div into page: new material design
    var title_element = document.querySelectorAll('.title.style-scope.ytd-video-primary-info-renderer');
    if (title_element){
        $(title_element[0]).after(div);
    }
    // put the div into page: old version
    if(controls){
        controls.appendChild(div);
    }



    // <a> element is for download
    var a = document.createElement('a');
    a.style.cssText = 'display:none;';
    a.setAttribute("id", "ForSubtitleDownload");
    var body = document.getElementsByTagName('body')[0];
    body.appendChild(a);
}

$(document).ready(function () {
    inject_our_script();
    alert(get_video_id());

	window.AudioContext = window.AudioContext || window.webkitAudioContext;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    window.URL = window.URL || window.webkitURL;

})
