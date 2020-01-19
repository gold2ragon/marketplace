import React, { Component, Fragment } from 'react';
import { Row, Col, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class Footer extends Component {
  
  state = {
    showModal: false,
    title: {
      'TsCs': 'Terms & Conditions',
      'Privacy-Policy': 'Privacy & Policy',
    },
    content: '',
  }

  showModal = (content) => {
    this.setState({
      showModal: true, 
      content,
    });
  }

  hideModal = () => {
    this.setState({ showModal: false });
  }
  
  render() {
    const { showModal, title, content } = this.state;
    return (
      <Fragment>
        <Row id="footer">
          <Col lg={6} md={12}>
            <Link className="home-link" to="/">
              TheBiz<span>Hunt.</span>
            </Link>
            <span className="link" onClick={() => this.showModal('TsCs')}>{`Terms & Conditions`}</span>
            <span className="link" onClick={() => this.showModal('Privacy-Policy')} to="/privacy-policy">Privacy Policy</span>
            <a href="/blog" target="_blank">Blog</a>
          </Col>
          <Col lg={6} md={12}>
            <span className="link company-info">
              &copy;TheBizHunt Pte Ltd
              <br />
              Singapore UEN 201934410G
            </span>
            <div>
              <a className="link" href="https://www.facebook.com/thebizhunt/" target="_blank" rel="noopener noreferrer">
                <i className="fa fa-facebook-square"></i>
              </a>
              <a className="link" href="https://www.instagram.com/thebizhunt/" target="_blank" rel="noopener noreferrer">
                <i className="fa fa-instagram"></i>
              </a>
            </div>
          </Col>
        </Row>
        {showModal && (
          <Modal
            centered
            size="lg"
            show={showModal}
            animation={true}
            onHide={this.hideModal}
            className="privacy-policy"
          >
            <Modal.Header closeButton>
              <Modal.Title id="example-custom-modal-styling-title">
                { title[content] }
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <iframe title="tos" src={`/${content}`} />
            </Modal.Body>
            <Modal.Footer>
              <button className="btn-main" onClick={this.hideModal}>
                Close
              </button>
            </Modal.Footer>
          </Modal>
        )}
      </Fragment>
    );
  }
}

export default Footer;
