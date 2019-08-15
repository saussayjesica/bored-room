import React, { Fragment } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: grid;
  align-items: center;
  justify-items: center;
  border: 1px solid black;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-gap: 5px;
  margin: 20px;
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

const Values = styled.div``;
const Results = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;
const Emotion = styled.div``;

function Report(props) {
  const { goToNextPage, attendeeData } = props;

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
      [key]: Math.round((100 / total) * expressions[key])
    }));
    return { label: attendee.label, expressions: expressionPercentages };
  });

  console.log(attendeeSummary);
  return (
    <Container>
      {attendeeSummary &&
        attendeeSummary.map(attendee => (
          <Results>
            <Avatar src={`images/${attendee.label}.jpg`} />
            <Values>
              {attendee.expressions.map(emotion =>
                Object.keys(emotion).map(key => (
                  <Emotion>
                    {key}: {emotion[key]}%
                  </Emotion>
                ))
              )}
            </Values>
          </Results>
        ))}
    </Container>
  );
}

export default Report;
