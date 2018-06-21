import React from 'react';
import NavBar from './NavBar';
import './All.css';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      later: 'later',
    };
  }

  componentDidMount() {
    this.timerId = setTimeout(
      () => this.update(),
      5000,
    );
  }

  componentWillUnmount() {
    clearTimeout(this.timerId);
  }

  update() {
    this.setState({
      later: 'updated',
    });
  }

  render() {
    return (
      <div>
        <NavBar/>
        <div className="container-lg">
          Hello {this.props.route.args.name} {this.state.later}
        </div>
      </div>
    );
  }
}

export default Profile;
