import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getListings, deleteListing } from '../../redux/actions/listing';
import { Form, Button, FormGroup, Table } from 'react-bootstrap';
import _ from 'lodash';

class Listings extends Component {
  componentDidMount() {
    this.props.getListings();
  }

  renderBusiness = () => {
    const { listings } = this.props;
    if (!listings) return null;
    console.log(listings);
    const trs = _.map(listings, (listing, id, index) => (
        <tr key={index}>
          <td>{listing.public.cuisineType}</td>
          <td>{listing.public.cuisineDescription}</td>
          <td>{listing.public.franchiseFee}</td>
          <td>
            <Link to={`/admin/listing/${id}`} className="btn btn-primary">
              Edit
            </Link>
            &nbsp;
            <Button variant="danger" onClick={() => this.props.deleteListing(id)}>Delete</Button>
          </td>
        </tr>
    ));
    return <tbody>{trs}</tbody>;
  };

  render() {
    const { listings } = this.props;
    console.log(listings);
    return (
      <div>
        <p>
          <Link to="/admin/listing/new" className="btn btn-success">
            + Add Listing
          </Link>
        </p>

        <Table bordered hover>
          <thead className="thead-light">
            <tr>
              <th scope="col">Cuisine Type</th>
              <th scope="col">Cuisine Description</th>
              <th scope="col">Franchise Fee</th>
              <th></th>
            </tr>
          </thead>
          {this.renderBusiness()}
        </Table>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  listings: state.admin.listings,
});

const mapDispatchToProps = (dispatch) => ({
  getListings: () => dispatch(getListings()),
  deleteListing: (id) => dispatch(deleteListing(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Listings);
