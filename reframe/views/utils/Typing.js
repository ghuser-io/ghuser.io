import React from 'react';

import Typed from 'typed.js';

export {Typing};

class Typing extends React.Component {
  componentDidMount() {
    new Typed(this.domEl, {
      strings: this.props.texts,
      typeSpeed: 25,
      backSpeed: 18,
      loop: true,
      backDelay: 1400,
    });
  }
  render() {
    const {className, style} = this.props;
    return (
      <span
        ref={domEl => this.domEl = domEl}
        {...{className, style}}
      />
    );
  }
}
