import React from "react";
import styled from "styled-components";
import { VictoryChart, VictoryBar, VictoryTheme, VictoryAxis } from "victory";
import { HOME } from "./constants";

const ResultsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 5px;
  margin: 50px;
`;

const Avatar = styled.div`
  background-image: ${({ src }) => `url(${src})`};
  width: 150px;
  height: 150px;
  background-size: cover;
  background-position: top center;
  border-radius: 50%;
  margin: 5px;
`;

const Results = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  text-align: center;
`;

const Title = styled.h1`
  margin-left: 50px;
  font-family: "Nunito";
`;

const Overall = styled.div`
  width: 400px;
  margin-left: 50px;
`;

const Button = styled.button`
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
  margin: 10px;
  &: hover {
    background-color: #00ff98;
  }
`;

const ButtonContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  margin: 20px;
`;

function Report(props) {
  const { goToNextPage, attendeeData, meetingData } = props;

  const meetingEmotions = {
    happy: 0,
    surprised: 0,
    neutral: 0,
    fearful: 0,
    disgusted: 0,
    sad: 0,
    angry: 0
  };

  meetingData.forEach(result => {
    const status = result.status;
    meetingEmotions[status] = meetingEmotions[status] + 1;
  });

  const meetingEmotionTotal = Object.values(meetingEmotions).reduce(
    (a, b) => a + b
  );

  const meetingEmotionPercentages = Object.keys(meetingEmotions).map(key => ({
    emotion: key,
    value: Math.round((100 / meetingEmotionTotal) * meetingEmotions[key])
  }));

  const attendeeSummary = attendeeData.map(attendee => {
    var expressions = attendee.data.reduce(function(prev, curr) {
      for (var expression in curr.expressions) {
        if (expression === "asSortedArray") return prev;
        prev[expression] =
          (prev[expression] || 0) + curr.expressions[expression];
      }
      return prev;
    }, {});
    const total = Object.values(expressions).reduce((a, b) => a + b);
    const expressionPercentages = Object.keys(expressions).map(key => ({
      emotion: key,
      value: Math.round((100 / total) * expressions[key])
    }));
    return { label: attendee.label, expressions: expressionPercentages };
  });

  return (
    <div>
      <ButtonContainer>
        <Button>Download Meeting</Button>
        <Button onClick={() => goToNextPage(HOME)}>Home</Button>
      </ButtonContainer>
      <Title>Overall Results</Title>
      <Overall>
        <VictoryChart
          domainPadding={5}
          theme={VictoryTheme.material}
          horizontal
        >
          <VictoryAxis
            tickValues={[1, 2, 3, 4, 5, 6, 7]}
            tickFormat={meetingEmotionPercentages.map(
              expression => expression.emotion
            )}
          />
          <VictoryAxis dependentAxis tickFormat={y => `${y}%`} />
          <VictoryBar data={meetingEmotionPercentages} x="emotion" y="value" />
        </VictoryChart>
      </Overall>
      <Title>Attendee Results</Title>
      <ResultsContainer>
        {attendeeSummary &&
          attendeeSummary.map(attendee => (
            <Results>
              <Avatar src={`images/${attendee.label}.jpg`} />
              <VictoryChart
                domainPadding={5}
                theme={VictoryTheme.material}
                horizontal
              >
                <VictoryAxis
                  tickValues={[1, 2, 3, 4, 5, 6, 7]}
                  tickFormat={attendee.expressions.map(
                    expression => expression.emotion
                  )}
                />
                <VictoryAxis dependentAxis tickFormat={y => `${y}%`} />
                <VictoryBar
                  data={attendee.expressions}
                  x="emotion"
                  y="value"
                  width={400}
                />
              </VictoryChart>
            </Results>
          ))}
      </ResultsContainer>
    </div>
  );
}

export default Report;
