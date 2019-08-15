import React, { useRef, useEffect, Fragment } from "react";
import * as faceapi from "face-api.js";
import { requestWebCamAcess } from "./utils";

const WIDTH = 720;
const HEIGHT = 576;

async function onPlay(videoEl, canvasEl, labeledFaceDescriptors) {
  const displaySize = {
    width: 720,
    height: 576
  };

  // resize the overlay canvas to the input dimensions
  faceapi.matchDimensions(canvasEl.current, displaySize, true);

  // detect faces from the webcam
  const detections = await faceapi
    .detectAllFaces(videoEl.current, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceExpressions()
    .withFaceDescriptors();

  // resize the detected boxes and landmarks in case your displayed image has a different size than the original
  const resizedDetections = faceapi.resizeResults(detections, displaySize);
  if (!detections.length) {
    console.log("no faces detected");
    setTimeout(() => onPlay(videoEl, canvasEl, labeledFaceDescriptors), 500);
    return;
  }

  // create FaceMatcher with automatically assigned labels from the detection results for the reference image
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

  // compare webcam detections to reference descriptors
  const results = resizedDetections.map(detection => {
    return {
      ...faceMatcher.findBestMatch(detection.descriptor),
      expressions: detection.expressions
    };
  });

  if (!results) {
    console.log("no matches");
  }
  if (results) {
    console.log("match---------", results);
    results.forEach((bestMatch, i) => {
      console.log("bestMatch--------", bestMatch);
    });
  }
  setTimeout(() => onPlay(videoEl, canvasEl, labeledFaceDescriptors), 500);
}

function Video(props) {
  const { labeledFaceDescriptors } = props;
  const videoEl = useRef(null);
  const canvasEl = useRef(null);

  useEffect(() => {
    requestWebCamAcess(videoEl);
    onPlay(videoEl, canvasEl, labeledFaceDescriptors);
  }, [labeledFaceDescriptors]);

  const handlePlay = () => onPlay(videoEl, canvasEl, labeledFaceDescriptors);

  return (
    <Fragment>
      <video
        width={WIDTH}
        height={HEIGHT}
        autoPlay
        muted
        ref={videoEl}
        onLoadedMetadata={handlePlay}
      />
      <canvas
        style={{ position: "absolute", top: "0", left: "0" }}
        id="canvas"
        ref={canvasEl}
      />
    </Fragment>
  );
}

export default Video;
