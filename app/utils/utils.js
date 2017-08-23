import Contributor from '../stores/Contributor';
import Developer from '../stores/Developer';
import SponsoringOrganization from '../stores/SponsoringOrganization';
import ResearchOrganization from '../stores/ResearchOrganization';
import ContributingOrganization from '../stores/ContributingOrganization';
import RelatedIdentifier from '../stores/RelatedIdentifier';
import moment from 'moment';

function doAjax(methodType, url, successCallback, data, errorCallback, dataType) {
  let errorCall = errorCallback;
  if (errorCall === undefined) {
    errorCall = (jqXhr, exception) => {
      console.log("Error...");
    }
  }

  if (dataType === undefined) {
    dataType = "json";
  }

  $.ajax({
    url: url,
    cache: false,
    method: methodType,
    dataType: dataType,
    data: JSON.stringify(data),
    contentType: "application/json; charset=utf-8",
    success: successCallback,
    error: errorCall
  });

}

function doAuthenticatedMultipartRequest(url, formData, successCallback, errorCallback) {

  if (successCallback === undefined) {
    successCallback = () => {
      console.log("Success")
    };
  }

  $.ajax({
    url: url,
    processData: false,
    contentType: false,
    method: 'POST',
    beforeSend: function(request) {
      request.setRequestHeader("X-XSRF-TOKEN", localStorage.xsrfToken);
    },
    dataType: 'json',
    data: formData,
    success: function(data){
      handleAuthenticatedSuccess(data,successCallback);
    },
    error: function(jqXhr, exception) {
      handleAuthenticatedError(jqXhr, exception, errorCallback);
    }
  });
}

function doAuthenticatedAjax(methodType, url, successCallback, data, errorCallback) {

  if (successCallback === undefined) {
    successCallback = () => {};
  }

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
    success: function(data){
      handleAuthenticatedSuccess(data,successCallback);
    },
    error: function(jqXhr, exception) {
      handleAuthenticatedError(jqXhr, exception, errorCallback);
    }
  });

}

function checkIsAuthenticated() {

  const successCallback = () => {};

  $.ajax({
    url: '/doecode/api/user/authenticated',
    cache: false,
    method: 'GET',
    beforeSend: function(request) {
      request.setRequestHeader("X-XSRF-TOKEN", localStorage.xsrfToken);
    },
    success: successCallback,
    error: handleAuthenticatedError
  });
}

function handleAuthenticatedSuccess(data, callback) {
    localStorage.token_expiration = moment().add(30,'minutes').format("YYYY-MM-DD HH:mm");
    callback(data);
}

function handleAuthenticatedError(jqXhr, exception, callback) {
  if (jqXhr.status == 401) {
    window.sessionStorage.lastLocation = window.location.href;
    clearLoginLocalstorage();
    window.location.href = '/doecode/login?redirect=true';
  } else if (jqXhr.status == 403) {
    window.location.href = '/doecode/forbidden'
  } else if (callback !== undefined) {
    callback(jqXhr,exception);
  }else{
    window.location.href='/doecode/errorPage';
  }
}

function clearLoginLocalstorage() {
  localStorage.xsrfToken = "";
  localStorage.user_email = "";
  localStorage.first_name = "";
  localStorage.last_name = "";
  localStorage.token_expiration = "";
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

function setLoggedInAttributes(data){
  localStorage.xsrfToken = data.xsrfToken;
  localStorage.user_email = data.email;
  localStorage.first_name = data.first_name;
  localStorage.last_name = data.last_name;
  localStorage.token_expiration = moment().add(30, 'minutes').format("YYYY-MM-DD HH:mm");
}

export {doAjax};
export {doAuthenticatedAjax};
export {checkIsAuthenticated};
export {doAuthenticatedMultipartRequest}
export {appendQueryString};
export {getQueryParam};
export {getChildData};
export {clearLoginLocalstorage};
export {setLoggedInAttributes};
