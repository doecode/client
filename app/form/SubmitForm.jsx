import React from 'react';
import DOECodeWizard from './DOECodeWizard';

export default class SubmitForm extends React.Component {

	constructor(props) {
		    super(props);
		  }

	  render() {
		    return (
          <div>
          <DOECodeWizard page="publish"/>
        </div>
		      );
		  }
}
