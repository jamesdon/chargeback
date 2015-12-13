The Charge Back App is intended to calculate maintenance and yearly run rates for Splunk.    

If you are running Splunk in a medium to large environment, you are probably sharing Splunk with other groups.  In many places, this results in one group running Splunk as a service for any number of internal customers.  The challenge then becomes sharing the maintenance and run costs of the infrastructure.  As a Splunk administrator, I would have to run several long-running searches to try and figure out the costs.  This App should put all of that to rest.


Changes to Splunk:
This App will not install new indexes, but will increase frozenTimePeriodInSecs to _internal to 13 months (34186670 seconds).

There are not any special installation steps for this App, but there are REQUIRED configuration steps below.


Configuration:
You will need to update the customers.csv lookup file to customize the App to suit your needs.  Using the "Lookup File Editor App for Splunk Enterprise" App makes this extremely easy.  

	https://splunkbase.splunk.com/app/1724/


There is a single dashboard for this App with several tabs.  The filters at the top will effect all of the tabs.  Below, I will explain each tab.

Index Utilization and Prediction:
This dashboard is intended to allow you to visualize actual index utilization, as apposed to configured limits.  If you click on a particular index, you will see a predicted utilization of that index, which should help you plan for the future.


Customer Costs:
This dashboard breaks out the total charges for license maintenance and storage costs.  It then combines them, so that you can send you customers an itemized bill.  

I think that it is worth taking a look deeper at the calculations used to drive all of the numbers.  Below is the search used to drive almost all of the dashboard panels.  I have inserted comments to explain what is going on.  However, you will not be able to run this search if you copy and paste it in Splunk unless you remove the comments, which are not compatible with SPL:

      
      ### Rest call provides information about your configured indexes
      ### Rename the index field so that you can join the data in customers.csv
      ### "max=0" allows for multiple groups to share the same index, and assume a percentage of ownership
      ### The Dedup accounts for the csv being read multiple times in a Search head Cluster environment
      ### To zoom in a particular  group, select it from the dropdown menu 
      | rest /services/data/indexes 
      | rename title as idx 
      | join max=0 idx [| inputlookup customers.csv]
      | dedup group idx percent_ownership 
      | search group=$group|s$
      
      ### We are setting the variables from the form and calculating "Years Retention"
      | eval license_rate          = $license_rate$
      | eval hot_warm_storage_rate = $hot_warm_storage_rate$
      | eval cold_storage_rate     = $cold_storage_rate$
      | eval "Years Retention"     = round(frozenTimePeriodInSecs/31536000,2)
   
      ### The search results return many fields that are in MBs, we want to convert them to GBs and rename the fields   
      | foreach *MB [ eval &lt;&lt;MATCHSTR&gt;&gt;GB = '&lt;&lt;FIELD&gt;&gt;' / 1024 ]
      
      ### We are determining what the hot_warm_conf value is, or more specifically the "hot/warm bucket configuration".  This is not a simple matching of field names, since setting certain values to 0 makes them unlimited.  Read this documentation for detailed information  about each parameter - http://docs.splunk.com/Documentation/Splunk/6.2.0/Admin/Indexesconf
      | eval hot_warm_calc_gb      = if('homePath.maxDataSizeGB' == 0, maxTotalDataSizeGB, 'homePath.maxDataSizeGB')
      | eval hot_warm_storage_cost = hot_warm_calc_gb * hot_warm_storage_rate * percent_ownership / 100
      
      ### We are now determining what the cold_conf value is, or more specifically the "cold bucket configuration".  This takes an extra step when compared to the hot/warm buckets.  See the same documentation to understand why.
      | eval cold_calc_gb        = maxTotalDataSizeGB - 'homePath.maxDataSizeGB'
      | eval cold_calc_gb         = if('coldPath.maxDataSizeGB' == 0 AND 'homePath.maxDataSizeGB' = 0, 0, cold_calc_gb)
      | eval cold_storage_cost = cold_calc_gb * cold_storage_rate * percent_ownership / 100
      
      ### Combine the two calculated fields so that we can audit it later
      | eval total_storage_conf_gb = hot_warm_calc_gb + cold_calc_gb
      
      ### Determine storage and license costs
      | eval stor_cost = (hot_warm_storage_cost + cold_storage_cost)
      | eval lic_cost  = max_lic_GB * license_rate * percent_ownership / 100

      ### Setting the new field name for convenience and gathering their total
      | eval homePathmaxDataSizeGB = 'homePath.maxDataSizeGB'
      | eval coldPathmaxDataSizeGB = 'coldPath.maxDataSizeGB'
      | eval totalPathmaxDataSizeGB = homePathmaxDataSizeGB + coldPathmaxDataSizeGB
      
      ### Calculate totals and some more calculations for analysis
      | addcoltotals lic_cost stor_cost hot_warm_storage_cost cold_storage_cost         
      | eval total_cost    = lic_cost+stor_cost              
      | eval unused_lic_GB = max_lic_GB-currentDBSizeGB

      ### Here, we are rounding our numbers so that they look pretty and are more understandable at a glance      
      | foreach *_cost *_rate *GB cold_calc_gb percent_ownership [ eval &lt;&lt;FIELD&gt;&gt; = round( '&lt;&lt;FIELD&gt;&gt;' , 2 ) ]
      
      ### The table and sort are necessary so that we can use the fields for post processing
      | table idx, splunk_server, eai:acl.app, max_lic_GB, license_rate, lic_cost, currentDBSizeGB, unused_lic_GB, homePath_expanded, coldPath_expanded, maxTotalDataSizeGB, totalEventCount, disabled, years_retention, hot_warm_calc_gb, hot_warm_storage_rate, hot_warm_storage_cost, cold_calc_gb, cold_storage_rate, cold_storage_cost, stor_cost, percent_ownership, total_cost, total_storage_conf_gb, group, homePathmaxDataSizeGB, coldPathmaxDataSizeGB
      
      | sort  idx, splunk_server, eai:acl.app, max_lic_GB, license_rate, lic_cost, currentDBSizeGB, unused_lic_GB, homePath_expanded, coldPath_expanded, maxTotalDataSizeGB, totalEventCount, disabled, years_retention, hot_warm_calc_gb, hot_warm_storage_rate, hot_warm_storage_cost, cold_calc_gb, cold_storage_rate, cold_storage_cost, stor_cost, percent_ownership, total_cost, total_storage_conf_gb, group, homePathmaxDataSizeGB, coldPathmaxDataSizeGB
      
      ### Saving renaming for the end makes a large search like this more manageable
      | rename idx AS Index, splunk_server AS "Splunk Server", max_lic_GB AS "Max Conf License GB", license_rate AS "License Rate", lic_cost AS "License Cost", stor_cost AS "Storage Cost", total_cost AS "Total Cost", currentDBSizeGB AS "Current GB Used", maxTotalDataSizeGB AS "Max Index Size GB", unused_lic_GB AS "Available Lic GB", eai:acl.app AS "App ACL", totalEventCount AS "Event Count", disabled AS Disabled, percent_ownership AS "Percent Ownership", hot_warm_calc_gb AS "Hot/Warm Calc GB", cold_calc_gb AS "Cold Calc GB", hot_warm_storage_rate AS "Hot/Warm Storage Rate", cold_storage_rate AS "Cold Rate", hot_warm_storage_cost AS "Hot/Warm Storage Cost", cold_storage_cost AS "Cold Storage Cost", total_storage_conf_gb AS "Total Storage Conf GB",homePathmaxDataSizeGB AS "Max Hot/Warm Size GB", coldPathmaxDataSizeGB AS "Max Cold Size GB"</query>


