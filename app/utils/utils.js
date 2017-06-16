
import Contributor from '../stores/Contributor';
import Developer from '../stores/Developer';
import SponsoringOrganization from '../stores/SponsoringOrganization';
import ResearchOrganization from '../stores/ResearchOrganization';
import ContributingOrganization from '../stores/ContributingOrganization';
import RelatedIdentifier from '../stores/RelatedIdentifier';

function doAjax(methodType, url, successCallback, data, errorCallback) {


    $.ajax({
      url: url,
      cache: false,
      method: methodType,
      dataType: 'json',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: successCallback,
      error: errorCallback
    });

  }

function doAuthenticatedAjax(methodType, url, successCallback, data, errorCallback) {


    $.ajax({
      url: url,
      cache: false,
      method: methodType,
      beforeSend: function(request) {
      	request.setRequestHeader("X-XSRF-TOKEN", localStorage.xsrfToken);
      },
      dataType: 'json',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: successCallback,
      error: errorCallback
    });

  }

  function appendQueryString(url) {

    var ampOrQuestion = "?";
    if (url.indexOf('?') > 0)
      ampOrQuestion = "&";

    var queryString = window.location.search.slice(1);
    if (queryString)
      return url + ampOrQuestion + window.location.search.slice(1);
    else
      return url;
  }
  
  function getQueryParam(paramName) {
      var query = window.location.search.substring(1);
      var vars = query.split("&");
      for (var i = 0; i < vars.length; i++) {
           var pair = vars[i].split("=");
           if (pair[0].toLowerCase() === paramName.toLowerCase()) {
                return pair[1];
           }
      }
      
      return false;
 }

function getChildData(type) {

    if (type === 'developers') {
        return new Developer();
    } else if (type === 'contributors') {
        return new Contributor();
    } else if (type === 'sponsoring_organizations') {
        return new SponsoringOrganization();
    } else if (type === 'contributing_organizations') {
        return new ContributingOrganization();
    } else if (type === 'research_organizations') {
        return new ResearchOrganization();
    } else if (type === 'related_identifiers') {
    	return new RelatedIdentifier();
    }

}




export {doAjax};
export {doAuthenticatedAjax};
export {appendQueryString};
export {getQueryParam};
export {getChildData};
