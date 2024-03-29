package gov.osti.doecode.listeners;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import gov.osti.doecode.entity.DOECODEJson;
import gov.osti.doecode.utils.DOECODEUtils;
import gov.osti.doecode.utils.JsonUtils;
import java.time.LocalDateTime;
import java.util.TimerTask;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@WebListener()
public class DOECODEServletContextListener implements ServletContextListener {

    private static final Logger log = LoggerFactory.getLogger(DOECODEServletContextListener.class);

    private static ScheduledExecutorService json_update_thread = Executors.newSingleThreadScheduledExecutor();

    private static final DOECODEJson doecode_json_lists = new DOECODEJson();

    public static ArrayNode getJsonList(String list) {
        ArrayNode return_list = JsonUtils.createArrayNode();
        switch (list) {
            case DOECODEJson.AFFILIATIONS_KEY:
                return_list = doecode_json_lists.getAffiliationsList();
                break;
            case DOECODEJson.PROJECT_TYPE_KEY:
                return_list = doecode_json_lists.getProjectTypeList();
                break;
            case DOECODEJson.CONTRIBUTOR_PERSONAL_KEY:
                return_list = doecode_json_lists.getContributorPersonalList();
                break;
            case DOECODEJson.CONTRIBUTOR_ORG_KEY:
                return_list = doecode_json_lists.getContributorOrgList();
                break;
            case DOECODEJson.COUNTRIES_KEY:
                return_list = doecode_json_lists.getCountriesList();
                break;
            case DOECODEJson.LICENSE_KEY:
                return_list = doecode_json_lists.getLicenseOptionsList();
                break;
            case DOECODEJson.ACCESS_LIMITATIONS_KEY:
                return_list = doecode_json_lists.getAccessLimitationsList();
                break;
            case DOECODEJson.PROTECTIONS_KEY:
                return_list = doecode_json_lists.getProtectionsList();
                break;
            case DOECODEJson.RESEARCH_KEY:
                return_list = doecode_json_lists.getResearchOrgList();
                break;
            case DOECODEJson.SEARCH_SORT_KEY:
                return_list = doecode_json_lists.getSearchSortOptionsList();
                break;
            case DOECODEJson.SOFTWARE_TYPE_KEY:
                return_list = doecode_json_lists.getSoftwareTypeList();
                break;
            case DOECODEJson.SPONSOR_ORG_KEY:
                return_list = doecode_json_lists.getSponsorOrgsList();
                break;
            case DOECODEJson.STATES_KEY:
                return_list = doecode_json_lists.getStatesList();
                break;
            case DOECODEJson.RELATION_TYPES_KEY:
                return_list = doecode_json_lists.getRelationTypesList();
                break;
            case DOECODEJson.PROGRAMMING_LANGUAGES_KEY:
                return_list = doecode_json_lists.getProgrammingLanguagesList();
                break;
            case DOECODEJson.PROJECT_KEYWORDS_KEY:
                return_list = doecode_json_lists.getProjectKeywordsList();
                break;
        }
        return return_list;

    }

    public static ObjectNode getJsonObject(String key) {
        ObjectNode return_data = JsonUtils.createObjectNode();
        switch (key) {
            case DOECODEJson.DOE_CODE_SITES_WITH_SOFTWARE_GROUP_EMAILS_KEY:
                return_data = doecode_json_lists.getDOESitesWithSoftwareGroupEmails();
        }
        return return_data;
    }

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        //FIll up the lists
        try {
            doecode_json_lists.UPDATE_REMOTE_LISTS(sce.getServletContext());
        } catch (Exception e) {
            log.error("An exception was thrown in the update remote lists! : " + DOECODEUtils.getStackTrace(e));
        }
        //Schedule a job that runs once a day that fills the lists back up with fresh data
        TimerTask json_maintenance = new TimerTask() {
            public void run() {
                log.info("Updating remote lists at: " + LocalDateTime.now().format(DOECODEUtils.MONTH_DAY_YEAR_TIME_FORMAT));
                try {
                    doecode_json_lists.UPDATE_REMOTE_LISTS(sce.getServletContext());
                    log.info("Completed remote lists at: " + LocalDateTime.now().format(DOECODEUtils.MONTH_DAY_YEAR_TIME_FORMAT));
                } catch (Exception e) {
                    log.error("Exception in updating remote lists: " + e.getMessage());
                }
            }
        };

        //Once a day, update the remote lists
        json_update_thread.scheduleAtFixedRate(json_maintenance, 1, 1, TimeUnit.DAYS);
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        log.info("Shutting Down DOE CODE");
        json_update_thread.shutdown();
        log.info("Update thread shut down");
    }

}