Configuration Audit:
To ensure that you are providing accurate numbers to your customers, this dashboard audits both your configuration for this App as well as your indexes.  Review each dashboard panel on the top row to ensure that you are not over subscribed to an index in any particular manor.  Also look at your license configuration to ensure that you have the appropriate licenses installed.  While expired licenses will not harm you in any way, you might want to clean them up so they do not mislead you.


License Configuration Details:
This dashboard shows you the exact numbers used in calculating the total license cost.  It will also display RED fields when there is a configuration error.

Storage Configuration Details:
The same as the license dashboard, but created with a focus on storage.  The color-coding for fields is as follows:

	Orange - Used in both "hot/warm" and "cold" storage calculations
	Red - Used for "hot/warm" storage calculations
	Blue - Used for "cold" storage calculations

Please provide feedback and/or enhancement requests to jim@splunk.com.

Application development is hosted on github - https://github.com/jamesdon/chargeback, if you would like to join in on the fun!


Custom Buttons:
The custom buttons at the top of the dashboard are intended to simplify the configuration.  If the "Edit Config" button does not work for you, check the following:

	Ensure that you have the "Lookup Edit" App installed.

	Check the URL that is used if you manually browse to edit the file.  You can then update the XML to contain that path.  In some cases, different permissions will change that URL.  Also be sure to add "amp;" after each & in the XML.


Contributing Authors:
James Donn
Kristofer Hutchinson
Burch Simon



