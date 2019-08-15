import React, { useRef, useEffect, Fragment } from "react";
import * as faceapi from "face-api.js";
import { requestWebCamAcess } from "./utils";
import styled from "styled-components";

const FREQUENCY = 5000;

const StyledVideo = styled.video`
  object-fit: cover;
  width: 100%
  height: 100%;
`;

const delayedPlay = (videoEl, labeledFaceDescriptors, onMatch) =>
  setTimeout(() => onPlay(videoEl, labeledFaceDescriptors, onMatch), FREQUENCY);

async function onPlay(videoEl, labeledFaceDescriptors, onMatch) {
  if (!videoEl.current) return;
  // detect faces from the webcam

  console.log("hhhheerrerrererre", videoEl);
  const detections = await faceapi
    .detectAllFaces(videoEl.current, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceExpressions()
    .withFaceDescriptors();

  // resize the detected boxes and landmarks in case your displayed image has a different size than the original
  //   const resizedDetections = faceapi.resizeResults(detections, displaySize);
  if (!detections.length) {
    console.log("no faces detected");
    delayedPlay(videoEl, labeledFaceDescriptors, onMatch);
    return;
  }

  // create FaceMatcher with automatically assigned labels from the detection results for the reference image
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

  // compare webcam detections to reference descriptors
  const results = detections.map(detection => {
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
    onMatch(results);
  }

  delayedPlay(videoEl, labeledFaceDescriptors, onMatch);
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
      <StyledVideo autoPlay muted ref={videoEl} onLoadedMetadata={handlePlay} />
    </Fragment>
  );
}

export default Video;
