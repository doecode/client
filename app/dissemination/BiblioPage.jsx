import React from 'react';
import ReactDOM from 'react-dom';
import {doAjax, appendQueryString, getQueryParam} from '../utils/utils';
import DevAndContribLinks from './DevAndContribLinks';
import Metadata from '../stores/Metadata';

const metadata = new Metadata();

export default class BiblioPage extends React.Component {
    constructor(props) {
        super(props);
        this.parseReceiveResponse = this.parseReceiveResponse.bind(this);
        this.parseErrorResponse = this.parseErrorResponse.bind(this);
        this.generateContent = this.generateContent.bind(this);
        this.state = {data : undefined}

      }



    componentDidMount() {
             const codeID = getQueryParam("code_id");
             console.log(codeID);
  console.log(codeID);
             if (codeID) {
            	 console.log("Calling");
       //          this.setState({"loading" : true, "loadingMessage" : "Loading"});
             	doAjax('GET', "api/metadata/" + codeID, this.parseReceiveResponse, undefined, this.parseErrorResponse);
             } else {
            	 console.log("This page is invalid...");
             }

         }


         parseReceiveResponse(data) {

           console.log(data);
             //metadata.deserializeData(data.metadata);
         	//console.log(JSON.stringify(metadata.getData()));
            this.setState({"data" : data.metadata});
             //this.setState({"loading" : false, "loadingMessage" : ""});
         }

         parseErrorResponse() {
        	 console.log("Error?");
           //this.setState({"loading" : false, "loadingMessage" : ""});
         }

         generateContent(obj) {

           let textContent = null;
           const header = obj.header
           if (header === "Developers/Contributors") {
            let devs = metadata.getValue("developers");
            let contributors = metadata.getValue("contributors");
            let names = []
            for (var i = 0; i < devs.length; i++)
                  names.push(devs[i].last_name + ", " + devs[i].first_name);
            for (var i = 0; i < contributors.length; i++)
                names.push(contributors[i].last_name + ", " + contributors[i].first_name);

            textContent = <span> <DevAndContribLinks devsAndContributors={names}/></span>;
          } else if (header === "Licenses") {
            const licenses = metadata.getValue("licenses");
            textContent = <span>{licenses.join("; ")}</span>;
          } else if (header.indexOf("Organizations") > -1) {
            const items = metadata.getValue(obj.field);
            let names = [];
            for (var i = 0; i < items.length; i++)
                names.push(items[i].organization_name);
            textContent =<span> {names.join("; ")} </span>;
          } else if (header === "Release Date") {
            console.log(metadata.getValue("release_date"));
            textContent =<span> {metadata.getValue("release_date")._i} </span>;
          } else {
             textContent = <span>{metadata.getValue(obj.field)}</span>;
           }

           return (
             <dl key={header} className="row">
               <dt className="col-sm-3 text-right">
                 {header}:
               </dt>
               <dd className="col-sm-9">
                 {textContent}

               </dd>

             </dl>);

         }

      render() {

        console.log("rendering");
        metadata.deserializeData(this.state.data);
        const fields = [{header : "Developers/Contributors", field : "N/A"},
        {header : "Release Date", field : "N/A"},
        {header : "Licenses", field : "N/A"},
        {header : "Code ID", field : "code_id"},
        {header : "DOI", field : "doi"},
        {header : "Site Accession Number", field : "site_accession_number"},
        {header : "Research Organizations", field : "research_organizations"},
        {header : "Contributing Organizations", field : "contributing_organizations"},
        {header : "Sponsoring Organizations", field : "sponsoring_organizations"},
        {header : "Country of Origin", field : "country_of_origin"},
        {header : "Other Special Requirements", field : "other_special_requirements"},
        {header : "Keywords", field : "keywords"}
        ];

        const fieldsContent = fields.map(this.generateContent);

        let descriptionContent = null;
        const description = metadata.getValue("description");

        if (description) {
        	descriptionContent =
        		<div className="col-sm-12 biblio-description">
        		{description}
        		</div>;
        }


        const titleContent = <div className="col-sm-12">

          <h2>
          {metadata.getValue("software_title")}
          </h2>
        </div>;

        return(

          <div className="container-fluid">
            {titleContent}
          	{descriptionContent}
          	<div className="col-sm-12 citation-details-div">
          		{fieldsContent}
            </div>
          </div>
        )

      }

    }
