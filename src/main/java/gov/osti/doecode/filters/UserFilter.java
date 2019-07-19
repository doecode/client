/**
 * Sits in front of URL's that require you to have logged in. Some url's require a login, and some have ways around them (like the account page with password reset)
 */
package gov.osti.doecode.filters;

import gov.osti.doecode.entity.UserFunctions;
import gov.osti.doecode.servlet.Init;
import gov.osti.doecode.utils.JsonUtils;
import java.io.IOException;
import java.util.Arrays;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@WebFilter(servletNames = "UserFilter", urlPatterns = {"/submit", "/form-select", "/announce", "/approve", "/confirm",
    "/projects", "/pending", "/account", "/user-admin", "/site-admin"})
public class UserFilter implements Filter {

    protected static Logger log = LoggerFactory.getLogger(UserFilter.class.getName());
    private FilterConfig filterConfig = null;

    //TODO change to REQUIRES_USER_ADMIN_ROLE
    protected final String[] REQUIRES_OSTI_ROLE = {"site-admin", "user-admin", "pending", "approve"};

    public UserFilter() {
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        request.setCharacterEncoding("UTF-8");
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;
        String URI = req.getRequestURI();
        String remaining = StringUtils.substringAfterLast(URI, "/" + Init.app_name + "/");

        boolean is_logged_in = UserFunctions.isUserLoggedIn(req);
        boolean password_needs_reset = StringUtils.equals(UserFunctions.getOtherUserCookieValue(req, "needs_password_reset"), "true");

        /* Determine the course of action, based on the need for a login */
        if (is_logged_in && !password_needs_reset) {
            // If they are logged in, and don't need a password reset, continue
            res.addCookie(UserFunctions.updateUserSessionTimeout(req));

            // If the user doesn't have an OSTI role, yet is trying to access osti-only
            // content, they need to be redirected
            //TODO change to has USER ADMIN ROLE
            boolean has_osti_role = JsonUtils.getBoolean(UserFunctions.getUserDataFromCookie(req), "has_osti_role", false);
            if (!has_osti_role && Arrays.asList(REQUIRES_OSTI_ROLE).contains(remaining)) {
                res.setStatus(HttpServletResponse.SC_FORBIDDEN);
                res.sendRedirect(Init.site_url + "forbidden");
                return;
            }

        } else if (is_logged_in && password_needs_reset && StringUtils.equals(remaining, "account")) {
            // If they are logged in, but need a password reset, and are going to the
            // account page
            res.addCookie(UserFunctions.updateUserSessionTimeout(req));
            Cookie needs_reset_cookie = UserFunctions.getOtherUserCookie(req, "needs_password_reset");
            needs_reset_cookie.setMaxAge(Init.SESSION_TIMEOUT_MINUTES * 60);
            res.addCookie(needs_reset_cookie);

        } else if (is_logged_in && password_needs_reset && !StringUtils.equals(remaining, "account")) {
            // If they try to redirect to a logged-in page (that isn't account), but need a
            // password reset, redirect them to the account page
            res.sendRedirect(Init.site_url + "account");
            return;

        } else if (!is_logged_in && StringUtils.equals(remaining, "account")) {
            // If they are not logged in, but are going to the account page with a passcode
            String passcode_param = req.getParameter("passcode");

            // If they don't have a passcode either way, redirect them to the login
            if (StringUtils.isBlank(passcode_param)) {
                UserFunctions.redirectUserToLogin(req, res, Init.site_url);
                return;
            }

            res.addCookie(UserFunctions.updateUserSessionTimeout(req));

        } else {
            UserFunctions.redirectUserToLogin(req, res, Init.site_url);
            return;

        }
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
