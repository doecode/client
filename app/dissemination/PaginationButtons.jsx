import React from 'react';
import SimpleDropdown from '../fragments/SimpleDropdown';

export default class PaginationButtons extends React.Component {
  constructor(props) {
    super(props);
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.showCurrentSliderPage = this.showCurrentSliderPage.bind(this);
    this.goToPage = this.goToPage.bind(this);
    this.goBackAPage = this.goBackAPage.bind(this);
    this.goForwardAPage = this.goForwardAPage.bind(this);
    this.refreshSearch = this.refreshSearch.bind(this);

    this.state = {
      showDropdown: false,
      currentVal: this.props.currentVal,
      currentPropsVal: this.props.currentVal
    };
  }

  toggleDropdown() {
    this.setState({
      showDropdown: !this.state.showDropdown
    });
  }

  showCurrentSliderPage(event) {
    this.setState({currentVal: event.target.value});
  }

  goToPage() {
    this.refreshSearch(this.state.currentVal);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.currentVal != this.state.currentPropsVal) {
      this.setState({currentPropsVal: newProps.currentVal, currentVal: newProps.currentVal});
    }
  }

  goBackAPage() {
    this.refreshSearch(this.state.currentVal - 1);
  }

  goForwardAPage() {
    this.refreshSearch(this.state.currentVal + 1);
  }

  refreshSearch(newPageNum) {
    this.setState({showDropdown: false});
    this.props.refreshSearchCallback({
      selected: (newPageNum - 1)
    });
  }

  render() {
    var isPrevDisabled = (this.state.currentPropsVal == 1)
      ? 'disabled'
      : '';

    var isNextDisabled = (this.state.currentPropsVal == this.props.max)
      ? 'disabled'
      : '';
    return (
      <div className='custom-paginate-container'>
        <button type='button' className='pure-button' title='Previous Page' disabled={isPrevDisabled} onClick={this.goBackAPage}>Prev</button>&nbsp;&nbsp;
        <button type='button' className='pure-button paginate-slider-arrow' title='Choose a Page' onClick={this.toggleDropdown}>
          &hellip;
        </button>&nbsp;&nbsp;
        <button type='button' className='pure-button' disabled={isNextDisabled} title='Next Page' onClick={this.goForwardAPage}>Next</button>
        {this.state.showDropdown && <div className='pagination-dropdown'>
          <div className='row'>
            <div className='col-xs-12 right-text text-muted'>
              Go to page:&nbsp;{this.state.currentVal}&nbsp;of&nbsp;{this.props.max}
            </div>
          </div>
          <div className="flex-container">
            <div className='row pagination-row'>
              <div className='col-xs-9 no-col-padding-right'><input className='pagination-input' onChange={this.showCurrentSliderPage} title={"Page " + this.state.currentVal} type="range" min="1" max={this.props.max} defaultValue={this.state.currentVal} step="1"/></div>
              <div className='col-xs-3 minimal-col-padding-left left-text'>
                <button type='button' title={"Go"} className='pure-button pagination-button' onClick={this.goToPage}>»</button>
              </div>
            </div>
          </div>
        </div>}
      </div>
    );
  }
}
