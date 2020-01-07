import React, { Component, Fragment } from 'react';
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
      images: [],
      imageLinks: [],
      uploadComplete: false,
      description: '',
      details: '',
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
  };

  onFilesDrop = (files) => {
    const images = [];
    for (const file of files) {
      images.push({
        file,
        url: URL.createObjectURL(file),
      });
    }
    this.setState({
      images: this.state.images.concat(images),
    });
  };

  uploadPhotos = async () => {
    const storageRef = firebase
    .storage()
    .ref("listings");
    const uploadFileRefs = [];
    const uploadTasks = [];
    const { images } = this.state;
    for (const image of images) {
      const ext = extractExtension(image.file.name);
      const filename = `${generateRandomFilename()}${ext}`;
      const fileRef = storageRef.child(filename);
      uploadFileRefs.push(fileRef);
      uploadTasks.push(fileRef.put(image.file));
    }

    await Promise.all(uploadTasks);
    const imageUrls = [];
    for (const snapshot of uploadFileRefs) {
      const url = await snapshot.getDownloadURL();
      imageUrls.push(url);
    }
    this.setState({ imageLinks: imageUrls });
  }

  handleSubmit = async (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      this.setState({ validated: true });
      return;
    }
    event.preventDefault();

    await this.uploadPhotos();
  };

  deletePhoto = (event) => {
    event.stopPropagation();
    const index = parseInt(event.target.name);
    let { images } = this.state;
    images.splice(index, 1);
    this.setState({ images });
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
              name="cuisineType"
              value={cuisineType}
              onChange={this.handleChange}
            >
              <option disabled value={-1} hidden>
                Make a selection
              </option>
              <option>Singaporean</option>
              <option>Chinese</option>
              <option>Street Food</option>
            </Form.Control>
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
                    {this.state.images.length > 0 ? (
                      <Fragment>
                        {this.state.images.map((image, index) => (
                          <div key={index} className="remove-photo">
                            {/* <img alt="Preview" key={index} src={image.url} />
                            <button onClick={this.deletePhoto} name={index}>
                              &times;
                            </button> */}
                            <span>
                              {image.file.name}
                              <button onClick={this.deletePhoto} name={index}>
                                &times;
                              </button>
                            </span>
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

export default PostListing;
