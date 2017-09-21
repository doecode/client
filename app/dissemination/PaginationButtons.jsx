import React from 'react';
import SimpleDropdown from '../fragments/SimpleDropdown';

export default class PaginationButtons extends React.Component {
  constructor(props) {
    super(props);
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.showCurrentSliderPage = this.showCurrentSliderPage.bind(this);
    this.retriggerSearch = this.retriggerSearch.bind(this);

    this.state = {
      showDropdown: false,
      currentVal: this.props.currentVal,
      currentPropsVal: this.props.currentVal
    };
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      console.log("Clicked outside");
    }
  }

  toggleDropdown() {
    this.setState({
      showDropdown: !this.state.showDropdown
    });
  }

  showCurrentSliderPage(event) {
    this.setState({currentVal: event.target.value});
  }

  retriggerSearch() {
    console.log("retriggering")
  }

  componentWillReceiveProps(newProps) {
    if (newProps.currentVal != this.state.currentPropsVal) {
      this.setState({currentPropsVal: newProps.currentVal, currentVal: newProps.currentVal});
    }
  }

  render() {
    return (
      <div className='custom-paginate-container'>
        <button type='button' className='pure-button'>Prev</button>
        <button type='button' className='pure-button paginate-slider-arrow' onClick={this.toggleDropdown}>
          <span className='fa fa-caret-down'></span>
        </button>
        <button type='button' className='pure-button'>Next</button>
        {this.state.showDropdown && <div className='pagination-dropdown'>
          <div className='row'>
            <div className='col-xs-12 right-text text-muted'>
              Go to page:&nbsp;{this.state.currentVal}&nbsp;of&nbsp;{this.props.max}
            </div>
          </div>
          <div className='row'>
            <div className='col-xs-8 no-col-padding-right'><input onChange={this.showCurrentSliderPage} type="range" min="1" max={this.props.max} defaultValue={this.state.currentVal} step="1"/></div>
            <div className='col-xs-4 no-col-padding-left'>
              <button type='button' className='pure-button' onClick={this.retriggerSearch}>&gt;&gt;</button>
            </div>
          </div>
        </div>}
      </div>
    );
  }
}
