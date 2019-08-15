import React, { useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import { setUp } from "./utils";
import Video from "./Video";

const members = ["jes", "mahsa"];

function App() {
  const [labeledFaceDescriptors, setLabeledFaceDescriptors] = useState([]);
  const [loading, setLoading] = useState(true);

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
    setUp().then(() => getReferenceImages().then(() => setLoading(false)));
  }, []);

  return (
    <div>
      {loading ? (
        <div>...loading</div>
      ) : (
        <Video labeledFaceDescriptors={labeledFaceDescriptors} />
      )}
    </div>
  );
}

export default App;
