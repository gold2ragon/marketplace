import React, { Component, Fragment } from 'react';
import { Dropdown } from 'react-bootstrap';
import { connect } from 'react-redux';
import { getSearchResults } from '../../redux/actions/listing';
import { ReactComponent as SearchIcon } from '../../assets/img/search-icon.svg';
import numeral from 'numeral';
import queryString from 'query-string';
import { history } from '../../App';

const prices = [5000, 10000, 15000, 20000, 25000, 30000];
const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop - 20);

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
      isMobile: false,
      isSearch: false, // Check if search url
    };
    this.minpriceRef = React.createRef();
    this.maxpriceRef = React.createRef();
    this.priceRangeRef = React.createRef();
    this.myRef = React.createRef();

    //Here ya go
    history.listen((location, action) => {
      if (location.pathname === '/search') {
        const values = queryString.parse(location.search);
        this.setState({ isSearch: true, ...values });
        const { keyword, cuisineType, minprice, maxprice } = values;
        this.props.getSearchResults(keyword, cuisineType, minprice, maxprice);
      }
    });
  }

  componentDidMount() {
    const { location } = history;
    if (location.pathname === '/search') {
      const values = queryString.parse(location.search);
      this.setState({
        isSearch: true,
        ...values,
      });
      const { keyword, cuisineType, minprice, maxprice } = values;
      this.props.getSearchResults(keyword, cuisineType, minprice, maxprice);
    }
    const windowWidth = window.innerWidth;
    this.setState({ isMobile: windowWidth < 992 });
  }

  renderPriceList = () => {
    const { selectedInput, minprice, maxprice } = this.state;
    if (selectedInput === 'maxprice') {
      const list = [];
      list.push(
        <li key="no-max" onClick={this.handleChangePriceLimit}>
          No Max
        </li>,
      );
      list.push(<hr key="max-hr" />);
      for (const price of prices) {
        if (minprice && price < minprice) {
          list.push(
            <li key={price} className="disabled" onClick={this.handleChangePriceLimit}>
              S${numeral(price).format('0,0')}
            </li>,
          );
        } else
          list.push(
            <li key={price} onClick={this.handleChangePriceLimit}>
              S${numeral(price).format('0,0')}
            </li>,
          );
      }
      return <ul className="maxprice-list">{list}</ul>;
    } else {
      const list = [];
      list.push(
        <li key="no-min" onClick={this.handleChangePriceLimit}>
          No Min
        </li>,
      );
      list.push(<hr key="min-hr" />);
      for (const price of prices) {
        if (maxprice && price > maxprice)
          list.push(
            <li key={price} className="disabled" onClick={this.handleChangePriceLimit}>
              S${numeral(price).format('0,0')}
            </li>,
          );
        else
          list.push(
            <li key={price} onClick={this.handleChangePriceLimit}>
              S${numeral(price).format('0,0')}
            </li>,
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
    if (text.includes('S$')) value = text.replace('S$', '');
    else if (!text.includes('No ')) value = parseInt(text);
    value = numeral(value).value();
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

  renderPriceRangeInput = () => {
    const { minprice, maxprice } = this.state;
    return (
      <Fragment>
        <div className="input-range">
          <input
            ref={this.minpriceRef}
            type="text"
            name="minprice"
            placeholder="Min"
            value={numeral(minprice).format('0,0')}
            onFocus={this.handleInputFocus}
            onChange={this.handleChangePriceLimit}
          />
          <span>-</span>
          <input
            ref={this.maxpriceRef}
            type="text"
            name="maxprice"
            placeholder="Max"
            value={numeral(maxprice).format('0,0')}
            onFocus={this.handleInputFocus}
            onChange={this.handleChangePriceLimit}
          />
        </div>
      </Fragment>
    );
  };

  handleSearchFranchise = () => {
    let { keyword, cuisineType, minprice, maxprice } = this.state;
    history.push(
      `/search?keyword=${keyword}&cuisineType=${cuisineType}&minprice=${minprice}&maxprice=${maxprice}`,
    );
  };

  handleScrollTop = (event) => {
    scrollToRef(this.myRef);
    this.priceRangeRef.current.click();
  };

  render() {
    const { isMobile } = this.state;
    const { keyword, cuisineType, minprice, maxprice } = this.state;

    let priceRangeInfo;
    if (!minprice && !maxprice) {
      priceRangeInfo = 'Franchise Fee';
    } else if (minprice && maxprice) {
      priceRangeInfo = `S$${numeral(minprice).format('0,0')} - ${numeral(maxprice).format('0,0')}`;
    } else if (!minprice) {
      priceRangeInfo = `Max S$${numeral(maxprice).format('0,0')}`;
    } else if (!maxprice) {
      priceRangeInfo = `Min S$${numeral(minprice).format('0,0')}`;
    }

    if (isMobile) {
      return (
        <div className="mobile">
          <div className="search-franchise">
            <SearchIcon />
            <input
              ref={this.myRef}
              className="text-search"
              placeholder="Search by franchise name"
              value={keyword}
              onChange={(event) => this.setState({ keyword: event.target.value })}
            />
          </div>
          <Dropdown className="search-franchise" onSelect={this.handleChangeCuisineType}>
            <Dropdown.Toggle>{cuisineType}</Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#/Cuisine Type">All Cuisine Types</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item href="#/Singaporean">Singaporean</Dropdown.Item>
              <Dropdown.Item href="#/Chinese">Chinese</Dropdown.Item>
              <Dropdown.Item href="#/Japanese">Japanese</Dropdown.Item>
              <Dropdown.Item href="#/Halal/Vegetarian">Halal/Vegetarian</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown
            className="search-franchise select-price-range"
            onSelect={this.handleChangeCuisineType}
          >
            <Dropdown.Toggle ref={this.priceRangeRef} onClickCapture={this.handleScrollTop}>
              {priceRangeInfo}
            </Dropdown.Toggle>

            <Dropdown.Menu className="dropdown-input-range">
              {this.renderPriceRangeInput()}
              {this.renderPriceList()}
            </Dropdown.Menu>
          </Dropdown>
          <div className="btn-search-franchise">
            <button className="btn-main" onClick={this.handleSearchFranchise}>
              Search
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="search-box">
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
            <Dropdown.Item href="#/Cuisine Type">All Cuisine Types</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item href="#/Singaporean">Singaporean</Dropdown.Item>
            <Dropdown.Item href="#/Chinese">Chinese</Dropdown.Item>
            <Dropdown.Item href="#/Japanese">Japanese</Dropdown.Item>
            <Dropdown.Item href="#/Halal/Vegetarian">Halal/Vegetarian</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <div className="vertical-bar"></div>
        <Dropdown className="select-price-range" onSelect={this.handleChangeCuisineType}>
          <Dropdown.Toggle ref={this.priceRangeRef}>{priceRangeInfo}</Dropdown.Toggle>

          <Dropdown.Menu className="dropdown-input-range">
            {this.renderPriceRangeInput()}
            {this.renderPriceList()}
          </Dropdown.Menu>
        </Dropdown>
        <div className="btn-search-franchise">
          <button className="btn-main" onClick={this.handleSearchFranchise}>
            Search
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  // searchResults: state.user.searchResults,
});

const mapDispatchToProps = (dispatch) => ({
  getSearchResults: (keyword, cuisineType, minprice, maxprice) =>
    dispatch(getSearchResults(keyword, cuisineType, minprice, maxprice)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchFranchise);
