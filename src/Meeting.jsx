import React, { Component } from "react";
import * as faceapi from "face-api.js";
import styled from "styled-components";
import { setUp } from "./utils";
import Video from "./Video";
import { members, REPORT } from "./constants";

const Button = styled.button``;
const Spinner = styled.img`
  width: 100px;
  height: 100px;
  margin: 0 auto;
`;

class Meeting extends Component {
  state = {
    labeledFaceDescriptors: [],
    loading: false,
    attendees: []
  };

  // create reference descriptors from reference images in the public folder
  getReferenceImages = async () => {
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
    console.log("here");
    this.setState({ labeledFaceDescriptors: users });
  };

  componentDidMount() {
    this.setState({ loading: true });
    setUp().then(() =>
      this.getReferenceImages().then(() => this.setState({ loading: false }))
    );
  }

  handleOnMatch = match => {
    const { attendees } = this.state;
    if (match._label === "unknown") return;

    const existingAttendee = attendees.filter(
      attendee => attendee.label === match._label
    );

    if (existingAttendee.length) {
      const newState = attendees.filter(
        attendee => attendee.label !== existingAttendee[0].label
      );

      const newData = {
        label: match._label,
        data: [...existingAttendee[0].data, match]
      };

      this.setState({ attendees: [...newState, newData] });
    } else {
      const newAttendee = { label: match._label, data: [match] };
      this.setState({ attendees: [...attendees, newAttendee] });
    }
  };

  render() {
    const { goToNextPage } = this.props;
    const { loading, labeledFaceDescriptors, attendees } = this.state;
    console.log(attendees);
    return (
      <div>
        {loading ? (
          <Spinner src="gifs/Spinner.gif" alt="loading" />
        ) : (
          <div>
            <Video
              labeledFaceDescriptors={labeledFaceDescriptors}
              onMatch={this.handleOnMatch}
            />
            <Button onClick={() => goToNextPage(REPORT)}>Finish Meeting</Button>
          </div>
        )}
      </div>
    );
  }
}

export default Meeting;
