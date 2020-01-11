import React, { Component, Fragment } from 'react';
import { Container, Dropdown } from 'react-bootstrap';
import { ReactComponent as SearchIcon } from '../../assets/img/search-icon.svg';

const prices = [500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 5000, 6000, 7000, 8000, 9000, 10000];

class Homepage extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      cuisineType: 'Cuisine Type',
      minprice: '',
      maxprice: '',
      selectedInput: 'minprice',
      priceRangeInfo: 'Franchise Fee',
    };
    this.minpriceRef = React.createRef();
    this.maxpriceRef = React.createRef();
    this.priceRangeRef = React.createRef();
  }

  handleChangeCuisineType = (eventKey, event) => {
    event.preventDefault();
    const cuisineType = eventKey.split(/\/(.+)/)[1];
    this.setState({ cuisineType });
  };

  handleInputFocus = (event) => {
    console.log(event.target.name);
    this.setState({ selectedInput: event.target.name });
  };

  handleChangePriceLimit = (event) => {
    const { selectedInput } = this.state;
    let text;
    if (event.type === 'click') {
      text = event.target.innerHTML;
    } else {
      text = event.target.value;
    }
    let value = '';
    if (text.includes('S$')) value = parseInt(text.split(' ')[1]);
    else if (!text.includes('No ')) value = parseInt(text);
    this.setState({
      [selectedInput]: value,
    });
    if (event.type === 'click') {
      if (selectedInput === 'minprice') {
        this.maxpriceRef.current.focus();
      }
      setTimeout(() => {
        const { minprice, maxprice } = this.state;
        if (minprice && maxprice) {
          this.priceRangeRef.current.click();
        }
      }, 10);
    }
  };

  renderPriceList = () => {
    const { selectedInput, minprice, maxprice } = this.state;
    if (selectedInput === 'maxprice') {
      const list = [];
      list.push(<li key="no-max" onClick={this.handleChangePriceLimit}>No Max</li>);
      list.push(<hr key="max-hr"/>);
      for (const price of prices) {
        if (minprice && price < minprice) {
          list.push(
            <li key={price} className="disabled" onClick={this.handleChangePriceLimit}>
              S$ {price}
            </li>
          );
        } else
          list.push(
            <li key={price} onClick={this.handleChangePriceLimit}>
              S$ {price}
            </li>
          );
      }
      return <ul className="maxprice-list">{list}</ul>;
    } else {
      const list = [];
      list.push(<li key="no-min" onClick={this.handleChangePriceLimit}>No Min</li>);
      list.push(<hr key="min-hr" />);
      for (const price of prices) {
        if (maxprice && price > maxprice)
          list.push(
            <li key={price} className="disabled" onClick={this.handleChangePriceLimit}>
              S$ {price}
            </li>
          );
        else
          list.push(
            <li key={price} onClick={this.handleChangePriceLimit}>
              S$ {price}
            </li>
          );
      }
      return <ul className="minprice-list">{list}</ul>;
    }
  };

  render() {
    const { cuisineType, minprice, maxprice } = this.state;
    let priceRangeInfo;
    if (!minprice && !maxprice) {
      priceRangeInfo = 'Franchise Fee';
    }
    else if (minprice && maxprice) {
      priceRangeInfo = `S$ ${minprice} - ${maxprice}`;
    } else if (!minprice) {
      priceRangeInfo = `Max S$ ${maxprice}`;
    } else if (!maxprice) {
      priceRangeInfo = `Min S$ ${minprice}`;
    }
    
    return (
      <Fragment>
        <div className="background">
          <Container>
            <img className="food1" src={require('../../assets/img/food1.png')} alt="food png" />
            <img className="food2" src={require('../../assets/img/food2.png')} alt="food png" />
            <img className="food3" src={require('../../assets/img/food3.png')} alt="food png" />
            <img className="food4" src={require('../../assets/img/food4.png')} alt="food png" />
            <img className="food5" src={require('../../assets/img/food5.png')} alt="food png" />
            <img className="food6" src={require('../../assets/img/food6.png')} alt="food png" />
            <img className="food7" src={require('../../assets/img/food7.png')} alt="food png" />
            <img className="food8" src={require('../../assets/img/food8.png')} alt="food png" />
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
          <div className="search-box">
            <span className="search-franchise">
              <SearchIcon />
              <input placeholder="Search for a franchise" />
            </span>
            <Dropdown onSelect={this.handleChangeCuisineType}>
              <Dropdown.Toggle>{cuisineType}</Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="#/Singaporean">Singaporean</Dropdown.Item>
                <Dropdown.Item href="#/Chinese">Chinese</Dropdown.Item>
                <Dropdown.Item href="#/Japanese">Japanese</Dropdown.Item>
                <Dropdown.Item href="#/Halal/Vegan">Halal/Vegan</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown className="select-price-range" onSelect={this.handleChangeCuisineType}>
              <Dropdown.Toggle ref={this.priceRangeRef} >
                {priceRangeInfo}
              </Dropdown.Toggle>

              <Dropdown.Menu 
                className="dropdown-input-range"
              >
                <div className="input-range">
                  <input
                    ref={this.minpriceRef}
                    type="text"
                    name="minprice"
                    placeholder="Min"
                    value={minprice}
                    onFocus={this.handleInputFocus}
                    onChange={this.handleChangePriceLimit}
                  />
                  <span>-</span>
                  <input
                    ref={this.maxpriceRef}
                    type="text"
                    name="maxprice"
                    placeholder="Max"
                    value={maxprice}
                    onFocus={this.handleInputFocus}
                    onChange={this.handleChangePriceLimit}
                  />
                </div>
                {this.renderPriceList()}
              </Dropdown.Menu>
            </Dropdown>
            <div className="btn-search-franchise">
              <button className="btn-main">Search</button>
            </div>
          </div>
        </Container>
      </Fragment>
    );
  }
}

export default Homepage;
