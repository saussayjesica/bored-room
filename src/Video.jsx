import React, { useRef, useEffect, Fragment } from "react";
import * as faceapi from "face-api.js";
import { requestWebCamAcess } from "./utils";

const WIDTH = 720;
const HEIGHT = 576;
const FREQUENCY = 5000;

async function onPlay(videoEl, labeledFaceDescriptors, onMatch) {
  const displaySize = {
    width: 720,
    height: 576
  };

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
    setTimeout(
      () => onPlay(videoEl, labeledFaceDescriptors, onMatch),
      FREQUENCY
    );
    return;
  }

  // create FaceMatcher with automatically assigned labels from the detection results for the reference image
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

  // compare webcam detections to reference descriptors
  const results = resizedDetections.map(detection => {
    return {
      ...faceMatcher.findBestMatch(detection.descriptor),
      date: new Date(),
      expressions: detection.expressions
    };
  });

  if (!results) {
    console.log("no matches");
  }
  if (results) {
    results.forEach((bestMatch, i) => {
      onMatch(bestMatch);
    });
  }
  setTimeout(() => onPlay(videoEl, labeledFaceDescriptors, onMatch), FREQUENCY);
}

function Video(props) {
  const { labeledFaceDescriptors, onMatch } = props;
  const videoEl = useRef(null);

  useEffect(() => {
    requestWebCamAcess(videoEl);
    onPlay(videoEl, labeledFaceDescriptors);
  }, [labeledFaceDescriptors]);

  const handlePlay = () => onPlay(videoEl, labeledFaceDescriptors, onMatch);

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
    </Fragment>
  );
}

export default Video;
