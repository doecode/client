import Contributor from '../stores/Contributor';
import Developer from '../stores/Developer';
import SponsoringOrganization from '../stores/SponsoringOrganization';
import ResearchOrganization from '../stores/ResearchOrganization';
import ContributingOrganization from '../stores/ContributingOrganization';
import RelatedIdentifier from '../stores/RelatedIdentifier';
import moment from 'moment';
import staticContstants from '../staticJson/constantLists';

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
    success: function(data) {
      handleAuthenticatedSuccess(data, successCallback);
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
    success: function(data) {
      handleAuthenticatedSuccess(data, successCallback);
    },
    error: function(jqXhr, exception) {
      handleAuthenticatedError(jqXhr, exception, errorCallback);
    }
  });
}

function doAuthenicatedFileDownloadAjax(url, successCallback, errorCallback) {
  $.ajax({
    url: url,
    method: 'GET',
    beforeSend: function(request) {
      request.setRequestHeader("X-XSRF-TOKEN", localStorage.xsrfToken);
    },
    success: function(data) {
      handleAuthenticatedSuccess(data, successCallback);
    },
    error: function(xhr, exception) {
      handleAuthenticatedError(xhr, exception, errorCallback);
    }
  });

}

function checkIsAuthenticated() {

  const successCallback = () => {
    localStorage.token_expiration = moment().add(30, 'minutes').format("YYYY-MM-DD HH:mm");
  };

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

function checkHasRole(role) {

  $.ajax({
    url: '/doecode/api/user/hasrole/' + role,
    cache: false,
    method: 'GET',
    beforeSend: function(request) {
      request.setRequestHeader("X-XSRF-TOKEN", localStorage.xsrfToken);
    },
    success: function() {
      localStorage.token_expiration = moment().add(30, 'minutes').format("YYYY-MM-DD HH:mm");
    },
    error: function(jqXhr, exception) {
      handleAuthenticatedError(jqXhr, exception);
    }
  });
}

function handleAuthenticatedSuccess(data, callback) {
  localStorage.token_expiration = moment().add(30, 'minutes').format("YYYY-MM-DD HH:mm");
  callback(data);
}

function handleAuthenticatedError(jqXhr, exception, callback) {
  if (jqXhr.status == 401) {
    window.sessionStorage.lastLocation = window.location.href;
    clearLoginLocalstorage();
    window.location.href = '/doecode/login?redirect=true';
  } else if (jqXhr.status == 403) {
    window.location.href = '/doecode/forbidden'

  } else if (callback != undefined) {
    callback(jqXhr, exception);
  } else {
    window.location.href = '/doecode/errorPage';
  }
}

function clearLoginLocalstorage() {
  localStorage.xsrfToken = "";
  localStorage.user_email = "";
  localStorage.first_name = "";
  localStorage.last_name = "";
  localStorage.token_expiration = "";
  localStorage.roles = "";
  localStorage.user_site = "";
}

function setLoggedInAttributes(data) {
  localStorage.xsrfToken = data.xsrfToken;
  localStorage.user_email = data.email;
  localStorage.first_name = data.first_name;
  localStorage.last_name = data.last_name;
  localStorage.token_expiration = moment().add(30, 'minutes').format("YYYY-MM-DD HH:mm");
  localStorage.roles = JSON.stringify(data.roles);
  localStorage.user_site = data.site;
}

function resetLoggedInAttributesUserData(data) {
  localStorage.first_name = data.first_name;
  localStorage.last_name = data.last_name;
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
/*Sees whether or not the arrays contain the same stuff, regardless of order*/
function doArraysContainSame(array1, array2) {
  var containsSame = true;
  if (array1.length == array2.length) {
    array1.forEach(function(item) {
      if (array2.indexOf(item) < 0) {
        containsSame = false;
        return false;
      }
    });
  } else {
    containsSame = false;
  }
  return containsSame;
}

function checkPassword(data) {
  const password = data.password;
  const email = data.email;
  const confirm = data.confirm_password;
  const minLength = 8;
  const specialCharacterRegex = /[^a-zA-Z\d\s]/g;
  const lowerRegex = /[a-z]/g;
  const upperRegex = /[A-Z]/g;
  const numberRegex = /[\d]/g;

  var newState = {};
  newState.longEnough = password.length >= minLength;
  newState.hasSpecial = specialCharacterRegex.test(password);
  newState.hasNumber = numberRegex.test(password);
  newState.upperAndLower = upperRegex.test(password) && lowerRegex.test(password);
  newState.containsName = password.indexOf(email) > -1;
  newState.matches = password !== '' && (password === confirm);

  return newState;
}

function getIsLoggedIn() {
  return (localStorage.token_expiration != "" && moment(localStorage.token_expiration, "YYYY-MM-DD HH:mm").isAfter(moment()));
}

function addBiblio(searchData) {
  var tagsList = [];
  //Software Title
  if (searchData.software_title) {
    tagsList.push({name: 'citation_title', content: searchData.software_title});
  }
  //Doi
  if (searchData.doi) {
    tagsList.push({name: 'citation_doi', content: searchData.doi});
  }
  //Description
  if (searchData.description) {
    tagsList.push({name: 'citation_description', content: searchData.description});
  }
  //Keywords
  if (searchData.keywords) {
    tagsList.push({name: 'citation_keywords', content: searchData.keywords});
  }
  //Release Date
  if (searchData.release_date) {
    var release_date_moment = moment(searchData.release_date, "YYYY-MM-DD").format("YYYY/MM/DD");
    tagsList.push({name: 'citation_date', content: release_date_moment});
  }
  //Licenses
  if (searchData.licenses) {
    tagsList.push({name: 'citation_licenses', content: searchData.licenses});
  }
  //Developers
  if (searchData.developers && searchData.developers.length > 0) {
    var index = 0;
    var developerString = "";
    searchData.developers.forEach(function(row) {
      developerString += (row.last_name + ', ' + row.first_name);
      if ((index + 1) < searchData.developers.length) {
        developerString += "; ";
      } else {
        index++;
      }
    });
    tagsList.push({name: 'citation_developers', content: developerString});
  }
  //Contributors
  if (searchData.contributors && searchData.contributors.length > 0) {
    var index = 0;
    var contributorsString = "";
    searchData.contributors.forEach(function(row) {
      contributorsString += (row.last_name + ', ' + row.first_name);
      if ((index + 1) < searchData.contributors.length) {
        contributorsString += "; ";
      } else {
        index++;
      }
    });
    tagsList.push({name: 'citation_contributors', content: contributorsString});
  }
  //Sponsoring Orgs
  if (searchData.sponsoring_organizations && searchData.sponsoring_organizations.length > 0) {
    var index = 0;
    var sponsoringString = "";
    searchData.sponsoring_organizations.forEach(function(row) {
      sponsoringString += (row.organization_name);
      if ((index + 1) < searchData.sponsoring_organizations.length) {
        sponsoringString += "; ";
      } else {
        index++;
      }
    });
    tagsList.push({name: 'citation_sponsoring_organizations', content: sponsoringString});
  }
  //Research Organizations
  if (searchData.research_organizations && searchData.research_organizations.length > 0) {
    var index = 0;
    var researchString = "";
    searchData.research_organizations.forEach(function(row) {
      researchString += (row.organization_name);
      if ((index + 1) < searchData.research_organizations.length) {
        researchString += "; ";
      } else {
        index++;
      }
    });
    tagsList.push({name: 'citation_research_organizations', content: researchString});
  }
  //Contributing Organizations
  if (searchData.contributing_organizations && searchData.contributing_organizations.length > 0) {
    var index = 0;
    var contributingString = "";
    searchData.contributing_organizations.forEach(function(row) {
      v += (row.organization_name);
      if ((index + 1) < searchData.contributing_organizations.length) {
        contributingString += "; ";
      } else {
        index++;
      }
    });
    tagsList.push({name: 'citation_contributing_organizations', content: contributingString});
  }
  //Country of Origin
  if (searchData.country_of_origin) {
    tagsList.push({name: 'citation_country_of_origin', content: searchData.country_of_origin});
  }
  //Repository_link
  if (searchData.repository_link) {
    tagsList.push({name: 'citation_repository_link', content: searchData.repository_link});
  }
  //Accessibility
  if (searchData.accessibility) {
    var accessibility_display_val = '';
    staticContstants.availabilities.forEach(function(item) {
      if (item.value == searchData.accessibility) {
        accessibility_display_val = item.label;
      }
    });
    tagsList.push({name: 'citation_accessibility', content: accessibility_display_val});
  }

  addMetaTags(tagsList);
}

function addMetaTags(list) {
  list.forEach(function(row) {
    var metaTag = document.createElement('meta');
    metaTag.setAttribute('name', row.name);
    metaTag.setAttribute('content', row.content);
    document.getElementById('document-head').appendChild(metaTag);
  });
}

export {doAjax};
export {doAuthenticatedAjax};
export {checkIsAuthenticated};
export {checkHasRole};
export {doAuthenticatedMultipartRequest}
export {appendQueryString};
export {getQueryParam};
export {getChildData};
export {clearLoginLocalstorage};
export {setLoggedInAttributes};
export {checkPassword};
export {resetLoggedInAttributesUserData};
export {doArraysContainSame};
export {getIsLoggedIn};
export {doAuthenicatedFileDownloadAjax};
export {addMetaTags};
export {addBiblio};
