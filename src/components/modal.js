import React, { Component } from 'react';
import FadeInUp from './transitions/fade-in-up';
import './modal.scss';

class Modal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: true,
    };

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ showModal: false });
    }
  }

  render() {
    if (this.state.showModal) {
      return (
        <div className="modal">
          <FadeInUp>
            <div className="modal-content">
              <div ref={this.setWrapperRef}>
                {this.props.children}
              </div>
            </div>
          </FadeInUp>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default Modal;
