<p>
  This application is designed to be an optional frontend or "client" for the Department of Energy "DOE CODE" software record search and submission API. DOE sites wishing to submit data to the DOE CODE API without using the client can find documentation and information at the following link: https://www.osti.gov/doecodeapi/services/docs.
  </p>

<strong>Features</strong><br/>
This client application contains the following features/interactions with the DOE CODE API:
- Searching through the DOE CODE library of records submitted to the API
- Bibliographic Data for individual records
- Submission of Scientific Software to the API (Logged in Only)

<strong>Technologies Used</strong><br/>
This version of the client application uses the following major technologies (Not all are listed here)
- Java (version 8)
- Javascript
- jQuery (version 3.x)
- jKnack Handlebars
- mobx
- Jackson
- chosen.js
- bootstrap
- fontawesome 5
- maven

<strong>Deployment</strong><br/>
The client application has been configured to run with Apache Tomcat 8.5 (or Tomcat 8). Dependencies and building are done with the pom.xml.
Properties for your maven profiles can be put either directly into the pom.xml, or in the settings.xml in your .m2 directory. Further description on the structure of the profiles, and the way that the DOE CODE Client is built can be found in the pom.xml. 
<br/>
Example of command needed to build the application: mvn clean tomcat7:redeploy -Denvironment=development -Pdev

<strong>Properties</strong><br/>
DOE CODE now uses the properties-maven-plugin to load values from a specified properties file while building. With it, you can specify the location of a properties file, and the plugin turns the properties from that file into maven variables.

<strong>Web Pages</strong><br/>
DOE CODE uses jKnack handlebars for web page rendering. (Note, this version of handlebars is rendered on the backend, and fed out via servlet, as opposed to the javascript version). 
Data for each page is inserted via jackson JSON Objects (ObjectNode and ArrayNode). 

<strong>JS Files</strong><br/>
All javascript is located in javascript files (no in-line/in-page code). In order to determine what javascript to execute on a given page, each page with relevant javascript is 
given a hidden input element with an id unique to that page. Then, in the relevant js file, a series of if/else statements are listed with document.getElementById(''), which will
only return true in the event that specific element is found. Most of the code in each section in the javascript is just designed to bind events to various elements.  
For the sake of loading a page faster, and to keep from loading irrelevant libraries, an extra section was added into the footer template that iterates through a list of strings 
that are the paths to js files you want to make page-specific. For example, on the search results page, the footer will write in a path to the dissemination.js file - but it won't 
try to load that file on the user admin page, since it would not be relevant to that page.
