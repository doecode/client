# client
This application is designed to be an optional front end or "client" for the Department of Energy "DOE CODE" software record search and submission API. DOE sites wishing
to submit data to the DOE CODE API without using the client can find documentation and information at the following link: https://www.osti.gov/doecodeapi/services.

=====Features=====  
This client application contains the following features/interactions with the DOE CODE API:
- Searching through the DOE CODE library of records submitted to the API
- Bibliographic Data for individual records 
- Users
- Submission of Scientific Software to the API (Logged in Only)

=====Technologies=====  
This version of the client application uses the following major technologies (Not all are listed here)
- Java (version 8)
- Javascript
- jQuery (version 3.x)
- jKnack Handlebars
- mobx
- Jackson
- Eclipsesource json
- chosen.js
- bootstrap
- jQuery DataTables
- fontawesome

=====Deployment=====  
The client application has been configured to run with Apache Tomcat 8.5 (or Tomcat 8). The pom.xml included with the application contains everything needed for deployment, 
with the exception of the profiles needed to configure the application for a specific environment. The structure of a profile needed to build
this application can be found in the application's pom.xml. Once you've created and configured an appropriate profile, all you will need to do
is run mvn clean tomcat7:redeploy -P[profile name].

=====Building Process=====  
In order to keep from needing several configuration files, the client application uses the pom.xml (or settings.xml accessed by the pom.xml) to store 
environment-specific variables, such as the location of the server you are deploying to, the location of the DOE CODE API, etc.  
--Maven Minify plugin  
All of the CSS and JS files are minified, and replace their non-minified counterparts in the target directory during the build process. All of the application's css files are 
minified into one file.  
--Google replacer plugin  
The google replacer plugin located in the pom.xml takes the values from a profile, and writes them in to files like web.xml post compilation, pre-deployment. 
It also replaces some of the directory paths in the css libraries included with the application, in order to make them DOE CODE specific. 

=====Web Pages=====   
In place of traditional HTML pages and JSP files, DOE CODE uses servlets and mustache/handlebars templates to generate the web application's pages. The servlets located in 
gov.osti.doecode.pagemappings each look at a given URI (if the URI's pattern matches the servlet's mapping in the web.xml), and determine which page to generate. Every template
used can be found in WEB-INF/templates. 

=====JS Files=====  
--How they are structured  
All javascript is located in javascript files (no in-line/in-page code). In order to determine what javascript to execute on a given page, each page with relevant javascript is 
given a hidden input element with an id unique to that page. Then, in the relevant js file, a series of if/else statements are listed with document.getElementById(''), which will
only return true in the event that specific element is found. Most of the code in each section in the javascript is just designed to bind events to various elements.  
--When the js files are included  
For the sake of loading a page faster, and to keep from loading irrelevant libraries, an extra section was added into the footer template that iterates through a list of strings 
that are the paths to js files you want to make page-specific. For example, on the search results page, the footer will write in a path to the dissemination.js file - but it won't 
try to load that file on the user admin page, since it would not be relevant to that page.
