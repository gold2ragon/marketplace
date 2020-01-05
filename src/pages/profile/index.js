import React, { Component } from 'react';
import { Container, Row, Col, Tab, Nav } from 'react-bootstrap';
import Settings from './settings';
import ReferBusiness from './refer-business';

class Profile extends Component {

  constructor(props) {
    super(props);
    this.defaultTab = React.createRef();
  }
  
  componentDidMount() {
    this.defaultTab.current.click();
  }

  render() {
    return (
      <Container className="body">
        <Tab.Container defaultActiveKey="first">
          <Row>
            <Col sm={3} className="sidebar">
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link ref={this.defaultTab} eventKey="settings">Settings</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="refer-a-business">List/Refer a Business</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="ndas">NDAs</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="messages">Messages</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                <Tab.Pane eventKey="settings">
                  <Settings />
                </Tab.Pane>
                <Tab.Pane eventKey="refer-a-business">
                  <ReferBusiness />
                </Tab.Pane>
                <Tab.Pane eventKey="ndas">NDAs</Tab.Pane>
                <Tab.Pane eventKey="messages">Messages</Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    );
  }
}

export default Profile;
