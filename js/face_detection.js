const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/'
const useTinyModel = false
const minConfidence = 0.45;
const imgContainerId = "#imageContainer";
const imgInputId = "#refImgUploadInput";
const imgTab1Id = '#refImg';
const imgTab1OverlayId = '#refImgOverlay';
const videoTab2Id = "";
const tabContainerNav = "#TabsContainerNav";
const tabContainer = "#TabsContainer";

const tab1Id = '#Tab1';
const tab2Id = '#Tab2';
const loaderTab1Id = '#loadingTab1';
const loaderTab2Id = '#loadingTab2';
const loaderTextTab1Id = '#loadingTextTab1';

function loadCam() {
    $(tab2Id).hide();
    $(loaderTab1Id).show();
    $(loaderTextTab1Id).html("Loading Camera...");

    const videoEl = document.getElementById('inputVideo')
    navigator.getUserMedia({ video: {} },
        stream => {
            videoEl.srcObject = stream;
            $(tab2Id).show();
            $(loaderTab1Id).hide();
        },
        err => {
            $(loaderTextTab1Id).html("Error Loading the Camera, Permission Denied...");
            console.error(err);
        }
    );
}


function endCam() {

    var videoEl = document.getElementById('inputVideo');
    // now get the steam 
    stream = videoEl.srcObject;
    // now get all tracks
    tracks = stream.getTracks();
    // now close each track by having forEach loop
    tracks.forEach(function(track) {
        // stopping every track
        track.stop();
    });
    // assign null to srcObject of video
    videoEl.srcObject = null;

}



let forwardTimes = []

function updateTimeStats(timeInMs) {
    forwardTimes = [timeInMs].concat(forwardTimes).slice(0, 30)
    const avgTimeInMs = forwardTimes.reduce((total, t) => total + t) / forwardTimes.length
    $('#time').val(`${Math.round(avgTimeInMs)} ms`)
    $('#fps').val(`${faceapi.round(1000 / avgTimeInMs)}`)
}

function drawExpressions(dimensions, canvas, results, thresh, withBoxes = true) {
    const resizedResults = resizeCanvasAndResults(dimensions, canvas, results)

    if (withBoxes) {
        faceapi.drawDetection(canvas, resizedResults.map(det => det.detection), { withScore: false })
    }

    faceapi.drawFaceExpressions(canvas, resizedResults.map(({ detection, expressions }) => ({ position: detection.box, expressions })))
}

function drawDetections(dimensions, canvas, detections) {
    const resizedDetections = resizeCanvasAndResults(dimensions, canvas, detections)
    faceapi.drawDetection(canvas, resizedDetections)
}
async function onPlay() {
    const videoEl = $('#inputVideo').get(0);
    const videoCanvas = $('#refVideoOverlay').get(0);
    if (videoEl.paused || videoEl.ended)
        return setTimeout(() => onPlay());
    detector = useTinyModel ? new faceapi.TinyFaceDetectorOptions({ minConfidence: minConfidence }) : new faceapi.SsdMobilenetv1Options({ minConfidence: minConfidence });
    const ts = Date.now();

    const result = await faceapi
        .detectAllFaces(videoEl, detector)
        .withFaceExpressions()
        .withFaceLandmarks(useTinyModel)
        .withFaceDescriptors()
    updateTimeStats(Date.now() - ts);

    if (result && result.length > 0) {
        resizedResults = resizeCanvasAndResultsVideo(videoEl, videoCanvas, result)
        faceMatcher = new faceapi.FaceMatcher(result)
        const labels = faceMatcher.labeledDescriptors
            .map(ld => ld.label)
        const boxesWithText = resizedResults
            .map(res => res.detection.box)
            .map((box, i) => new faceapi.BoxWithText(box, labels[i]))

        faceapi.drawDetection(videoCanvas, boxesWithText, { withScore: true })
        const landmarksArray = resizedResults.map(fd => fd.landmarks)
        faceapi.drawLandmarks(videoCanvas, landmarksArray, { drawLines: true })
        faceapi.drawFaceExpressions(
            videoCanvas,
            resizedResults.map(({ detection, expressions }) => ({
                position: new faceapi.Rect(
                    detection.box.x, detection.box.y + 22, detection.box.width, detection.box.height),
                expressions
            })));
    }

    setTimeout(() => onPlay())
}

