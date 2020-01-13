import React, { Component } from 'react';
import { Dropdown } from 'react-bootstrap';
import { ReactComponent as SearchIcon } from '../../assets/img/search-icon.svg';
import queryString from 'query-string';
import { history } from '../../App';

const prices = [5000, 10000, 15000, 20000, 25000, 30000];

class SearchFranchise extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: '',
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

  componentDidMount() {
    const { location } = history;
    if (location.pathname === '/search') {
      const values = queryString.parse(location.search);
      this.setState({
        ...values,
      })
    }
  }

  renderPriceList = () => {
    const { selectedInput, minprice, maxprice } = this.state;
    if (selectedInput === 'maxprice') {
      const list = [];
      list.push(<li key="no-max" onClick={this.handleChangePriceLimit}>No Max</li>);
      list.push(<hr key="max-hr" />);
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

  handleSearchFranchise = () => {
    let { keyword, cuisineType, minprice, maxprice } = this.state;
    console.log(keyword, cuisineType, minprice, maxprice);
    history.push(`/search?keyword=${keyword}&cuisineType=${cuisineType}&minprice=${minprice}&maxprice=${maxprice}`);
  }

  render() {
    const { keyword, cuisineType, minprice, maxprice } = this.state;
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
      <div className={`search-box`}>
        <span className="search-franchise">
          <SearchIcon />
          <input
            placeholder="Search by franchise name"
            value={keyword}
            onChange={(event) => this.setState({ keyword: event.target.value })}
          />
        </span>
        <div className="vertical-bar"></div>
        <Dropdown id="search-cuisine-types" onSelect={this.handleChangeCuisineType}>
          <Dropdown.Toggle>{cuisineType}</Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href="#/Singaporean">Singaporean</Dropdown.Item>
            <Dropdown.Item href="#/Chinese">Chinese</Dropdown.Item>
            <Dropdown.Item href="#/Japanese">Japanese</Dropdown.Item>
            <Dropdown.Item href="#/Halal/Vegan">Halal/Vegan</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <div className="vertical-bar"></div>
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
          <button className="btn-main" onClick={this.handleSearchFranchise}>Search</button>
        </div>
      </div>
    );
  }
}

export default SearchFranchise;