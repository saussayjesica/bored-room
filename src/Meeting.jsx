import React, { useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import styled from "styled-components";
import { setUp } from "./utils";
import Video from "./Video";
import { members, REPORT } from "./constants";

const Button = styled.button``;

function Meeting(props) {
  const { goToNextPage } = props;

  const [labeledFaceDescriptors, setLabeledFaceDescriptors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [attendees, setAttendees] = useState([]);

  // create reference descriptors from reference images in the public folder
  async function getReferenceImages() {
    const membersArray = members.map(async member => {
      const imgUrl = `images/${member}.jpg`;
      const img = await faceapi.fetchImage(imgUrl);
      const fullFaceDescription = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!fullFaceDescription) {
        throw new Error(`no faces detected for ${member}`);
      }

      const faceDescriptors = [fullFaceDescription.descriptor];
      return new faceapi.LabeledFaceDescriptors(member, faceDescriptors);
    });
    const users = await Promise.all(membersArray);
    setLabeledFaceDescriptors(users);
  }

  useEffect(() => {
    setLoading(true);
    setUp().then(() => getReferenceImages().then(() => setLoading(false)));
  }, []);

  const handleOnMatch = match => {
    if (match._label === "unknown") return;
    // if (attendees) {
    //   const updatedValues = { ...attendees[match._label], ...match };
    //   console.log("UPDATED", updatedValues);
    // }
    const test = { [match._label]: match };
    const newAttendees = attendees.concat(test);
    setAttendees(newAttendees);
  };
  console.log(attendees);

  return (
    <div>
      {loading ? (
        <div>...loading</div>
      ) : (
        <div>
          <Video
            labeledFaceDescriptors={labeledFaceDescriptors}
            onMatch={handleOnMatch}
          />
          <Button onClick={() => goToNextPage(REPORT)}>Finish Meeting</Button>
        </div>
      )}
    </div>
  );
}

export default Meeting;
