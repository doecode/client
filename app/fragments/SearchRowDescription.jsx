import React from 'react';

export default class SearchRowDescription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      is_open: false
    }
    this.toggleOpenState = this.toggleOpenState.bind(this);
  }

  toggleOpenState() {
    this.setState({
      'is_open': !this.state.is_open
    });
  }

  render() {
    var description = this.props.text;
    var descriptionWords = description.split(" ");
    this.needsToggle = descriptionWords.length > this.props.moreLess;

    if (this.needsToggle) {
      this.descriptionPt1 = descriptionWords.slice(0, this.props.moreLess).join(' ');
      this.descriptionPt2 = descriptionWords.slice(this.props.moreLess, descriptionWords.length).join(' ');
    } else {
      this.descriptionPt1 = description;
    }
    return (
      <div className='search-result-description'>
        <span>
          {this.descriptionPt1}
        </span>
        <span>
          {this.needsToggle && <span>
            &nbsp; {!this.state.is_open
              ? (
                <a className='clickable' onClick={this.toggleOpenState}>More&gt;&gt;</a>
              )
              : (
                <span>
                  <span>
                    {this.descriptionPt2}
                  </span>
                  <span>
                    <a className='clickable' onClick={this.toggleOpenState}>&lt;&lt;Less</a>
                  </span>
                </span>
              )}
          </span>}
        </span>
      </div>
    );
  }
}
