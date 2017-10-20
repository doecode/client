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
      currentPageVal: this.props.currentVal
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
    if (newProps.currentVal != this.state.currentPageVal) {
      this.setState({currentPageVal: newProps.currentVal, currentVal: newProps.currentVal});
    }
  }

  goBackAPage() {
    this.refreshSearch(this.state.currentPageVal - 1);
  }

  goForwardAPage() {
    this.refreshSearch(this.state.currentPageVal + 1);
  }

  refreshSearch(newPageNum) {
    this.setState({showDropdown: false});
    this.props.refreshSearchCallback({
      selected: (newPageNum - 1)
    });
  }

  render() {
    var isPrevDisabled = (this.state.currentPageVal == 1)
      ? 'disabled'
      : '';

    var isNextDisabled = (this.state.currentPageVal == this.props.max)
      ? 'disabled'
      : '';

    var isChooseDisabled = (this.state.currentPageVal == 1 && this.state.currentPageVal == this.props.max)
      ? 'disabled'
      : '';

    return (
      <div className='custom-paginate-container'>
        <button type='button' className='pure-button' title='Previous Page' disabled={isPrevDisabled} onClick={this.goBackAPage}>
          <span className="fa fa-angle-left pagination-arrow"></span>
          Prev</button>&nbsp;&nbsp;
        <button type='button' className='pure-button paginate-slider-arrow' title='Choose a Page' disabled={isChooseDisabled} onClick={this.toggleDropdown}>
          &hellip;
        </button>&nbsp;&nbsp;
        <button type='button' className='pure-button' disabled={isNextDisabled} title='Next Page' onClick={this.goForwardAPage}>Next
          <span className="fa fa-angle-right pagination-arrow"></span>
        </button>
        {this.state.showDropdown && <div className='pagination-dropdown'>
          <div id="paging-1" className="pagination-dropdown pagination-dropdown-tip pagination-dropdown-relative pagination-dropdown-style">
            <div className="pagination-dropdown-panel">
              <div className="text-muted pagination-go">
                <label htmlFor="pagination-sel-1">Go to page:
                  <span className="paging-target">{this.state.currentVal}</span>
                  of
                  <span className="paging-max">{this.props.max}</span>
                </label>
              </div>
              <div>
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <input data-range="" onChange={this.showCurrentSliderPage} title={"Page " + this.state.currentVal} value={this.state.currentVal} min="1" max={this.props.max} name="pagination-sel" type="range" className="pagination-sel pagination-input" id="pagination-sel-1" step="1"/>
                      </td>
                      <td>
                        <button className="pure-button pagination-go-slider" title={"Go"} type="button" onClick={this.goToPage}>»</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>}
      </div>
    );
  }
}
