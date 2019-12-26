import React from 'react';
import { NavLink, Route } from 'react-router-dom';
import styles from './mainPage.module.css';
import Settings from './Settings';
import ReferBusiness from './ReferBusiness';
import Ndas from './Ndas';
import Messages from './Messages';


export default props => {
  return (
    <div className={styles.container}>
      <div className={`navbar-nav ${styles.nav}`}>
        <NavLink activeClassName={styles.active} exact to='/'>Settings </NavLink>
        <NavLink activeClassName={styles.active} exact to='/business'> Refer a Businessh </NavLink>
        <NavLink activeClassName={styles.active} exact to='/nda'>NDAs </NavLink>
        <NavLink activeClassName={styles.active} exact to='/messages'>Messages </NavLink>
      </div>

      <div>
        <Route path='/' exact component={Settings}/>
        <Route path='/business' component={ReferBusiness}/>
        <Route path='/nda' component={Ndas}/>
        <Route path='/messages' component={Messages}/>
      </div>
    </div>
  );
}
