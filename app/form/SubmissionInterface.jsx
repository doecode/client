import React from 'react';
import DOECodeSubmissionInterface from './DOECodeSubmissionInterface';

export default class SubmissionInterface extends React.Component {

	constructor(props) {
		    super(props);
		  }

	  render() {
		    return (
          <div>
          <DOECodeSubmissionInterface page="submit"/>
        </div>
		      );
		  }
}
