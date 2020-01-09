import React, { Component, Fragment } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { auth, createUserProfileDocument } from './firebase';
import { setCurrentUser } from './redux/actions/auth';
import { selectCurrentUser } from './redux/actions/auth';
import Header from './pages/landing/header';
import Homepage from './pages/landing/homepage';
import Profile from './pages/profile';
import AdminPage from './pages/admin';
import LinkedInPopUp from './pages/auth/linkedin/LinkedInPopUp';

import './app.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

export const history = createBrowserHistory();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
    };
  }

  unsubscribeFromAuth = null;

  componentDidMount() {
    const { setCurrentUser } = this.props;

    this.unsubscribeFromAuth = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth);

        userRef.onSnapshot((snapShot) => {
          setCurrentUser({
            id: snapShot.id,
            ...snapShot.data(),
          });
        });
        this.setState({ isLoggedIn: true });
      } else {
        this.setState({ isLoggedIn: false });
      }
      setCurrentUser(userAuth);
    });
  }

  render() {
    const { isLoggedIn } = this.state;
    const { currentUser } = this.props;
    return (
      <div>
        <Router history={history}>
          <Header />
          <Switch>
            <Route exact path="/" component={Homepage} />
            <Route exact path="/linkedin" component={LinkedInPopUp} />
            {isLoggedIn && (
              <Fragment>
                <Route exact path="/mypage/:id" component={Profile} />
                {currentUser && currentUser.admin && (
                  <Fragment>
                    <Route exact path="/admin/listing/:id" component={AdminPage} />
                    <Route exact path="/admin/:page" component={AdminPage} />
                  </Fragment>
                )}
              </Fragment>
            )}
          </Switch>
        </Router>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
