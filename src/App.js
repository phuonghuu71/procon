import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

import {
  Table,
  Button,
  InputGroup,
  FormControl,
  Container,
  Row,
  Col,
  Form,
  Card,
} from "react-bootstrap";

function App() {
  const [id, setId] = useState("");
  const [http, setHttp] = useState("");
  const [token, setToken] = useState("");
  const [data, setData] = useState([]);
  const [roundData, setRoundData] = useState([]);
  const [matchId, setMatchId] = useState([]);
  const [matchData, setMatchData] = useState([]);
  const [matchThread, setMatchThread] = useState("");
  const [matchThreadImage, setMatchThreadImage] = useState([]);
  const [matchThreadImageData, setMatchThreadImageData] = useState([]);

  useEffect(() => {
    console.log(data);
    console.log(roundData);
    console.log(matchThreadImageData);
  }, [data, roundData, matchThreadImageData]);

  useEffect(() => {
    if (localStorage.getItem("http") !== null) {
      setHttp(localStorage.getItem("http"));
    }

    if (localStorage.getItem("token") !== null) {
      setToken(`Bearer ${localStorage.getItem("token")}`);
    }
  }, [http, token]);

  useEffect(() => {
    setMatchThreadImageData([]);
    for (let i = 0; i < matchThreadImage.length; i++) {
      if ((i + 1) % Math.sqrt(matchThreadImage.length) === 0) {
        let arr = matchThreadImage.slice(
          i + 1 - Math.sqrt(matchThreadImage.length),
          i + 1
        );

        setMatchThreadImageData((prev) => [...prev, ...[arr]]);
      }
    }
  }, [matchThreadImage]);

  const fetchAPI = (value) => {
    axios.defaults.headers.common["Authorization"] = token;

    let bodyParameters = {
      key: "value",
    };

    axios
      .get(`${http}/${value}`, bodyParameters)
      .then((response) => {
        setData(response.data);
      })
      .catch(console.log);
  };

  const fetchRound = (value) => {
    axios.defaults.headers.common["Authorization"] = token;
    console.log(value);

    let bodyParameters = {
      key: "value",
    };

    axios
      .get(`${http}/${value}`, bodyParameters)
      .then((response) => {
        setRoundData(response.data);
        console.log(response);
      })
      .catch(console.log);
  };

  const fetchMatch = (value) => {
    axios.defaults.headers.common["Authorization"] = token;
    console.log(value);

    let bodyParameters = {
      key: "value",
    };

    axios
      .get(`${http}/${value}`, bodyParameters)
      .then((response) => {
        setMatchData(response.data);
        console.log(response);
      })
      .catch(console.log);

    axios
      .get(`${http}/challenge/raw/${matchId}`, bodyParameters)
      .then((response) => {
        setMatchThread(response.data);
        console.log(response);
      });

    axios
      .get(`${http}/challenge/image/${matchId}`, bodyParameters)
      .then((response) => {
        setMatchThreadImage(response.data);
        console.log(matchThreadImage.length);
      });
  };

  return (
    <div>
      <Container className="mt-3">
        <Row>
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon">Http</InputGroup.Text>
              <FormControl
                placeholder="Your http here"
                aria-label="Your http here"
                aria-describedby="basic-addon"
                type="text"
                value={http}
                onChange={(e) => {
                  localStorage.setItem("http", `${e.target.value}`);
                  setHttp(`${e.target.value}`);
                  console.log(http);
                }}
              />
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon">Token</InputGroup.Text>
              <FormControl
                placeholder="Your token here"
                aria-label="Your token here"
                aria-describedby="basic-addon"
                type="text"
                value={token}
                onChange={(e) => {
                  localStorage.setItem("token", `${e.target.value}`);
                  setToken(`Bearer ${e.target.value}`);
                  console.log(token);
                }}
              />
            </InputGroup>
          </Col>
          <Col>
            <Button variant="primary" onClick={() => fetchAPI("tournament")}>
              Get Tournament
            </Button>{" "}
            <Button variant="primary" onClick={() => fetchAPI("round")}>
              Get Rounds
            </Button>
          </Col>
        </Row>
      </Container>
      <Container>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>id</th>
              <th>name</th>
              <th>description</th>
            </tr>
          </thead>
          <tbody>
            {data.map((data, index) => {
              return (
                <tr key={data.id}>
                  <td>{index}</td>
                  <td>{data.id}</td>
                  <td>{data.name}</td>
                  <td>{data.description}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Container>
      <Container>
        <Row>
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon">ID</InputGroup.Text>
              <FormControl
                placeholder="Your ID here"
                aria-label="Your ID here"
                aria-describedby="basic-addon"
                type="text"
                onChange={(e) => {
                  setId(`${e.target.value}`);
                }}
              />
            </InputGroup>
          </Col>
          <Col>
            <Button variant="primary" onClick={() => fetchRound(`round/${id}`)}>
              Get Round With ID
            </Button>
          </Col>
        </Row>
        <h2>Round</h2>
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>#</th>
              <th>id</th>
              <th>name</th>
              <th>description</th>
              <th>id_tournament</th>
              <th>active</th>
            </tr>
          </thead>
          <tbody>
            <tr key={roundData.id}>
              <td>{0}</td>
              <td>{roundData.id}</td>
              <td>{roundData.name}</td>
              <td>{roundData.description}</td>
              <td>{roundData.id_tournament}</td>
              <td>{roundData.active ? "True" : "False"}</td>
            </tr>
          </tbody>
        </Table>
        <h2>Matches from that round</h2>
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>#</th>
              <th>id</th>
              <th>name</th>
              <th>id_challenge</th>
              <th>id_round</th>
              <th>active</th>
            </tr>
          </thead>
          <tbody>
            {roundData.Matches === undefined || roundData.Matches === null
              ? null
              : roundData.Matches.map((data, index) => {
                  return (
                    <tr key={data.id}>
                      <td>{index}</td>
                      <td>{data.id}</td>
                      <td>{data.name}</td>
                      <td>{data.id_challenge}</td>
                      <td>{data.id_round}</td>
                      <td>{data.active ? "True" : "False"}</td>
                    </tr>
                  );
                })}
          </tbody>
        </Table>
      </Container>
      <Container>
        <Row>
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon">Match ID</InputGroup.Text>
              <FormControl
                placeholder="Your Match ID here"
                aria-label="Your Match ID here"
                aria-describedby="basic-addon"
                type="text"
                onChange={(e) => {
                  setMatchId(`${e.target.value}`);
                }}
              />
            </InputGroup>
          </Col>
          <Col>
            <Button
              variant="primary"
              onClick={() => fetchMatch(`match/${matchId}`)}
            >
              Get Match With Match ID
            </Button>
          </Col>
        </Row>
        <h2>Match</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>id</th>
              <th>name</th>
              <th>id_challenge</th>
              <th>id_round</th>
              <th>active</th>
            </tr>
          </thead>
          <tbody>
            <tr key={matchData.id}>
              <td>{0}</td>
              <td>{matchData.id}</td>
              <td>{matchData.name}</td>
              <td>{matchData.id_challenge}</td>
              <td>{matchData.id_round}</td>
              <td>{matchData.active ? "True" : "False"}</td>
            </tr>
          </tbody>
        </Table>
      </Container>
      <Container>
        <Row>
          <Col>
            {" "}
            <h2>Thread</h2>
            <Card className="my-3" style={{ width: "18rem" }}>
              <Card.Body>
                <Card.Title className="text-center">Thread</Card.Title>
                <Card.Text>{matchThread}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <h2>Thread Image</h2>
            <Card className="my-3" style={{ width: "18rem" }}>
              <Card.Body>
                <Card.Title className="text-center">Thread Image</Card.Title>
                <Container style={{ width: "100%" }}>
                  {matchThreadImageData.map((rowData, index) => {
                    return (
                      <Row key={index} className="justify-content-md-center">
                        {rowData.map((data, index) => {
                          return (
                            <Col key={index} className="p-0">
                              <img
                                alt=""
                                src={`data:image/jpeg;base64, ${data}`}
                                style={{ objectFit: "cover", width: "100%" }}
                              />
                            </Col>
                          );
                        })}
                      </Row>
                    );
                  })}
                </Container>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
