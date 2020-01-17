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

  componentDidMount() {
    const obj = ReactDOM.findDOMNode(this);
    this.setState({iFrameHeight:  obj.contentWindow.document.body.scrollHeight + 'px'});
  }
  
  // resizeIframe = (iframe) => {
  //   console.log('====', iframe.target);
  //   const obj = iframe.target;
  //   obj.style.height = obj.contentWindow.document.documentElement.scrollHeight + 'px';
  //   // this.iframeRef.current.style.height = this.iframeRef.current.contentWindow.document.documentElement.scrollHeight + 'px';
  // }

  componentDidMount() {
    console.log('componentDidMount');
  }

  render() {
    return (
      <div className="blog" style={{width:'100%', height:this.state.iFrameHeight, overflow:'auto'}}>
        <Iframe url="https://thebizhunt.wordpress.com/"
          position="absolute"
          width="100%"
          id="myId"
          className="iframe-blog"
          height="100%"
          styles={{height: "25px"}}
        />
      </div>
    );
  }
}

export default Blog;