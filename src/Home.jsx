import React from "react";
import styled from "styled-components";
import { MEETING } from "./constants";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: -webkit-fill-available;
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
  &: hover {
    background-color: #00ff98;
  }
`;

const Logo = styled.img`
  width: 256px;
  height: 256px;
`;

const Footer = styled.div`
  position: absolute;
  bottom: 0px;
  padding: 20px;
  font-size: 14px;
  font-family: "Nunito";
`;

function Home(props) {
  const { goToNextPage } = props;

  return (
    <Container>
      <Logo src="icons/boredRoomLogo.svg" alt="Bored Room Logo" />
      <Button onClick={() => goToNextPage(MEETING)}>Start Meeting</Button>
      <Footer>Copyright © 2019 JESTHMOSA All Rights Reserved</Footer>
    </Container>
  );
}

export default Home;
