import React from 'react';
import AgentsModal from './AgentsModal';
import TableStore from '../stores/TableStore';
import Developer from '../stores/Developer';
import Contributor from '../stores/Contributor';
import Metadata from '../stores/Metadata';
import {observer} from 'mobx-react';
import {getChildData} from '../utils/utils'


import Griddle from 'griddle-react';


const tableStore = new TableStore();
const metadata = new Metadata();

@observer
export default class EditableDataTable extends React.Component {

    constructor(props) {
      super(props);
      this.rowClick = this.rowClick.bind(this);
    }


    rowClick(gridRow, event) {

	  const parentName = this.props.parentName;
	  const currentArray = metadata.getValue(parentName);
	  const data = getChildData(parentName);
	  const index = currentArray.findIndex(item => item.id === gridRow.props.data.id);
	  data.loadValues(currentArray[index]);
  	  tableStore.showModal = this.props.parentName;
  	  tableStore.isEdit = true;
    }
    

	  render() {

      let columns = [];
  	  if (this.props.columns !== undefined)
  		  columns = this.props.columns;

			const parentName = this.props.parentName;
			const currentArray = metadata.getValue(parentName);
			const data = getChildData(parentName);

		    return (
          <div>
            <div className="form-group form-group-sm col-sm-12">
                    <Griddle results = {currentArray.slice()} columnMetadata={this.props.config} columns={columns} showSettings={true} showFilter={true} onRowClick={this.rowClick} />
            </div>
           <AgentsModal dataType={parentName} tableStore={tableStore} data={data} contentType={this.props.contentType}  />
         </div>
		      );
		  }
}
