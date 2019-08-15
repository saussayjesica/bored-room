import * as faceapi from "face-api.js";

export function requestWebCamAcess(videoEl) {
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then(stream => (videoEl.current.srcObject = stream))
      .catch(err => console.log(err.name + ": " + err.message));
  }
}

export function rcancelWebCamAcess(videoEl) {
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then(stream => (videoEl.current.srcObject = stream))
      .catch(err => console.log(err.name + ": " + err.message));
  }
}

export async function setUp() {
  await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
  await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
  await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
  await faceapi.nets.faceExpressionNet.loadFromUri("/models");
  await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
  console.log("setup finished");
}
