import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { auth, createUserProfileDocument } from './firebase';
import { setCurrentUser } from './redux/actions/auth';
import { selectCurrentUser } from './redux/actions/auth';
import Header from './pages/header';
import Homepage from './pages/homepage';
import Profile from './pages/profile';
import LinkedInPopUp from './pages/auth/linkedin/LinkedInPopUp';

import './app.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

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
    return (
      <div>
        <Header />
        <Router>
          <Switch>
            <Route exact path="/" component={Homepage} />
            <Route exact path="/linkedin" component={LinkedInPopUp} />
            {isLoggedIn && (
              <Fragment>
                <Route exact path="/mypage/:id" component={Profile} />
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
