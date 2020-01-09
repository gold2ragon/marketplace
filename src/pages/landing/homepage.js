import React, { Component, Fragment } from 'react';
import { Container, Dropdown, Button, ButtonGroup } from 'react-bootstrap';
import { ReactComponent as SearchIcon } from '../../assets/img/search-icon.svg';

const options = [
  { value: 'Singaporean', label: 'Singaporean' },
  { value: 'Chinese', label: 'Chinese' },
  { value: 'Japanese', label: 'Japanese' },
  { value: 'Halal/Vegan', label: 'Halal/Vegan' }
]

class Homepage extends Component {

  state = {
    cuisineType: 'Cuisine Type',
  }
  
  handleChangeCuisineType = (eventKey, event) => {
    event.preventDefault();
    const cuisineType = eventKey.split(/\/(.+)/)[1];
    this.setState({ cuisineType });
  }

  render() {
    const { cuisineType } = this.state;
    return (
      <Fragment>
        <div className="background">
          <Container>
            <img className="food1" src={require('../../assets/img/food1.png')} />
            <img className="food2" src={require('../../assets/img/food2.png')} />
            <img className="food3" src={require('../../assets/img/food3.png')} />
            <img className="food4" src={require('../../assets/img/food4.png')} />
            <img className="food5" src={require('../../assets/img/food5.png')} />
            <img className="food6" src={require('../../assets/img/food6.png')} />
            <img className="food7" src={require('../../assets/img/food7.png')} />
            <img className="food8" src={require('../../assets/img/food8.png')} />
          </Container>
        </div>
        <div className="thefinestfoodsfra">
          <span className="span1">The finest </span>
          <span className="span2">foods franchise </span>
          <span className="span3">
            is <br /> ready to work with you
          </span>
        </div>
        <Container>
          <div className="group4">
            <span className="search-franchise">
              <SearchIcon />
              <input placeholder="Search for a franchise"/>
            </span>
            <Dropdown onSelect={this.handleChangeCuisineType}>
              <Dropdown.Toggle>
                {cuisineType}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="#/Singaporean">Singaporean</Dropdown.Item>
                <Dropdown.Item href="#/Chinese">Chinese</Dropdown.Item>
                <Dropdown.Item href="#/Japanese">Japanese</Dropdown.Item>
                <Dropdown.Item href="#/Halal/Vegan">Halal/Vegan</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            
            <Dropdown onSelect={this.handleChangeCuisineType}>
              <Dropdown.Toggle>
                {cuisineType}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="#/Singaporean">Singaporean</Dropdown.Item>
                <Dropdown.Item href="#/Chinese">Chinese</Dropdown.Item>
                <Dropdown.Item href="#/Japanese">Japanese</Dropdown.Item>
                <Dropdown.Item href="#/Halal/Vegan">Halal/Vegan</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Container>
      </Fragment>
    );
  }
}

export default Homepage;
