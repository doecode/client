import React from 'react';
import Griddle from 'griddle-react';
import {observer} from 'mobx-react';

@observer
export default class AgentsTable extends React.Component {
  constructor(props) {
    super(props);
    this.rowClick = this.rowClick.bind(this);
  }


  rowClick(gridRow, event) {
    if (!this.props.finished) {
	  var data = Object.assign({},gridRow.props.data);
	  this.props.tableStore.copyIntoCurrent(data);
	  this.props.tableStore.previousPlace = data.place;
	  this.props.tableStore.showModal = true;
	  this.props.tableStore.isEdit = true;
  }

  }

  render() {
    const configureMetadata = [{
    	    "columnName": "place",
    	    "order": 1,
    	    "locked": false,
    	    "visible": true,
    	    "displayName": "#"

    	  },
    	  {
    	    "columnName": "first_name",
    	    "order": 2,
    	    "locked": false,
    	    "visible": true,
    	    "displayName": "First Name"
    	  },
    	  {
    	    "columnName": "middle_name",
    	    "order": 3,
    	    "locked": false,
    	    "visible": true,
    	    "displayName": "Middle Name"

    	  },
    	  {
    	    "columnName": "last_name",
    	    "order": 4,
    	    "locked": false,
    	    "visible": true,
    	    "displayName": "Last Name"
    	  },
    	  {
    	    "columnName": "email",
    	    "order": 5,
    	    "locked": false,
    	    "visible": true,
    	    "displayName": "Email"
    	  },
    	  {
      	    "columnName": "affiliations",
      	    "order": 6,
      	    "locked": false,
      	    "visible": true,
      	    "displayName": "Affiliations"
      	  }, 
      	  {
        	    "columnName": "contributor_type",
          	    "order": 7,
          	    "locked": false,
          	    "visible": true,
          	    "displayName": "Contributor Type"
          }
      	  ]

	return(

<div className="form-group form-group-sm col-sm-12">
        <Griddle results = {this.props.arr} columnMetadata={configureMetadata} showSettings={true} showFilter={true} onRowClick={this.rowClick} />
</div>
);
  }

}
