import React, { useRef, useEffect, Fragment } from "react";
import * as faceapi from "face-api.js";
import { requestWebCamAcess } from "./utils";

const WIDTH = 720;
const HEIGHT = 576;

async function onPlay(videoEl, labeledFaceDescriptors) {
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
    setTimeout(() => onPlay(videoEl, labeledFaceDescriptors), 500);
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
  setTimeout(() => onPlay(videoEl, labeledFaceDescriptors), 500);
}

function Video(props) {
  const { labeledFaceDescriptors } = props;
  const videoEl = useRef(null);

  useEffect(() => {
    requestWebCamAcess(videoEl);
    onPlay(videoEl, labeledFaceDescriptors);
  }, [labeledFaceDescriptors]);

  const handlePlay = () => onPlay(videoEl, labeledFaceDescriptors);

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
