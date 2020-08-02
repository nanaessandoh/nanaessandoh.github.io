const inputConfig = {
    outputStride: 32,
    imageScaleFactor: 0.4,
    width: 800,
    height: 640,
};
const singlePoseDetectionConfig = {
    minPoseConfidence: 0.1,
    minPartConfidence: 0.5,
};

function loadCam(videoElId) {
    $(tab2Id).hide();
    $(loaderTab1Id).show();
    $(loaderTextTab1Id).html("Loading Camera...");

    const videoEl = $(videoElId).get(0);
    videoEl.width = inputConfig.width;
    videoEl.height = inputConfig.height;

    navigator.getUserMedia({ video: true },
        stream => {
            videoEl.srcObject = stream;
            console.log("Feed Element", videoEl.width, stream);
            console.log("Vid Element", $('#inputVideo').get(0).width);
            $(tab2Id).show();
            $(loaderTab1Id).hide();
        },
        err => {
            $(loaderTextTab1Id).html("Error Loading the Camera, Permission Denied...");
            console.error(err);
        }
    );
}

let forwardTimes = []

function updateTimeStats(timeInMs) {
    forwardTimes = [timeInMs].concat(forwardTimes).slice(0, 30)
    const avgTimeInMs = forwardTimes.reduce((total, t) => total + t) / forwardTimes.length
    $('#time').val(`${Math.round(avgTimeInMs)} ms`)
    $('#fps').val(`${faceapi.round(1000 / avgTimeInMs)}`)
}
async function onPlay() {
    const imageElement = $('#inputVideo').get(0);
    const canvas = $('#refVideoOverlay').get(0);
    if (imageElement.paused || imageElement.ended)
        return setTimeout(() => onPlay());
    const ts = Date.now();
    updateTimeStats(Date.now() - ts);

    var ctx = canvas.getContext("2d");
    canvas.width = inputConfig.width;
    canvas.height = inputConfig.height;
    height = $('#inputVideo').height();

    if (net && imageElement) {
        poses = [await net.estimateSinglePose(
            imageElement,
            inputConfig.imageScaleFactor,
            flipHorizontal,
            inputConfig.youtputStride)];
        drawKeypoints(ctx);
    } else {
        console.log("Net or Image not defined.");
    }
    setTimeout(() => onPlay(), 100);
}