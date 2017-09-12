import React from 'react';

export default class ImageLink extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div>
        <a target={this.props.linkTarget} href={this.props.linkURL}>
          <img alt='img' id={this.props.imgID} className='repository-services-img-link' src={this.props.imageURL} width={this.props.width} height={this.props.height}/>
        </a>
      </div>
    );
  }
}
