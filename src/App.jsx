import React, { Component } from "react";
import Home from "./Home";
import Meeting from "./Meeting";
import Report from "./Report";
import { HOME, MEETING, REPORT } from "./constants";

class App extends Component {
  state = {
    currentPage: HOME,
    attendeeData: [],
    meetingData: []
  };

  handleMatch = (matches, maxEmotion) => {
    const { attendeeData, meetingData } = this.state;

    this.setState({
      meetingData: [...meetingData, { status: maxEmotion, date: new Date() }]
    });

    matches.forEach(match => {
      if (match._label === "unknown") return;

      const existingAttendee = attendeeData.filter(
        attendee => attendee.label === match._label
      );

      if (existingAttendee.length) {
        const newState = attendeeData.filter(
          attendee => attendee.label !== existingAttendee[0].label
        );

        const newData = {
          label: match._label,
          data: [...existingAttendee[0].data, match]
        };

        this.setState({ attendeeData: [...newState, newData] });
      } else {
        const newAttendee = { label: match._label, data: [match] };
        this.setState({ attendeeData: [...attendeeData, newAttendee] });
      }
    });
  };

  handlePageChange = nextPage => {
    this.setState({ currentPage: nextPage });
  };

  render() {
    const { currentPage, attendeeData, meetingData } = this.state;
    const pages = {
      [HOME]: <Home goToNextPage={this.handlePageChange} />,
      [MEETING]: (
        <Meeting
          goToNextPage={this.handlePageChange}
          handleMatch={this.handleMatch}
          attendeeData={attendeeData}
        />
      ),
      [REPORT]: (
        <Report
          goToNextPage={this.handlePageChange}
          meetingData={meetingData}
          attendeeData={attendeeData}
        />
      )
    };

    return pages[currentPage];
  }
}

export default App;
