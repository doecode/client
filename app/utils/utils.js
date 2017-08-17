import Contributor from '../stores/Contributor';
import Developer from '../stores/Developer';
import SponsoringOrganization from '../stores/SponsoringOrganization';
import ResearchOrganization from '../stores/ResearchOrganization';
import ContributingOrganization from '../stores/ContributingOrganization';
import RelatedIdentifier from '../stores/RelatedIdentifier';

function doAjax(methodType, url, successCallback, data, errorCallback, dataType) {
  let errorCall = errorCallback;
  if (errorCall === undefined) {
    errorCall = (jqXhr, exception) => {
      console.log("Error...");
      // window.location.href = '/doecode/error';
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

  if (errorCallback === undefined) {
    errorCallback = handleError;
  }

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
    success: successCallback,
    error: errorCallback
  });
}

function doAuthenticatedAjax(methodType, url, successCallback, data, errorCallback) {

  if (errorCallback === undefined) {
    errorCallback = handleError;
  }

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
    success: successCallback,
    error: errorCallback
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
    error: handleError
  });
}

function handleError(jqXhr, exception) {
  console.log("Hmm");
  console.log(jqXhr.status);
  if (jqXhr.status == 401) {
    window.sessionStorage.lastLocation = window.location.href;
    localStorage.xsrfToken = "";
    localStorage.user_email = "";
    localStorage.first_name = "";
    localStorage.last_name = "";
    window.location.href = '/doecode/login?redirect=true';
  } else if (jqXhr.status == 403) {
    window.location.href = '/doecode/forbidden'
  } else {
    console.log("Hey");
  }
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
export {checkIsAuthenticated};
export {doAuthenticatedMultipartRequest}
export {appendQueryString};
export {getQueryParam};
export {getChildData};
