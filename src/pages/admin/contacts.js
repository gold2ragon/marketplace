import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Table } from 'react-bootstrap';
import { getAllContacts, changeContactMarked } from '../../redux/actions/contacts';
import _ from 'lodash';

class Referrals extends Component {

  componentDidMount() {
    this.props.getAllContacts();
  }
  
  handleChanageContactMarked = (contact) => {
    this.props.changeContactMarked(contact);
  }

  renderContacts = () => {
    const { contacts } = this.props;
    if (!contacts) return null;
    const trs = _.map(contacts, (contact, id) => (
      <tr key={id}>
        <td>{contact.date}</td>
        <td>{contact.contactPersonName}</td>
        <td>{contact.contactPersonNumber}</td>
        <td>{contact.contactPersonEmail}</td>
        <td align="center">
            <Form.Check 
              custom
              type="checkbox"
              checked={contact.marked}
              id={id}
              label={``}
              onChange={() => this.handleChanageContactMarked(contact)}
            />
        </td>
      </tr>
    ));
    return (
      <tbody>{trs}</tbody>
    );
  }

  render() {
    return (
      <div className="profile-settings">
        <h3>Referrals</h3>
        <Table bordered hover>
          <thead className="thead-light">
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Contact Person Name</th>
              <th scope="col">Contact Person Number</th>
              <th scope="col">Contact Person Email</th>
              <th>Marked</th>
            </tr>
          </thead>
          {this.renderContacts()}
        </Table>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  contacts: state.admin.contacts,
});

const mapDispatchToProps = (dispatch) => ({
  getAllContacts: () => dispatch(getAllContacts()),
  changeContactMarked: (contact) => dispatch(changeContactMarked(contact)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Referrals);