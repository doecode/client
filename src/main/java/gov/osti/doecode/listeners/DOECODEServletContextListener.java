package gov.osti.doecode.listeners;

import com.fasterxml.jackson.databind.node.ArrayNode;
import gov.osti.doecode.entity.DOECODEJson;
import gov.osti.doecode.utils.DOECODEUtils;
import gov.osti.doecode.utils.JsonObjectUtils;
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
          ArrayNode return_list = new ArrayNode(JsonObjectUtils.FACTORY_INSTANCE);
          switch (list) {
               case DOECODEJson.AFFILIATIONS_KEY:
                    return_list = doecode_json_lists.getAffiliationsList();
                    break;
               case DOECODEJson.AVAILABILITY_KEY:
                    return_list = doecode_json_lists.getAvailabilityList();
                    break;
               case DOECODEJson.CONTRIBUTOR_KEY:
                    return_list = doecode_json_lists.getContributorList();
                    break;
               case DOECODEJson.COUNTRIES_KEY:
                    return_list = doecode_json_lists.getCountriesList();
                    break;
               case DOECODEJson.LICENSE_KEY:
                    return_list = doecode_json_lists.getLicenseOptionsList();
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
          }

          return return_list;
     }

     @Override
     public void contextInitialized(ServletContextEvent sce) {
          //FIll up the lists
          doecode_json_lists.UPDATE_REMOTE_LISTS(sce.getServletContext());
          //Schedule a job that runs once a day that fills the lists back up with fresh data
          TimerTask json_maintenance = new TimerTask() {
               public void run() {
                    log.info("Updating remote lists at: " + LocalDateTime.now().format(DOECODEUtils.MONTH_DAY_YEAR_TIME_FORMAT));
                    doecode_json_lists.UPDATE_REMOTE_LISTS(sce.getServletContext());
                    log.info("Completed remote lists at: " + LocalDateTime.now().format(DOECODEUtils.MONTH_DAY_YEAR_TIME_FORMAT));
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
