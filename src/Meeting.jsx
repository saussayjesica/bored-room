import React, { Component } from "react";
import * as faceapi from "face-api.js";
import styled from "styled-components";
import { setUp } from "./utils";
import Video from "./Video";
import { members, REPORT, feedback } from "./constants";
import { maxBy } from "lodash";

var synth = window.speechSynthesis;

const Button = styled.button`
  margin: auto 22px auto auto;
  width: 250px;
  height: 50px;
  border-radius: 50px;
  cursor: pointer;
  background-color: #14e28f;
  color: black;
  font-size: 14px;
  font-family: "Nunito";
  border: none;
  text-transform: uppercase;
  font-weight: 600;
  &: hover {
    background-color: #00ff98;
  }
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: -webkit-fill-available;
`;
const Spinner = styled.img`
  width: 100px;
  height: 100px;
  margin: 0 auto;
`;

const StatusEmoji = styled.img`
  width: 300px;
  height: 300px;
  position: absolute;
  top: 0;
  left: 0;
  margin-left: 10px;
  margin-top: 10px;
`;

const Avatar = styled.div`
  background-image: ${({ src }) => `url(${src})`};
  width: 50px;
  height: 50px;
  background-size: cover;
  background-position: top center;
  border-radius: 50%;
  margin: 5px;
`;

const FooterContainer = styled.div`
  display: grid;
  grid-template-columns: 75% 25%;
`;

const VideoContainer = styled.div`
  position: relative;
`;

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: 85% 15%;
  height: 100vh;
`;

const Attendees = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`;

const Record = styled.img`
  position: absolute;
  right: 0;
  width: 300px;
  top: -60px;
`;

class Meeting extends Component {
  state = {
    labeledFaceDescriptors: [],
    loading: false,
    meetingStatus: ""
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
    this.setState({ labeledFaceDescriptors: users });
  };

  componentDidMount() {
    this.setState({ loading: true });
    setUp().then(() =>
      this.getReferenceImages().then(() => this.setState({ loading: false }))
    );
  }

  handleOnMatch = matches => {
    const { meetingStatus } = this.state;
    var expressions = matches.reduce(function(prev, curr) {
      for (var expression in curr.expressions) {
        if (expression === "asSortedArray") return prev;
        prev[expression] =
          (prev[expression] || 0) + curr.expressions[expression];
      }
      return prev;
    }, {});

    var maxEmotion = maxBy(
      Object.keys(expressions),
      expression => expressions[expression]
    );

    if (maxEmotion !== meetingStatus) {
      var utterThis = new SpeechSynthesisUtterance(feedback[maxEmotion]);
      synth.speak(utterThis);
    }
    this.setState({
      meetingStatus: maxEmotion
    });

    this.props.handleMatch(matches, maxEmotion);
  };

  render() {
    const { goToNextPage, attendeeData } = this.props;
    const { loading, labeledFaceDescriptors, meetingStatus } = this.state;

    return (
      <div>
        {loading ? (
          <Container>
            <Spinner src="gifs/Spinner.gif" alt="loading" />
          </Container>
        ) : (
          <Wrapper>
            <VideoContainer>
              {meetingStatus.length > 0 && (
                <StatusEmoji
                  src={`icons/${meetingStatus}.svg`}
                  alt="Bored Room Logo"
                />
              )}
              <Video
                labeledFaceDescriptors={labeledFaceDescriptors}
                onMatch={this.handleOnMatch}
              />
              <Record src="gifs/record.gif" alt="Recording" />
            </VideoContainer>
            <FooterContainer>
              <Attendees>
                {attendeeData.map(attendee => (
                  <Avatar src={`images/${attendee.label}.jpg`} />
                ))}
              </Attendees>
              <Button
                onClick={() => {
                  goToNextPage(REPORT);
                }}
              >
                Finish Meeting
              </Button>
            </FooterContainer>
          </Wrapper>
        )}
      </div>
    );
  }
}

export default Meeting;