async function loadModels() {
    console.log("Loading ML Models");
    //Show Loaders while the models are loaded
    $(loaderTab1Id).show();
    $(loaderTab2Id).show();
    $(loaderTextTab1Id).html("Loading Machine Learning Models...");
    //Hide Tabs Content
    $(tab1Id).hide();
    $(tab2Id).hide();
    $(tabContainerNav).hide();
    $(tabContainer).hide();
    //Load ML Models
    await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
    await faceapi.loadFaceLandmarkModel(MODEL_URL);
    await faceapi.loadFaceRecognitionModel(MODEL_URL);
    await faceapi.loadFaceExpressionModel(MODEL_URL);
    await faceapi.loadFaceLandmarkTinyModel(MODEL_URL);
    await faceapi.loadTinyFaceDetectorModel(MODEL_URL);
    //Hide Loaders
    $(loaderTab1Id).hide();
    //Show Content
    $(tab1Id).show();
    $(tab2Id).show();
    $(tabContainerNav).show();
    $(tabContainer).show();
    $(imageContainer).hide();
    // updateReferenceImageResults();
}
async function uploadRefImage(e) {
    //Show Loader
    $(loaderTab1Id).show();
    $(loaderTextTab1Id).html("Uploading Image...");
    //Upload Image
    const imgFile = $(imgInputId).get(0).files[0];
    const img = await faceapi.bufferToImage(imgFile);
    $(imgTab1Id).get(0).src = img.src;
    console.log("Uploading Content");

    $(imgContainerId).show();
    //Write the results on screen
    updateReferenceImageResults();
}
async function updateReferenceImageResults() {
    console.log("Detecting Faces");
    const imgEl = $(imgTab1Id).get(0);
    const canvas = $(imgTab1OverlayId).get(0);

    if ($(imgTab1Id).height() == 0 || $(imgTab1Id).width() == 0) {
        return;
    }
    $(loaderTextTab1Id).html("Detecting Faces in the Image...");
    $(imgTab1Id).hide();
    $(loaderTab1Id).show();

    detector = useTinyModel ? new faceapi.TinyFaceDetectorOptions({ minConfidence: minConfidence }) : new faceapi.SsdMobilenetv1Options({ minConfidence: minConfidence });
    const fullFaceDescriptions = await faceapi
        .detectAllFaces(imgEl, detector)
        .withFaceExpressions()
        .withFaceLandmarks(useTinyModel)
        .withFaceDescriptors()
    if (!fullFaceDescriptions.length) {
        $(imgContainerId).show();
        $(loaderTab1Id).hide();
        return;
    }

    // create FaceMatcher with automatically assigned labels
    // from the detection results for the reference image
    faceMatcher = new faceapi.FaceMatcher(fullFaceDescriptions)
        // resize detection and landmarks in case displayed image is smaller than
        // original size
    resizedResults = resizeCanvasAndResults(imgEl, canvas, fullFaceDescriptions);
    if (resizedResults) {
        // draw boxes with the corresponding label as text
        const labels = faceMatcher.labeledDescriptors
            .map(ld => ld.label)
        const boxesWithText = resizedResults
            .map(res => res.detection.box)
            .map((box, i) => new faceapi.BoxWithText(box, labels[i]))
        faceapi.drawDetection(canvas, boxesWithText, { withScore: true })
        const landmarksArray = resizedResults.map(fd => fd.landmarks)
        faceapi.drawLandmarks(canvas, landmarksArray, { drawLines: true })
        faceapi.drawFaceExpressions(canvas, resizedResults.map(({ detection, expressions }) => ({ position: new faceapi.Rect(detection.box.x, detection.box.y + 22, detection.box.width, detection.box.height), expressions })));

        $(imgTab1Id).show();
        $(loaderTab1Id).hide();
    }
}

function resizeCanvasAndResults(dimensions, canvas, results) {
    const width = $(imgTab1Id).width();
    const height = $(imgTab1Id).height();
    console.log("Resizing Canvas to Image Size (", width, "x", height, ")");

    if (width == 0 || height == 0) {
        $(loaderTextTab1Id).html("Image error, try again or reloading the page...");
        return null;
    } else {
        canvas.width = width;
        canvas.height = height;
        return faceapi.resizeResults(results, { width, height });
    }
}

function resizeCanvasAndResultsVideo(dimensions, canvas, results) {
    const width = $("#inputVideo").width();
    const height = $('#inputVideo').height();
    // console.log("Resizing Canvas to Image Size (", width, "x", height, ")" );

    if (width == 0 || height == 0) {
        $(loaderTextTab1Id).html("Image error, try again or reloading the page...");
        return null;
    } else {
        canvas.width = width;
        canvas.height = height;
        return faceapi.resizeResults(results, { width, height });
    }
}


$(document).ready(function() {
    loadModels();
});

$(window).resize(function() {
    updateReferenceImageResults();
});