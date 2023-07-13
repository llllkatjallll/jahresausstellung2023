const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

function onResultsBody(bodyLandmarks) {
  if(currentSketch != 2){
    bodyPositionen = bodyLandmarks.poseLandmarks;
    /*if (results.multiHandLandmarks && results.multiHandedness) {
      for (let index = 0; index < results.multiHandLandmarks.length; index++) {
          handPositionen = results.multiHandLandmarks[0];
      }
    }*/
  }
}

function onResultsHands(results) {
  if(currentSketch == 2){
  handPositionen = results.multiHandLandmarks;

  if (results.multiHandLandmarks && results.multiHandedness) {
    for (let index = 0; index < results.multiHandLandmarks.length; index++) {
        handPositionen = results.multiHandLandmarks[0];
    }
  }
  }
}

const hands = new Hands({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});

hands.setOptions({
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
hands.onResults(onResultsHands);



const pose = new Pose({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
}});
/*  */
pose.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  enableSegmentation: true,
  smoothSegmentation: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
pose.onResults(onResultsBody);




const camera = new Camera(videoElement, {
  onFrame: async () => {
    if(currentSketch == 2){
      await hands.send({image: videoElement});
    } else {
      await pose.send({image: videoElement});
    }
    
    
  },
  width: 1280,
  height: 720
});
camera.start();