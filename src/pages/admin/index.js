import React, { Component } from 'react';
import { NavLink, Route } from 'react-router-dom';
import { Container, Row, Col, Tab, Nav } from 'react-bootstrap';
import Listings from './listings';
import Listing from './listing';
import BusinessReferral from './business-referral';
import Messages from '../messages';

class AdminPage extends Component {

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
                  to="/admin/listings"
                >
                  Listings
                </NavLink>
                <NavLink
                  activeClassName="nav-link active"
                  className="nav-link"
                  to="/admin/business"
                >
                  Referrals
                </NavLink>
                <NavLink
                  activeClassName="nav-link active"
                  className="nav-link"
                  to="/admin/messages"
                >
                  Messages
                </NavLink>
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                <Route path="/admin/listings" exact component={Listings} />
                <Route path="/admin/listing/:id" exact component={Listing} />
                <Route path="/admin/business" component={BusinessReferral} />
                <Route path="/admin/messages" component={Messages} />
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    );
  }
}

export default AdminPage;
