import React from 'react';
import DOECodeWizard from './DOECodeWizard';

export default class ApprovalForm extends React.Component {

	constructor(props) {
		    super(props);
		  }

	  render() {
		    return (
          <div>
          <DOECodeWizard page="approve"/>
        </div>
		      );
		  }
}
