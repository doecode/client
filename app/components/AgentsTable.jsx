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
	  //var data = Object.assign({},gridRow.props.data);
	  //this.props.tableStore.copyIntoCurrent(data);
	  //this.props.tableStore.previousPlace = data.place;
	  this.props.tableStore.currentId = gridRow.props.data.id;
	  this.props.tableStore.showModal = true;
	  this.props.tableStore.isEdit = true;
  

  }

  render() {

	  let columns = [];
	  if (this.props.columns)
		  columns = this.props.columns;
	  
	return(

<div className="form-group form-group-sm col-sm-12">
        <Griddle results = {this.props.arr} columnMetadata={this.props.config} columns={columns} showSettings={true} showFilter={true} onRowClick={this.rowClick} />
</div>
);
  }

}
