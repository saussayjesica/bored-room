import React from "react";
import styled from "styled-components";
import { MEETING } from "./constants";

const Button = styled.button``;

function Home(props) {
  const { goToNextPage } = props;

  return <Button onClick={() => goToNextPage(MEETING)}>Start Meeting</Button>;
}

export default Home;
