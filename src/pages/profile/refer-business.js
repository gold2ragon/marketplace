import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Button, FormGroup, Table } from 'react-bootstrap';
import { getUserBusiness, submitUserBusiness } from '../../redux/actions/business';

class ReferBusiness extends Component {
  constructor(props) {
    super(props);

    this.state = {
      validated: false,
      businessName: '',
      websiteUrl: '',
      contactPersonName: '',
      contactPersonNumber: '',
      contactPersonEmail: '',
      business: [],
    };
  }

  componentDidMount() {
    this.props.getUserBusiness();
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
      business,
      contactPersonName,
      contactPersonEmail,
      contactPersonNumber,
    } = this.state;

    business.push({
      date: new Date().toDateString(),
      contactPersonName,
      contactPersonEmail,
      contactPersonNumber,
    });
    this.props.submitUserBusiness(business);
  }

  renderBusiness = () => {
    const { business } = this.props;
    if (!business || business.length === 0) return null;
    const trs = business.map((busin, index) =>
      <tr key={index}>
        <td>{busin.date}</td>
        <td>{busin.contactPersonName}</td>
        <td>{busin.contactPersonNumber}</td>
        <td>{busin.contactPersonEmail}</td>
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
          {this.renderBusiness()}
        </Table>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  business: state.user.business,
});

const mapDispatchToProps = (dispatch) => ({
  getUserBusiness: () => dispatch(getUserBusiness()),
  submitUserBusiness: (business) => dispatch(submitUserBusiness(business)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ReferBusiness);