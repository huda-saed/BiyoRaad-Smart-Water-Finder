/* Sample data for SOMALILAND (replace with Django API/JSON later).
   All sources are sample records placed at approximate real-town coordinates in Somaliland. */
const DATA_VERSION='somaliland-1';
const SL_REGIONS=['Maroodi Jeex','Sahil','Togdheer','Awdal','Sanaag','Sool'];
const SL_CENTER=[9.56,44.065];           /* Hargeisa */
const SL_ZOOM=8;                          /* shows Hargeisa, Borama, Berbera and Burao */
const SL_STATS={users:642,resolvedBase:86};
const RAW_SOURCES = [
 ['26 June Community Borehole','Maroodi Jeex','Hargeisa',9.5650,44.0770,'Borehole','available',82,94,'$0.04 / 20L','24 hours','Deep borehole serving households in the 26 June district of Hargeisa.'],
 ['Berbera Port Road Water Kiosk','Sahil','Berbera',10.4396,45.0143,'Water Kiosk','available',88,96,'$0.06 / 20L','6 AM - 10 PM','Borehole-fed kiosk with regular quality testing for the town centre.'],
 ['Burao Berkad Reservoir','Togdheer','Burao',9.5310,45.5250,'Berkad','low',31,68,'Free','24 hours','Rain-fed berkad; levels drop sharply in the dry season.'],
 ["Ga'an Libaah Water Point",'Maroodi Jeex','Hargeisa',9.5440,44.0420,'Water Kiosk','available',74,90,'$0.05 / 20L','6 AM - 8 PM','Municipal kiosk connected to the Hargeisa supply network.'],
 ['Borama Spring Source','Awdal','Borama',9.9420,43.1880,'Spring','available',77,95,'Free','24 hours','Natural spring in the hills with a protected catchment.'],
 ['Gabiley Town Well','Maroodi Jeex','Gabiley',9.7000,43.6200,'Well','available',70,88,'$0.03 / 20L','6 AM - 6 PM','Hand-dug and lined well maintained by the local committee.'],
 ['Erigavo Cal Madow Spring Intake','Sanaag','Erigavo',10.6150,47.3700,'Spring','low',38,61,'Free','24 hours','Solar pump station on a highland spring; output falls in the dry season.'],
 ['Las Anod Borehole No. 3','Sool','Las Anod',8.4780,47.3600,'Borehole','dry',0,55,'$0.04 / 20L','6 AM - 6 PM','Out of service since the pump failure; repair requested.'],
 ['Sheikh Highland Well','Togdheer','Sheikh',9.9300,45.2000,'Well','available',66,86,'Free','5 AM - 7 PM','Deep well shared by town households and nearby pastoral families.'],
 ['Burao Public Well','Togdheer','Burao',9.5150,45.5400,'Well','available',60,84,'Free','5 AM - 7 PM','Shared by pastoral families and the town market.'],
 ['Mohamed Mooge Water Kiosk','Maroodi Jeex','Hargeisa',9.5690,44.0980,'Water Kiosk','low',29,58,'$0.05 / 20L','6 AM - 8 PM','Supply is intermittent; queues build up in the evening.'],
 ['Berbera Coastal Borehole','Sahil','Berbera',10.4300,45.0300,'Borehole','dry',0,50,'$0.05 / 20L','6 AM - 6 PM','Saline intrusion detected; closed for testing.'],
 ['Odweyne Berkad','Togdheer','Odweyne',9.4090,45.0650,'Berkad','available',58,70,'Free','24 hours','Community berkad filled by seasonal rain and trucked water.'],
 ['Zeila Coastal Well','Awdal','Zeila',11.3533,43.4739,'Well','low',36,60,'$0.03 / 20L','6 AM - 6 PM','Brackish well; treat or boil water before drinking.']
];
const DEFAULT_SOURCES = RAW_SOURCES.map((r,i)=>({id:i+1,name:r[0],region:r[1],city:r[2],lat:r[3],lng:r[4],type:r[5],status:r[6],capacity:r[7],quality:r[8],cost:r[9],hours:r[10],desc:r[11],
  history:[9,5,-6,3,-4,0].map(d=>r[7]?Math.max(5,Math.min(100,r[7]+d)):0)}));
const DEFAULT_REPORTS = [
 [1,'me',3,'No water','High','pending','2026-11-20','The berkad has been almost empty for four days.'],
 [2,'me',8,'Broken pump','High','investigating','2026-11-14','Pump stopped working; families walk 3 km to the next well.'],
 [3,'me',12,'Contaminated','Medium','resolved','2026-11-02','Water tasted salty and looked cloudy.'],
 [4,'me',4,'Long queue','Low','resolved','2026-10-25','Queues of more than two hours in the morning.'],
 [5,'Omar Farah',12,'Contaminated','High','investigating','2026-11-19','Salty taste reported by many users.'],
 [6,'Hodan Ali',11,'Low pressure','Medium','pending','2026-11-21','Tap pressure very low after midday.'],
 [7,'Abdi Warsame',8,'No water','High','pending','2026-11-22','Station closed with no notice.'],
 [8,'Fatuma Noor',14,'Low pressure','Low','resolved','2026-10-30','Well flow is weaker than last month.'],
 [9,'Yusuf Gedi',7,'Broken pump','Medium','investigating','2026-11-17','Solar panel damaged by wind.'],
 [10,'Sagal Mohamed',2,'Long queue','Low','resolved','2026-10-12','Busy during Friday mornings.'],
 [11,'Ahmed Jama',6,'No water','Medium','pending','2026-11-23','Well was dry this morning; the committee has been informed.'],
 [12,'Khadra Ismail',9,'Contaminated','Low','resolved','2026-10-28','Bucket rope and cover were dirty; cleaned by the committee.']
].map(r=>({id:r[0],user:r[1],sourceId:r[2],type:r[3],severity:r[4],status:r[5],date:r[6],desc:r[7]}));
const MONTHS=['Jun','Jul','Aug','Sep','Oct','Nov'];
