import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { auth, createUserProfileDocument } from './firebase';
import { setCurrentUser } from './redux/actions/auth';
import { selectCurrentUser } from './redux/actions/auth';
import Header from './pages/header';
import Homepage from './pages/homepage';
import './app.scss';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
  unsubscribeFromAuth = null;

  componentDidMount() {
    console.log('componentDidMount');
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
      }

      setCurrentUser(userAuth);
    });
  }

  render() {
    return (
      <Container>
        <Header />
        <Router>
          <Switch>
            <Route exact path="/" component={Homepage} />
          </Switch>
        </Router>
      </Container>
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
