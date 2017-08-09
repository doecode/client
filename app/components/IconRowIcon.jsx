import React from 'react';


export default class IconRowIcon extends React.Component{
    constructor(props){
        super(props);
    }
    
    render(){
    return(
    <div className={this.props.container_classes}>
        {this.props.textOnClick!==undefined &&
        <a onClick={this.props.textOnClick} className="icon-row-icon"><span className={this.props.icon_classes}></span></a>
        }
        {this.props.textOnClick===undefined &&
        <a href={this.props.destination} className="icon-row-icon"><span className={this.props.icon_classes}></span></a>
        }
        <br/>
        <small>
            {this.props.textOnClick!==undefined &&
            <a onClick={this.props.textOnClick} className='clickable'>{this.props.text}</a>
            }
            {this.props.textOnClick===undefined &&
            <a href={this.props.destination}>{this.props.text}</a>
            }
        </small>
    </div>
    );
    }
}