import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { saveListing, getListings } from '../../redux/actions/listing';
import { Form, Row, Col, Button, Spinner } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import generateRandomID from 'uuid/v4';
import ReactQuill from 'react-quill';
import firebase from '../../firebase';
import { history } from '../../App';
import numeral from 'numeral';
import 'react-quill/dist/quill.snow.css';
import './post-listing.scss';

const generateRandomFilename = () => generateRandomID();
function extractExtension(filename) {
  let ext = /(?:\.([^.]+))?$/.exec(filename);
  if (ext != null && ext[0] != null) {
    return ext[0];
  } else {
    return '';
  }
}

class Listing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: 'new',
      validated: false,
      cuisineType: -1,
      restaurantName: '',
      cuisineDescription: '',
      franchiseFee: '',
      photos: [],
      files: [],
      uploadComplete: false,
      description: '',
      details: '',
      invalidCusinType: false,
      deletedPhotos: [],
      isSaving: false,
      isFeatured: false,
    };

    this.modules = {
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ align: [] }],
        [{ color: [] }, { background: [] }],
        ['link', 'image', 'video'],
        ['clean'],
      ],
    };

    this.formats = [
      'header', 'font', 'size',
      'bold',
      'italic',
      'underline',
      'strike',
      'blockquote',
      'list',
      'bullet',
      'align',
      'color',
      'link',
      'image',
      'video',
      'background',
    ];
  }

  async componentDidMount() {
    const { id } = this.props.match.params;
    if (id !== 'new') {
      await this.props.getListings();
      const listing = this.props.listings[id];
      this.setState({
        id,
        cuisineType: listing.public.cuisineType,
        cuisineDescription: listing.public.cuisineDescription,
        franchiseFee: listing.public.franchiseFee,
        restaurantName: listing.public.restaurantName,
        photos: listing.public.photos,
        description: listing.public.description,
        details: listing.private.details,
        isFeatured: listing.isFeatured,
      });
    }
  }

  handleChange = (event) => {
    let { name, value } = event.target;
    if (name === 'franchiseFee') {
      console.log('======', value);
      value = numeral(value).value();
    }
    this.setState({ [name]: value });
    if (name === 'cuisineType') {
      this.setState({ invalidCusinType: false });
    }
  };

  onFilesDrop = (files) => {
    const photos = [];
    for (const file of files) {
      photos.push(URL.createObjectURL(file));
    }
    this.setState({
      photos: this.state.photos.concat(photos),
      files: this.state.files.concat(files),
    });
  };

  uploadPhotos = async () => {
    const storageRef = firebase.storage().ref('listings');
    const uploadFileRefs = [];
    const uploadTasks = [];
    const { files } = this.state;
    const photos = [];
    for (const photo of this.state.photos) {
      if (photo.includes('firebasestorage.googleapis.com')) {
        photos.push(photo);
      }
    }

    for (const file of files) {
      const ext = extractExtension(file.name);
      const filename = `${generateRandomFilename()}${ext}`;
      const fileRef = storageRef.child(filename);
      uploadFileRefs.push(fileRef);
      uploadTasks.push(fileRef.put(file));
    }

    await Promise.all(uploadTasks);
    for (const snapshot of uploadFileRefs) {
      const url = await snapshot.getDownloadURL();
      photos.push(url);
    }
    this.setState({ photos });
  };

  handleSubmit = async (event) => {
    let valid = true;
    if (this.state.cuisineType === -1) {
      this.setState({ invalidCusinType: true });
      valid = false;
    }

    const form = event.currentTarget;
    if (form.checkValidity() === false || !valid) {
      event.preventDefault();
      event.stopPropagation();
      this.setState({ validated: true });
      return;
    }
    event.preventDefault();

    this.setState({
      isSaving: true,
    });

    for (const photo of this.state.deletedPhotos) {
      if (photo.includes('blob')) continue;
      const filename = photo.match(/%2F(.*?)\?alt/)[1];
      await firebase.storage().ref(`listings/${filename}`).delete();
    }

    await this.uploadPhotos();
    await this.props.saveListing(this.state.id, {
      public: {
        cuisineType: this.state.cuisineType,
        restaurantName: this.state.restaurantName,
        cuisineDescription: this.state.cuisineDescription,
        franchiseFee: parseInt(this.state.franchiseFee),
        photos: this.state.photos,
        description: this.state.description,
      },
      private: {
        details: this.state.details,
      },
      isFeatured: this.state.isFeatured,
    });
    this.setState({ isSaving: false });
    history.goBack();
  };

  deletePhoto = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const index = parseInt(event.target.name);
    let { photos, files, deletedPhotos } = this.state;
    const deletedPhoto = photos[index];
    deletedPhotos.push(deletedPhoto);
    photos.splice(index, 1);
    if (files.length > 0) files.splice(index, 1);
    this.setState({
      photos,
      files,
      deletedPhotos,
    });
  };

  handleChangeDescription = (html) => {
    this.setState({ description: html });
  };

  handleChangeDetails = (html) => {
    this.setState({ details: html });
  };

  handleFeaturedSelect = () => {
    this.setState({
      isFeatured: !this.state.isFeatured,
    })
  }

  render() {
    const {
      id,
      validated,
      cuisineType,
      restaurantName,
      cuisineDescription,
      franchiseFee,
      description,
      details,
      invalidCusinType,
      isSaving,
      isFeatured,
    } = this.state;

    return (
      <Form id="post-listing" noValidate validated={validated} onSubmit={this.handleSubmit}>
        <Form.Group as={Row}>
          <Form.Label column md={3}>
            Cuisine Type
          </Form.Label>
          <Col md={5}>
            <Form.Control
              as="select"
              className={invalidCusinType ? 'invalid-control' : ''}
              name="cuisineType"
              value={cuisineType}
              onChange={this.handleChange}
              required
            >
              <option disabled value={-1} hidden>
                Make a selection
              </option>
              <option>Singaporean</option>
              <option>Chinese</option>
              <option>Japanese</option>
              <option>Halal/Vegetarian</option>
            </Form.Control>
            {invalidCusinType && <div className="invalid-field">Please select cuisine type</div>}
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column md={3}>
            Restaurant Name
          </Form.Label>
          <Col md={5}>
            <Form.Control
              type="text"
              name="restaurantName"
              value={restaurantName}
              placeholder="Restaurant Name"
              onChange={this.handleChange}
              required
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column md={3}>
            Franchise Fee
          </Form.Label>
          <Col md={5}>
            <Form.Control
              name="franchiseFee"
              value={numeral(franchiseFee).format('0,0')}
              placeholder="SS$25,000"
              onChange={this.handleChange}
              required
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column md={3}>
            Cuisine Description
          </Form.Label>
          <Col md={9}>
            <Form.Control
              type="text"
              name="cuisineDescription"
              value={cuisineDescription}
              placeholder="Conveyor Belt Sushi"
              onChange={this.handleChange}
              required
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column md={3}>
            Photos
          </Form.Label>
          <Col md={9}>
            <Dropzone onDrop={this.onFilesDrop}>
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div className="drag-drop-files" {...getRootProps()}>
                    <input {...getInputProps()} />
                    {this.state.photos.length > 0 ? (
                      <Fragment>
                        {this.state.photos.map((url, index) => (
                          <div key={index} className="listing-picture">
                            <img alt="Preview" key={index} src={url} />
                            <button onClick={this.deletePhoto} name={index}>
                              &times;
                            </button>
                          </div>
                        ))}
                      </Fragment>
                    ) : (
                      <span>Upload up to 10</span>
                    )}
                  </div>
                </section>
              )}
            </Dropzone>
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column md={3}>
            Description
          </Form.Label>
          <Col md={9}>
            <ReactQuill
              value={description || ''}
              onChange={this.handleChangeDescription}
              modules={this.modules}
              formats={this.formats}
            />
          </Col>
        </Form.Group>
        <br />
        <hr style={{marginTop: '50px'}}/>
        <h3>Non-public Information</h3>
        <Form.Group as={Row}>
          <Form.Label column md={3}>
            Details
          </Form.Label>
          <Col md={9}>
            <ReactQuill
              value={details || ''}
              onChange={this.handleChangeDetails}
              modules={this.modules}
              formats={this.formats}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="admin-is-featured">
          <Form.Label column xs={3}>
            Featured
          </Form.Label>
          <Col xs={9}>
            <Form.Check 
              custom
              type="checkbox"
              checked={isFeatured}
              id={id}
              label={``}
              onChange={() => this.handleFeaturedSelect()}
            />
          </Col>
        </Form.Group>
        <div>
          <Button variant="secondary" className="btn-main" type="submit" disabled={isSaving}>
            Publish
            {isSaving && (
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
            )}
          </Button>
        </div>
      </Form>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  listings: state.admin.listings,
});

const mapDispatchToProps = (dispatch) => ({
  saveListing: (id, data) => dispatch(saveListing(id, data)),
  getListings: () => dispatch(getListings()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Listing);
