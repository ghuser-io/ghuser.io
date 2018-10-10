import React from 'react';

import Content from '../Content';
import NavBar from '../NavBar';
import PageContent from '../PageContent';
import '../All.css';

import LeftPanel from './leftpanel/LeftPanel';
import RightPanel from './rightpanel/RightPanel';
import './Profile.css';
import assert_internal from 'reassert/internal';

export {Profile};

class Profile extends React.Component {
  constructor(props) {
    super(props);
    if( ! props.isServerRendering ) {
      this.state = {
        doNotRenderYet: true,
      };
    }
  }
  componentDidMount() {
    this.setState({doNotRenderYet: false});
  }
  render() {
    const {props} = this;

    assert_internal(props.doNotRender===undefined || props.isServerRendering);
    const showLoadingIcon = props.isServerRendering ? props.doNotRender : this.state.doNotRenderYet;

    const content = (
      showLoadingIcon ? (
        <div className="col-12 pl-2 pr-0"><i className="fas fa-spinner fa-pulse"></i> <span>{props.username+"'s profile"}</span></div>
      ) : (
        <React.Fragment>
          <LeftPanel user={props.user} contribs={props.contribs}
                     orgsData={props.orgsData} />
          <RightPanel username={props.user.login}
                      fetchedat={props.user.contribs && props.user.contribs.fetched_at}
                      contribs={props.contribs}
                      being_created={props.user.ghuser_being_created}
                      deleted_because={props.user.ghuser_deleted_because}
                      allRepoData={props.allRepoData}
                      profilesBeingCreated={props.profilesBeingCreated} />
        </React.Fragment>
      )
    );

    return (
      <PageContent>
        <NavBar/>
        <Content>
          <div className="container container-lg mt-2">
            <div className="row">
              { content }
            </div>
          </div>
        </Content>
      </PageContent>
    );
  }
}
