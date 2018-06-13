/* eslint react/jsx-no-bind:0 */

/**
 * Fonio Application Component
 * =======================================
 *
 * Root component of the application.
 * @module fonio
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
} from 'react-router-dom';

import ReduxToastr from 'react-redux-toastr';

import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';

import Home from './features/HomeView/components/HomeViewContainer';
import Summary from './features/SummaryView/components/SummaryViewContainer';
import Section from './features/SectionView/components/SectionViewContainer';
import AuthWrapper from './features/AuthManager/components/AuthManagerContainer';
import EditionUiWrapper from './features/EditionUiWrapper/components/EditionUiWrapperContainer';
import ToasterContainer from './features/ConnectionsManager/components/ToasterContainer';


import * as connectionsDuck from './features/ConnectionsManager/duck';
import * as userInfoDuck from './features/UserInfoManager/duck';

import generateRandomUserInfo from './helpers/userInfo';

import 'quinoa-design-library/themes/millet/style.css';
import './Application.scss';

const ProtectedRoutes = ({match}) => {

  return (
    <AuthWrapper>
      <EditionUiWrapper>
        <ToasterContainer>
          <Route exact path={match.path} component={Summary} />
          <Route exact path={`${match.path}/section/:sectionId`} component={Section} />
        </ToasterContainer>
      </EditionUiWrapper>
    </AuthWrapper>
  );
};

/**
 * Renders the whole fonio application
 * @return {ReactComponent} component
 */
@connect(
  state => ({
    ...connectionsDuck.selector(state.connections),
    ...userInfoDuck.selector(state.userInfo),
    loadingBar: state.loadingBar.default,
    lang: state.i18nState.lang,
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...userInfoDuck,
      ...connectionsDuck,
    }, dispatch)
  })
)
export default class Application extends Component {

  /**
   * constructorstorestore
   * @param {object} props - properties given to instance at instanciation
   */
  constructor(props) {
    super(props);
    this.confirmExit = this.confirmExit.bind(this);
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.confirmExit);
  }

  componentWillReceiveProps = nextProps => {
    if (this.props.userId !== nextProps.userId && nextProps.userId) {
      const userId = nextProps.userId;
      const userInfo = localStorage.getItem('fonio_user_info');
      let userInfoOk;
      if (userInfo) {
        try {
          userInfoOk = JSON.parse(userInfo);
        }
        catch (e) {
          userInfoOk = generateRandomUserInfo(this.props.lang);
        }
      }
      else {
        userInfoOk = generateRandomUserInfo(this.props.lang);
      }
      userInfoOk.userId = userId;
      this.props.actions.setUserInfo(userInfoOk);
      this.props.actions.createUser(userInfoOk);
    }
  }

  confirmExit(e) {
    const {loadingBar} = this.props;
    if (loadingBar > 0) {
      const confirmationMessage = '\o/';
      e.returnValue = confirmationMessage; // Gecko, Trident, Chrome 34+
      return confirmationMessage;
    }
  }
  render() {
    const {
      props: {
        // usersNumber,
        userId
      }
    } = this;
    return (
      <Router basename={CONFIG.urlPrefix || '/' /* eslint no-undef : 0 */}>
        <div id="wrapper" className="fonio">
          {userId &&
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/story/:storyId" component={ProtectedRoutes} />
            <Route render={(props) => (
                  // TODO: render proper loading/error page
              <h2>
                    No match for {props.location.pathname}, go back to <Link to="/">Home page</Link>
              </h2>
                )} />
          </Switch>
            }
          <ReduxToastr
            timeOut={3000}
            newestOnTop={false}
            preventDuplicates
            position="top-right"
            transitionIn="fadeIn"
            transitionOut="fadeOut" />
        </div>
      </Router>
    );
  }
}
