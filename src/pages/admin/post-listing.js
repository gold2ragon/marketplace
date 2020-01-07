import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { addListing } from '../../redux/actions/listing';
import { Form, Row, Col, Button } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import generateRandomID from 'uuid/v4';
import ReactQuill from 'react-quill';
import firebase from '../../firebase';
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

class PostListing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      validated: false,
      cuisineType: -1,
      cuisineDescription: '',
      franchiseFee: '',
      photos: [],
      files: [],
      uploadComplete: false,
      description: '',
      details: '',
      invalidCusinType: false,
    };

    this.modules = {
      toolbar: [
        // [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
        // [{size: []}],
        // [{ 'font': [] }],
        // [{ 'size': ['small', false, 'large', 'huge'] }],
        // [{ 'size': [ '10px', '12px', '14px', '16px', '18px', '20px', '22px', '24px'] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ align: [] }],
        [{ color: [] }, { background: [] }],
        ['link', 'image', 'video'],
        ['clean'],
      ],
    };

    this.formats = [
      // 'header', 'font', 'size',
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

  handleChange = (event) => {
    const { name, value } = event.target;
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
    this.setState({ photos, files });
  };

  uploadPhotos = async () => {
    const storageRef = firebase.storage().ref('listings');
    const uploadFileRefs = [];
    const uploadTasks = [];
    const { files } = this.state;
    for (const file of files) {
      const ext = extractExtension(file.name);
      const filename = `${generateRandomFilename()}${ext}`;
      const fileRef = storageRef.child(filename);
      uploadFileRefs.push(fileRef);
      uploadTasks.push(fileRef.put(file));
    }

    await Promise.all(uploadTasks);
    const photos = [];
    for (const snapshot of uploadFileRefs) {
      const url = await snapshot.getDownloadURL();
      photos.push(url);
    }
    this.setState({ photos });
  };

  handleSubmit = async (event) => {
    let valid = true;
    if (this.state.cuisineType ===  -1) {
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

    await this.uploadPhotos();
    this.props.addListing({
      public: {
        cuisineType: this.state.cuisineType,
        cuisineDescription: this.state.cuisineDescription,
        franchiseFee: this.state.franchiseFee,
        photos: this.state.photos,
        description: this.state.description,
      },
      private: {
        details: this.state.details,
      }
    });
  };

  deletePhoto = (event) => {
    event.stopPropagation();
    const index = parseInt(event.target.name);
    let { photos, files } = this.state;
    photos.splice(index, 1);
    if (files.length > 0) files.splice(index, 1);
    this.setState({ photos, files });
  };

  handleChangeDescription = (html) => {
    this.setState({ description: html });
  };

  handleChangeDetails = (html) => {
    this.setState({ details: html });
  };

  render() {
    const {
      validated,
      cuisineType,
      cuisineDescription,
      franchiseFee,
      description,
      details,
      invalidCusinType,
    } = this.state;
    return (
      <Form id="post-listing" noValidate validated={validated} onSubmit={this.handleSubmit}>
        <Form.Group as={Row}>
          <Form.Label column sm={3}>
            Cuisine Type
          </Form.Label>
          <Col sm={5}>
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
              <option>Street Food</option>
            </Form.Control>
            {invalidCusinType && (
              <div className="invalid-field">Please select cuisine type</div>
            )}
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm={3}>
            Cuisine Description
          </Form.Label>
          <Col sm={5}>
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
          <Form.Label column sm={3}>
            Franchise Fee
          </Form.Label>
          <Col sm={5}>
            <Form.Control
              type="number"
              name="franchiseFee"
              value={franchiseFee}
              placeholder="US$25,000"
              onChange={this.handleChange}
              required
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm={3}>
            Photos
          </Form.Label>
          <Col sm={9}>
            <Dropzone onDrop={this.onFilesDrop}>
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div className="drag-drop-files" {...getRootProps()}>
                    <input {...getInputProps()} />
                    {this.state.photos.length > 0 ? (
                      <Fragment>
                        {this.state.photos.map((url, index) => (
                          <div key={index} className="remove-photo">
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
          <Form.Label column sm={3}>
            Description
          </Form.Label>
          <Col sm={9}>
            <ReactQuill
              value={description || ''}
              onChange={this.handleChangeDescription}
              modules={this.modules}
              formats={this.formats}
            />
          </Col>
        </Form.Group>
        <br />
        <hr />
        <h3>Non-public Information</h3>
        <Form.Group as={Row}>
          <Form.Label column sm={3}>
            Description
          </Form.Label>
          <Col sm={9}>
            <ReactQuill
              value={details || ''}
              onChange={this.handleChangeDetails}
              modules={this.modules}
              formats={this.formats}
            />
          </Col>
        </Form.Group>
        <div>
          <Button variant="secondary" className="btn-main" type="submit">
            Publish
          </Button>
        </div>
      </Form>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
  addListing: (data) => dispatch(addListing(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostListing);
