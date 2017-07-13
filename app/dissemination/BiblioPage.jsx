import React from 'react';
import ReactDOM from 'react-dom';
import {doAjax, appendQueryString, getQueryParam} from '../utils/utils';
import Metadata from '../stores/Metadata';

const metadata = new Metadata();

export default class BiblioPage extends React.Component {
    constructor(props) {
        super(props);
        this.parseReceiveResponse = this.parseReceiveResponse.bind(this);
        this.parseErrorResponse = this.parseErrorResponse.bind(this);
        this.generateContent = this.generateContent.bind(this);
      }



      componentDidMount() {
             const codeID = getQueryParam("code_id");
             if (codeID) {
       //          this.setState({"loading" : true, "loadingMessage" : "Loading"});
             	//doAjax('GET', "api/metadata/" + codeID, this.parseReceiveResponse, undefined, this.parseErrorResponse);
              console.log(codeID)
             }

         }


         parseReceiveResponse(data) {

             metadata.deserializeData(data.metadata);
             this.setState({"loading" : false, "loadingMessage" : ""});
         }

         parseErrorResponse() {
           this.setState({"loading" : false, "loadingMessage" : ""});
         }

         generateContent(header) {

           let textContent = null;

           if (header === "Developers/Contributors") {
            textContent = <span>Howdy</span>;
           } else {
             textContent = <span>Hello</span>;
           }

           return <div key={header}>
             <dl>
               <dt className="col-sm-3">
                 {header}:
               </dt>
               <dd className="col-sm-9">
                 {textContent}

               </dd>

             </dl>

           </div>;
         }

      render() {

        const fields = ["Developers/Contributors", "Release Date"];

        const fieldsContent = fields.map(this.generateContent);

        return(

          <div className="container-fluid">

            {fieldsContent}
          </div>
        )

      }

    }
