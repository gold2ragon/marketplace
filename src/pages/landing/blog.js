import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Iframe from 'react-iframe';

class Blog extends Component {

  constructor() {
    super();
    this.iframeRef = React.createRef();
    this.state = {
      iFrameHeight: '',
    }
  }

  // componentDidMount() {
  //   const obj = ReactDOM.findDOMNode(this);
  //   this.setState({iFrameHeight:  obj.contentWindow.document.body.scrollHeight + 'px'});
  // }

  resizeIframeHeight = (obj) => {
    console.log(obj.target.contentWindow);
  }

  render() {
    return (
      <div className="blog" style={{width:'100%', height:this.state.iFrameHeight, overflow:'auto'}}>
        <iframe src="https://thebizhunt.wordpress.com/"
          className="iframe-blog"
          onLoad={this.resizeIframeHeight}
        />
      </div>
    );
  }
}

export default Blog;