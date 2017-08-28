import React from 'react';

export default class SearchRowDescription extends React.Component{
    constructor(props){
        super(props);
        this.state={
            is_open:false
        }
        this.toggleOpenState = this.toggleOpenState.bind(this);

        const description = this.props.text;
        const descriptionWords = description.split(" ");
        this.needsToggle = descriptionWords.length>100;

        if(this.needsToggle){
            this.descriptionPt1=descriptionWords.slice(0,100).join(' ');
            this.descriptionPt2=descriptionWords.slice(100,descriptionWords.length).join(' ');
        }else{
            this.descriptionPt1=description;
        }
    }

    toggleOpenState(){
        this.setState(
            {'is_open' : !this.state.is_open}
        );
    }

    render(){
    return(
        <div className='search-result-description'>
            <span>
                {this.descriptionPt1}
            </span>
            <span>
                {this.needsToggle &&
                <span>
                    &nbsp;
                    {!this.state.is_open ? (
                    <a className='clickable' onClick={this.toggleOpenState}>More&gt;&gt;</a>
                    ):(
                    <span>
                        <span>
                            {this.descriptionPt2}
                        </span>
                        <span>
                            <a className='clickable' onClick={this.toggleOpenState}>&lt;&lt;Less</a>
                        </span>
                    </span>
                    )}
                </span>
                }
            </span>
        </div>);
    }
}
