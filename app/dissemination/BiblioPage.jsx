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
        this.state = {testData : {"code_id":5297,"open_source":false,"repository_link":"www.github.com/doecode/doecode","landing_page":"","software_title":"Strain Control of Oxygen Vacancies in Epitaxial Strontium Cobalitite Films","acronym":"doecode","doi":"10.1072/asdf","doi_infix":"","doi_status":"","accessibility":"OS","description":"In this study, the ability to manipulate oxygen anion defects rather than metal cations in complex oxides can facilitate creating new functionalities critical for emerging energy and device technologies. However, the difficulty in activating oxygen at reduced temperatures hinders the deliberate control of important defects, oxygen vacancies. Here, strontium cobaltite (SrCoOx) is used to demonstrate that epitaxial strain is a powerful tool for manipulating the oxygen vacancy concentration even under highly oxidizing environments and at annealing temperatures as low as 300 °C. By applying a small biaxial tensile strain (2%), the oxygen activation energy barrier decreases by ˜30%, resulting in a tunable oxygen deficient steady-state under conditions that would normally fully oxidize unstrained cobaltite. These strain-induced changes in oxygen stoichiometry drive the cobaltite from a ferromagnetic metal towards an antiferromagnetic insulator. The ability to decouple the oxygen vacancy concentration from its typical dependence on the operational environment is useful for effectively designing oxides materials with a specific oxygen stoichiometry. ","country_of_origin":"United States","release_date":"","keywords":"Keywords","site_accession_number":"42342","other_special_requirements":"Special Other Requirements","licenses":["Apache License 2.0","MIT License"],"access_limitations":["UNL"],"developers":[{"email":"","affiliations":"IIa","orcid":"","first_name":"Shelby","last_name":"Stooksbury","middle_name":"","id":"j52vtolt"},{"email":"","affiliations":"Oak Ridge National Laboratory","orcid":"","first_name":"Jay Jay","last_name":"Billings","middle_name":"","id":"j52vtolu"},{"email":"knight.kathryn@gmail.com","affiliations":"Oak Ridge National Laboratory","orcid":"","first_name":"Katie","last_name":"Knight","middle_name":"","id":"j52vtolv"},{"email":"","affiliations":"","orcid":"","first_name":"awatsongroks","last_name":"(undefined)","middle_name":"","id":"j52vtolw"},{"email":"IanLee1521@gmail.com","affiliations":"Lawrence Livermore National Laboratory, @LLNL","orcid":"","first_name":"Ian","last_name":"Lee","middle_name":"","id":"j52vtolx"},{"email":"","affiliations":"IIA","orcid":"","first_name":"Andrew","last_name":"Smith","middle_name":"","id":"j52vtoly"},{"email":"","affiliations":"","orcid":"","first_name":"vowelllDOE","last_name":"(undefined)","middle_name":"","id":"j52vtolz"},{"email":"","affiliations":"","orcid":"","first_name":"Neal","last_name":"Ensor","middle_name":"","id":"j52vtom0"},{"email":"","affiliations":"","orcid":"","first_name":"nelsonjc-osti","last_name":"(undefined)","middle_name":"","id":"j52vtom1"},{"email":"sherlinec@osti.gov","affiliations":"https://www.osti.gov/","orcid":"","first_name":"Crystal","last_name":"Sherline","middle_name":"","id":"j52vtom2"},{"email":"","affiliations":"","orcid":"","first_name":"Darel","last_name":"Finkbeiner","middle_name":"","id":"j52vtom3"},{"email":"","affiliations":"U.S. Department of Energy Office of Scientific and Technical Information","orcid":"","first_name":"Lorrie Apple","last_name":"Johnson","middle_name":"","id":"j52vtom4"},{"email":"","affiliations":"","orcid":"","first_name":"Lynn","last_name":"Davis","middle_name":"","id":"j52vtom5"},{"email":"","affiliations":"","orcid":"","first_name":"Mike","last_name":"Hensley","middle_name":"","id":"j52vtom6"},{"email":"","affiliations":"Information International Associates (Contractor to DOE)","orcid":"","first_name":"Thomas","last_name":"Welsch","middle_name":"","id":"j52vtom7"}],"contributors":[{"email":"","affiliations":"","orcid":"","first_name":"Bruce","last_name":"Wayne","middle_name":"","contributor_type":"ContactPerson","id":"j52vtom8"}],"sponsoring_organizations":[{"organization_name":"USDOE","funding_identifiers":[],"primary_award":"36","DOE":true,"id":"j52vtom9","award_numbers":"12424,242424","br_codes":"12-abcdef,23-abcdef","fwp_numbers":"2412421,12423"}],"contributing_organizations":[{"organization_name":"awefe","contributor_type":"ContactPerson","DOE":true,"id":"j52vtoma"}],"research_organizations":[],"related_identifiers":[{"identifier_type":"DOI","identifier_value":"10.1145/2676723.2677322 ","relation_type":"Cites","id":"j52vtomb"},{"identifier_type":"URL","identifier_value":"https://fivethirtyeight.com/features/the-cubs-have-one-of-the-worst-championship-hangovers-ever/","relation_type":"IsCitedBy","id":"j52vtomc"}],"recipient_name":"","recipient_email":"","recipient_phone":"","recipient_org":"","files":[]}};

      }



    componentDidMount() {
             const codeID = getQueryParam("code_id");
          /*   console.log(codeID);
             if (codeID) {
            	 console.log("Calling");
       //          this.setState({"loading" : true, "loadingMessage" : "Loading"});
             	doAjax('GET', "api/metadata/" + codeID, this.parseReceiveResponse, undefined, this.parseErrorResponse);
             } else {
            	 console.log("This page is invalid...");
             }*/

         }


         parseReceiveResponse(data) {

             metadata.deserializeData(data.metadata);
         	console.log(JSON.stringify(metadata.getData()));
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
            textContent = <span>Howdy</span>;
          } else if (header === "Licenses") {
            const licenses = metadata.getValue("licenses");
            textContent = <span>{licenses.join("; ")}</span>;
          } else if (header.indexOf("Organizations") > -1) {
            textContent =<span> Hello </span>;
          } else if (header === "Release Date") {
            console.log(metadata.getValue("release_date"));
            textContent =<span> Hello </span>;
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

                     metadata.deserializeData(this.state.testData);
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

        return(

          <div className="container-fluid">
          	{descriptionContent}
          	<div className="col-sm-12 citation-details-div">
          		{fieldsContent}
            </div>
          </div>
        )

      }

    }
