import React from 'react';
import LeftPanel from './LeftPanel';
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
        <div className="container container-lg">
          <div className="row">
            <LeftPanel/>
            <div className="col-9">Hello {this.props.route.args.name} {this.state.later}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
