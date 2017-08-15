import React from 'react';
import ReactDOM from 'react-dom';
import {doAjax, appendQueryString, getQueryParam} from '../utils/utils';
import DevAndContribLinks from './DevAndContribLinks';
import Metadata from '../stores/Metadata';
import BreadcrumbTrail from '../fragments/BreadcrumbTrail';
import BiblioSidebar from './BiblioSidebar';

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
             	doAjax('GET', "/doecode/api/metadata/" + codeID, this.parseReceiveResponse, undefined, this.parseErrorResponse);
             } else {
            	 console.log("This page is invalid...");
             }

         }


         parseReceiveResponse(data) {
            this.setState({"data" : data.metadata});
         }

         parseErrorResponse() {
        	 console.log("Error?");
           //this.setState({"loading" : false, "loadingMessage" : ""});
         }

         generateContent(obj) {

           let textContent = null;
           let show_val = true;
           const header = obj.header;
           
           if (header === "Developers/Contributors") {
            let devs = metadata.getValue("developers");
            let contributors = metadata.getValue("contributors");
            let names = []
            for (var i = 0; i < devs.length; i++)
                  names.push(devs[i].last_name + ", " + devs[i].first_name);
            for (var i = 0; i < contributors.length; i++)
                names.push(contributors[i].last_name + ", " + contributors[i].first_name);

            textContent = <span> <DevAndContribLinks devsAndContributors={names}/></span>;
            show_val = names.length>0;
            
          } else if (header === "Licenses") {
            const licenses = metadata.getValue("licenses");
            textContent = <span>{licenses.join("; ")}</span>;
            
          } else if (header.indexOf("Organizations") > -1) {
            const items = metadata.getValue(obj.field);
            let names = [];
            for (var i = 0; i < items.length; i++)
                names.push(items[i].organization_name);
            textContent =<span> {names.join("; ")} </span>;
            show_val = names.length > 0;
            
          } else if (header === "Release Date") {
            console.log(metadata.getValue("release_date"));
            textContent =<span> {metadata.getValue("release_date")._i} </span>;
            show_val = metadata.getValue("release_date") != '';
            
          } else {
             textContent = <span>{metadata.getValue(obj.field)}</span>;
             show_val = metadata.getValue(obj.field);
           }

           if(show_val){
           return (
           <div className='biblio-row'>
               <dl key={header} className="row">
                   <dt className="col-md-3 col-xs-12 biblio-page-header">
                       {header}:
                   </dt>
                   <dd className="col-md-9 col-xs-12">
                       {textContent}

                   </dd>
               </dl>
           </div>
           );
}else{
    return(null
    );
}
         }

      render() {

        
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
        		<div className="col-xs-12 biblio-description">
        		{description}
        		</div>;
        }
   const breadcrumbList = [
    {key:'brdcrmb1',
    value: <span><a href='/doecode'>DOE CODE </a> / </span>},
    {key:'brdcrmb2',
    value:<span><a href='/doecode/results'>Search Results</a> / </span>},
    {key:'brdcrmb3',
    value: <span>{metadata.getValue("software_title")}</span>
     }
   ];
   
        return(
        <div className="row not-so-wide-row">
            <div className="col-xs-12">
                {/*Breadcrumb trail*/}
                <div className="row">
                    <div className='col-xs-12'>
                        <BreadcrumbTrail list={breadcrumbList}/>
                    </div>
                </div>
                {/*Title*/}
                <div className="row">
                    <div className="col-xs-12 center-text biblio-title-container">
                        <div className="biblio-title">
                            {metadata.getValue("software_title")}
                        </div>
                        <br/>
                    </div>
                </div>
                {/*Description and other Data*/}
                <div className="row">
                    <div className="col-md-10 col-xs-12">
                        <div className="row">
                            {descriptionContent}
                        </div>
                        <div className="row">
                            <div className="citation-details-div col-xs-12">
                                {fieldsContent}
                            </div>
                        </div>
                    </div>
                    {/*Sidebar on the right*/}
                    <BiblioSidebar sidebarClass=' col-md-2 col-xs-12'/>
                </div>
            </div>
        </div>
        )

      }

    }