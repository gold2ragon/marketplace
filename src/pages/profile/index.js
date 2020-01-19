import React, { Component } from 'react';
import { NavLink, Route } from 'react-router-dom';
import { Container, Row, Col, Tab, Nav } from 'react-bootstrap';
import Settings from './settings';
import ReferContacts from './refer';
import Messages from '../messages';

class Profile extends Component {

  render() {
    return (
      <Container className="body">
        <Tab.Container defaultActiveKey="first">
          <Row>
            <Col sm={3} className="sidebar">
              <Nav variant="pills" className="flex-column">
                <NavLink
                  activeClassName="nav-link active"
                  className="nav-link"
                  to="/mypage/settings"
                >
                  Settings
                </NavLink>
                <NavLink
                  activeClassName="nav-link active"
                  className="nav-link"
                  to="/mypage/contacts"
                >
                  Refer Someone
                </NavLink>
                {/* <NavLink
                  activeClassName="nav-link active"
                  className="nav-link"
                  to="/mypage/messages"
                >
                  Messages
                </NavLink> */}
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                <Route path="/mypage/settings" exact component={Settings} />
                <Route path="/mypage/contacts" component={ReferContacts} />
                <Route path="/mypage/messages" component={Messages} />
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    );
  }
}

export default Profile;
