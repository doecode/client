/**
 * Sits in front of URL's that require you to have logged in. Some url's require a login, and some have ways around them (like the account page with password reset)
 */
package gov.osti.doecode.filters;

import gov.osti.doecode.entity.UserFunctions;
import gov.osti.doecode.servlet.Init;
import java.io.IOException;
import java.util.Arrays;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UserFilter implements Filter {

     protected static Logger log = LoggerFactory.getLogger(UserFilter.class.getName());
     private FilterConfig filterConfig = null;

     public UserFilter() {
     }

     @Override
     public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
          request.setCharacterEncoding("UTF-8");
          HttpServletRequest req = (HttpServletRequest) request;
          HttpServletResponse res = (HttpServletResponse) response;
          String URI = req.getRequestURI();
          String remaining = StringUtils.substringAfterLast(URI, "/" + Init.app_name + "/");
          //TODO: Add support for checking user permissions on the backends

          boolean is_logged_in = UserFunctions.isUserLoggedIn(req);
          if (is_logged_in || (!is_logged_in && StringUtils.equals(remaining, "account"))) {
               //Increment time
               res.addCookie(UserFunctions.updateUserSessionTimeout(req));
          } else {
               UserFunctions.redirectUserToLogin(req, res, Init.site_url);
               return;
          }

          response.setContentType("text/html; charset=UTF-8");
          chain.doFilter(request, response);
     }

     public FilterConfig getFilterConfig() {
          return (this.filterConfig);
     }

     public void setFilterConfig(FilterConfig filterConfig) {
          this.filterConfig = filterConfig;
     }

     public void destroy() {
          log.info("User filter destroyed");
     }

     public void init(FilterConfig filterConfig) {
          this.filterConfig = filterConfig;
     }

}
