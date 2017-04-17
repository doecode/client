
import Contributor from '../stores/Contributor';
import Developer from '../stores/Developer';
import DeveloperField from '../field/DeveloperField';
import ContributorField from '../field/ContributorField';

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
  
  function getChildData(type) {
	  if (type === 'developers')
		  return new Developer();
	  else if (type === 'contributors')
		  return new Contributor();
  }
  
  function getChildField(type) {
	  const fields = {
	   "developers" : DeveloperField,
	   "contributors" : ContributorField
	  }
	  
	  return fields[type];
  }
  
  


export {doAjax};
export {appendQueryString};
export {getChildData};
export {getChildField};