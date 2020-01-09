import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Button, FormGroup, Table } from 'react-bootstrap';
import { getUserContacts, submitUserContacts } from '../../redux/actions/contacts';
import generateRandomID from 'uuid/v4';
import _ from 'lodash';

class ReferContacts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      validated: false,
      contactPersonName: '',
      contactPersonNumber: '',
      contactPersonEmail: '',
      contacts: {},
    };
  }

  componentDidMount() {
    this.props.getUserContacts();
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmit = async (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.setState({ validated: true });
    event.preventDefault();

    const {
      contactPersonName,
      contactPersonEmail,
      contactPersonNumber,
    } = this.state;

    let { contacts } = this.props;

    const id = generateRandomID();

    if (!contacts) contacts = {};

    contacts[id] = {
      id,
      userId: this.props.currentUser.id,
      date: new Date().toDateString(),
      contactPersonName,
      contactPersonEmail,
      contactPersonNumber,
    };
    await this.props.submitUserContacts(contacts);
    this.setState({
      contactPersonName: '',
      contactPersonEmail: '',
      contactPersonNumber: '',
      validated: false,
    })
  }

  renderContacts = () => {
    const { contacts } = this.props;
    if (!contacts || contacts.length === 0) return null;
    const trs = _.map(contacts, (contact, id) =>
      <tr key={id}>
        <td>{contact.date}</td>
        <td>{contact.contactPersonName}</td>
        <td>{contact.contactPersonNumber}</td>
        <td>{contact.contactPersonEmail}</td>
      </tr>
    );
    return (
      <tbody>{trs}</tbody>
    );
  }

  render() {
    const {
      validated,
      contactPersonName,
      contactPersonEmail,
      contactPersonNumber,
    } = this.state;
    return (
      <div className="profile-settings">
        <h3>Refer Someone</h3>
        <br />
        <div>
          Refer a Franchisee to us!<br />
          Know someone that might be interested in buying a franchise?<br />
          Send us their contact details and we will do all the rest!<br />
          Receive a referral fee when they open a franchise.
        </div>
        <br />
        <Form noValidate validated={validated} onSubmit={this.handleSubmit}>
          <FormGroup>
            <Form.Control
              type="text"
              name="contactPersonName"
              value={contactPersonName}
              placeholder="Contact Person Name"
              onChange={this.handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Form.Control
              type="text"
              name="contactPersonNumber"
              value={contactPersonNumber}
              placeholder="Contact Person Number"
              onChange={this.handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Form.Control
              type="text"
              name="contactPersonEmail"
              value={contactPersonEmail}
              placeholder="Contact Person Email"
              onChange={this.handleChange}
              required
            />
          </FormGroup>
          <Button variant="secondary" className="btn-main" type="submit">
            Submit
          </Button>
        </Form>
        <br />

        <h3>Past Referrals</h3>
        <Table bordered hover>
          <thead className="thead-light">
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Contact Person Name</th>
              <th scope="col">Contact Person Number</th>
              <th scope="col">Contact Person Email</th>
            </tr>
          </thead>
          {this.renderContacts()}
        </Table>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  contacts: state.user.contacts,
});

const mapDispatchToProps = (dispatch) => ({
  getUserContacts: () => dispatch(getUserContacts()),
  submitUserContacts: (contacts) => dispatch(submitUserContacts(contacts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ReferContacts);