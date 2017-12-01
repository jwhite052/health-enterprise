var hospitalsList = [
  {
  	type: 'hospital',
  	region: 'montgomery',
  	name: 'Abington Hospital',
  	address: '1200 Old York Rd.<br>Abington, PA 19001',
  	phone: 'Phone: 215-481-2000',
  	url: 'http://www.abingtonhealth.org/find-a-location/abington-memorial-hospital/',
  	position: { lat: 40.119136, lng: -75.119953 }
  },
  {
  	type: 'hospital',
  	region: 'montgomery',
  	name: 'Abington &ndash; Lansdale Hospital',
  	address: '100 Medical Campus Dr.<br>Lansdale, PA 19446',
  	phone: 'Phone: 215-368-2100',
  	url: 'http://www.abingtonhealth.org/find-a-location/lansdale-hospital/',
  	position: { lat: 40.25115, lng: -75.271454 }
  },
  {
  	type: 'hospital',
  	region: 'philadelphia',
  	name: 'Thomas Jefferson University Hospital',
  	address: '111 South 11th Street<br>Philadelphia, PA 19107',
  	phone: 'Main Phone: 215-955-6000<br>Appointment Phone: 1-800-JEFF-NOW (215-533-3669)',
  	url: '/content/health/find-a-location/locations/tjuh-111-south-11th-street.html',
  	position: { lat: 39.9498262, lng: -75.1584227 }
  },
  {
  	type: 'hospital',
  	region: 'philadelphia',
  	name: 'Jefferson Hospital for Neuroscience',
  	address: '900 Walnut Street<br>Philadelphia, PA 19107',
  	phone: 'Main Phone: 215-955-6000<br>Appointment Phone: 1-800-JEFF-NOW (800-533-3669)',
  	url: '/content/health/find-a-location/locations/jefferson-hospital-for-neuroscience-900-walnut-street.html',
  	position: { lat: 39.9480344, lng: -75.156207 }
  },
  {
  	type: 'hospital',
  	region: 'philadelphia',
  	name: 'Methodist Hospital',
  	address: '2301 South Broad Street<br>Philadelphia, PA 19148',
  	phone: 'Main Phone: 215-952-9000<br>Appointment Phone: 800-JEFF-NOW (800-533-3669)<br>Radiology Appointments: 215-952-1234<br>Outpatient Rehabilitation Services: 215-339-4280',
  	url: '/content/health/find-a-location/locations/methodist-hospital.html',
  	position: { lat: 39.921183, lng: -75.169701 }
  },
  {
    type: 'hospital',
    region: 'bucks',
    name: 'Jefferson Bucks Hospital',
    address: '380 North Oxford Valley Road<br>Langhorne, PA 19047',
    phone: 'Phone: 215-949-5000',
    url: 'https://www.ariahealth.org/bucks-county',
    position: { lat: 40.1830928, lng: -74.8725508 }
  },
  {
    type: 'hospital',
    name: 'Jefferson Frankford Hospital',
    region: 'philadelphia',
    address: '4900 Frankford Avenue<br>Philadelphia, PA 19124',
    phone: 'Phone: 215-831-2000',
    url: 'https://www.ariahealth.org/frankford',
    position: { lat: 40.0196895, lng: -75.0838933 }
  },
  {
    type: 'hospital',
    name: 'Jefferson Torresdale Hospital',
    region: 'philadelphia',
    address: '10800 Knights Road<br>Philadelphia, PA 19114',
    phone: 'Phone: 215-612-4000',
    url: 'https://www.ariahealth.org/torresdale',
    position: { lat: 40.0716736, lng: -74.9854092 }
  },
  {
  	type: 'hospital',
  	region: 'new jersey',
  	name: 'Jefferson Cherry Hill Hospital',
  	address: '2201 Chapel Avenue West<br>Cherry Hill, NJ 08002',
  	phone: 'Main phone: 856-488-6500',
  	url: '/content/health/find-a-location/locations/kennedy-cherry-hill.html',
  	position: { lat: 39.927982, lng: -75.015943 }
  },
  {
  	type: 'hospital',
  	region: 'new jersey',
  	name: 'Jefferson Stratford Hospital',
  	address: '2201 Chapel Avenue West<br>Cherry Hill, NJ 08002',
  	phone: 'Main phone: 856-488-6500',
  	url: '/content/health/find-a-location/locations/kennedy-stratford.html',
  	position: { lat: 39.828275, lng: -75.008195 }
  },
  {
  	type: 'hospital',
  	region: 'new jersey',
  	name: 'Jefferson Washington Township Hospital',
  	address: '435 Hurffville-Cross Keys Road<br>Turnersville, NJ 08012',
  	phone: 'Main phone: 856-582-2500',
  	url: '/content/health/find-a-location/locations/kennedy-washington-township.html',
  	position: { lat: 39.735239, lng: -75.065340 }
  },
  {
  	type: 'hospital',
  	region: 'bucks',
  	name: 'Rothman Orthopaedic Specialty Hospital &ndash; Bensalem',
  	address: '3300 Tillman Drive<br>Bensalem, PA 19020',
  	phone: 'Phone: 1-800-JEFF-NOW',
  	url: '/content/health/find-a-location/locations/rothman-orthopaedic-specialty-hospital.html',
  	position: { lat: 40.1129362, lng: -74.9627666 }
  }
];

outpatientList = [
  {
    type: 'outpatient',
    region: 'montgomery',
    name: 'Abington Jefferson Health &ndash; Blue Bell',
    address: '721 Arbor Way<br>Blue Bell, PA 19422',
    phone: 'Main Phone: 215-619-6400<br>Appointment Phone: 215-481-EXAM (3926)',
    url: 'http://www.abingtonhealth.org/find-a-location/abington-health-center-blue-bell/',
    position: { lat: 40.140623, lng: -75.285922 }
  },
  {
    type: 'outpatient',
    region: 'montgomery',
    name: 'Abington Jefferson Health &ndash; Lower Gwynedd',
    address: '605 N Bethlehem Pike<br>Lower Gwynedd, PA 19002',
    url: 'http://www.abingtonhealth.org/find-a-location/abington-health-center-lower-gwynedd/',
    position: { lat: 40.17472, lng: -75.22517 }
  },
  {
    type: 'outpatient',
    region: 'montgomery',
    name: 'Abington Jefferson Health &ndash; Montgomeryville',
    address: '1010 Horsham Road<br>North Wales, PA 19454<br>(corner of Horsham and Upper State Roads)',
    phone: 'Phone: 215-517-1000',
    url: 'http://www.abingtonhealth.org/find-a-location/abington-health-center-montgomeryville/',
    position: { lat: 40.2391667, lng: -75.2315047 }
  },
  {
    type: 'outpatient',
    region: 'bucks',
    name: 'Abington Jefferson Health &ndash; Warminster',
    address: '225 Newtown Road<br>Warminster, PA 18974',
    phone: 'Phone: 215-441-6600',
    url: 'http://www.abingtonhealth.org/find-a-location/ahc-warminster/',
    position: { lat: 40.185092, lng: -75.078765 }
  },
  {
    type: 'outpatient',
    region: 'montgomery',
    name: 'Abington Jefferson Health &ndash; Willow Grove',
    address: '2500 Maryland Rd<br>Willow Grove, PA 19090',
    url: 'http://www.abingtonhealth.org/find-a-location/ahc-schilling/',
    position: { lat: 40.164239, lng: -75.1310205 }
  },
  {
    type: 'outpatient',
    region: 'montgomery',
    name: 'Jefferson &ndash; Bala Cynwyd (225 East City Ave)',
    address: '225 East City Avenue<br>Bala Cynwyd, PA 19004',
    phone: 'Appointment Phone:  800-JEFF-NOW (800-533-3669)',
    url: '/content/health/find-a-location/locations/jefferson-at-bala-cynwyd-225-east-city-avenue.html',
    position: { lat: 40.0050928, lng: -75.2192039 }
  },
  {
    type: 'outpatient',
    region: 'montgomery',
    name: 'Jefferson &ndash; Bala Cynwyd (401 City Line Ave)',
    address: '401 City Line Avenue<br>Bala Cynwyd, PA 19004',
    phone: 'Main Phone:  610-667-5555 (Cardiology)<br>Alternate Phone: 215-955-1925 (Endocrinology)<br>Appointment Phone: 800-JEFF-NOW (800-533-3669)',
    url: '/content/health/find-a-location/locations/jefferson-at-bala-cynwyd-401-city-line-avenue.html',
    position: { lat: 39.9998876, lng: -75.2303063 }
  },
  {
    type: 'outpatient',
    region: 'philadelphia',
    name: 'Jefferson Health &ndash; Smylie Times',
    address: '2607 Rhawn Street<br>Suite 403<br>Philadelphia, PA 19152',
    phone: 'Appointment Phone: 800-JEFF-NOW (800-533-3669)',
    url: '/content/health/find-a-location/locations/jefferson-at-the-smylie-times.html',
    position: { lat: 40.0562602, lng: -75.0452195 }
  },
  {
    type: 'outpatient',
    region: 'philadelphia',
    name: 'Jefferson Health &ndash; Navy Yard',
    address: '3 Crescent Drive<br>Philadelphia, PA 19112',
    phone: 'Main Phone: 215-503-3300<br>Appointment Phone: 800-JEFF-NOW (800-533-3669)',
    url: '/content/health/find-a-location/locations/jefferson-health-navy-yard.html',
    position: { lat: 39.8959772, lng: -75.1740603 }
  },
  {
    type: 'outpatient',
    region: 'new jersey',
    name: 'Jefferson Health &ndash; Turnersville',
    address: '188 Fries Mill Road<br>Turnersville, NJ 08012',
    phone: 'Appointment Phone: 800-JEFF-NOW (800-533-3669)',
    url: '/content/health/find-a-location/locations/jefferson-at-turnersville.html',
    position: { lat: 39.7370413, lng: -75.0468679 }
  },
  {
    type: 'outpatient',
    region: 'new jersey',
    name: 'Jefferson Health &ndash; Voorhees',
    address: '443 Laurel Oak Road<br>Voorhees, NJ 08043',
    phone: 'Main Phone: 856-741-1000<br>Appointment Phone: 800-JEFF-NOW (800-533-3669)',
    url: '/content/health/find-a-location/locations/jefferson-health-voorhees.html',
    position: { lat: 39.844291, lng: -74.985362 }
  },
  {
    type: 'outpatient',
    region: 'philadelphia',
    name: 'The Annex',
    address: '2451 Grant Avenue<br>Philadelphia, PA 19114',
    phone: 'Phone: 215-333-0304',
    url: 'https://www.ariahealth.org/about-aria/campus-locations-and-outpatient-sites/outpatient-sites',
    position: { lat: 40.080427, lng: -75.02851 }
  },
  {
    type: 'outpatient',
    region: 'philadelphia',
    name: 'The Professional Court',
    address: 'Bustleton Avenue and Verree Road<br>Philadelphia, PA 19116',
    phone: 'Phone: 215-827-8200',
    url: 'https://www.ariahealth.org/about-aria/campus-locations-and-outpatient-sites/outpatient-sites',
    position: { lat: 40.1098113, lng: -75.0309162 }
  },
  {
  	type: 'outpatient',
  	region: 'bucks',
  	name: 'Aria Health &ndash; Center for Rehabilitation and Wellness',
  	address: '131 Lincoln Highway<br>Fairless Hills, PA 19030',
  	phone: 'Phone: 215-269-6620',
  	hours: 'Hours: Monday through Thursday, 7 a.m. to 6:30 p.m.<br>Fridays, 7 a.m to 3:30 p.m.<br>(EMG Testing &ndash; Wednesday Afternoons)',
  	url: 'https://www.ariahealth.org/about-aria/campus-locations-and-outpatient-sites/outpatient-sites',
  	position: { lat: 40.1834393, lng: -74.8680713 }
  },
  {
  	type: 'outpatient',
  	region: 'montgomery',
  	name: 'Abington Jefferson Health &ndash; Elkins Park',
  	address: '8250 Old York Road<br>Elkins Park, PA 19027',
  	phone: 'Elkins Park Medical Association: 215-885-8550',
  	phone: 'Wyncote Family Medicine: 215-886-0440<br>Laboratory Testing: 215-886-5738',
  	url: '/content/health/find-a-location/locations/abington-health-center-elkins-park.html',
  	position: { lat: 40.082393, lng: -75.1279097 }
  },
  {
  	type: 'outpatient',
  	region: 'philadelphia',
  	name: 'Jefferson Health &ndash; Art Museum',
  	address: '2130 Spring Garden Street<br>Philadelphia, PA 19130',
  	phone: 'Main phone: 215-955-9555',
  	url: '/content/health/find-a-location/locations/jefferson-health-art-museum.html',
  	position: { lat: 39.963721, lng: -75.173739 }
  },
  {
  	type: 'outpatient',
  	region: 'new jersey',
  	name: 'Jefferson Health &ndash; Burlington',
  	address: '811 Sunset Road, Suite 104<br>Burlington, NJ 08016',
  	phone: 'Phone: 609-239-8690',
  	url: '/content/health/find-a-location/locations/jefferson-health-burlington.html',
  	position: { lat: 40.0492141, lng: -74.8707033 }
  }
];

urgentcareList = [
  {
    type: 'urgent',
    region: 'bucks',
    name: 'Jefferson Urgent Care &ndash; Flourtown',
    address: 'Flourtown Shopping Center<br>1820 Bethlehem Pike<br>Flourtown, PA 19031',
    phone: 'Phone: 215-836-1354',
    hours: 'Hours: 8 a.m. &ndash; 8 p.m. Monday to Friday<br>9 a.m. &ndash; 5 p.m. Saturday and Sunday',
    url: '/content/health/find-a-location/locations/jefferson-urgent-care-flourtown.html',
    position: { lat: 40.111191, lng: -75.210331 }
  },
  {
    type: 'urgent',
    region: 'philadelphia',
    name: 'Jefferson Urgent Care &ndash; Rittenhouse',
    address: '2021 Chestnut Street<br>Philadelphia, PA 19103',
    phone: 'Phone:  267-443-2020',
    hours: 'Hours: 8:30 a.m. &ndash; 8:30 p.m., 7 days a week',
    url: '/content/health/find-a-location/locations/2021-chestnut-street.html',
    position: { lat: 39.9521761, lng: -75.1765097 }
  },
  {
    type: 'urgent',
    region: 'philadelphia',
    name: 'Jefferson Urgent Care &ndash; Smylie Times',
    address: '2607 Rhawn Street<br>Philadelphia, PA 19152',
    phone: 'Phone: 215-333-0304',
    hours: 'Hours: 8:30 a.m. &ndash; 8:30 p.m., 7 days a week',
    url: '/content/health/find-a-location/locations/jefferson-health-smylie-times.html',
    position: { lat: 40.0562602, lng: -75.0452195 }
  },
  {
    type: 'urgent',
    region: 'philadelphia',
    name: 'Jefferson Urgent Care &ndash; Washington Square',
    address: '700 Walnut Street<br>Philadelphia, PA 19106',
    phone: 'Phone: 215-333-0304',
    hours: 'Hours: 8:30 a.m. &ndash; 8:30 p.m., 7 days a week',
    url: '/content/health/find-a-location/locations/jefferson-at-washington-square.html',
    position: { lat: 39.9479655, lng: -75.1532154 }
  },
  {
  	type: 'urgent',
  	region: 'bucks',
  	name: 'Jefferson Urgent Care &ndash; Bensalem',
  	address: '2966 Street Road<br>Bensalem, PA',
  	phone: 'Phone: 215-638-0666',
  	hours: 'Hours: 7 days a week, from 8 a.m. to 8 p.m.',
  	url: '/content/health/find-a-location/locations/jefferson-urgent-care-bensalem.html',
  	position: { lat: 40.1132751, lng: -74.9587764 }
  },
  {
  	type: 'urgent',
  	region: 'philadelphia',
  	name: 'Jefferson Urgent Care &ndash; Grant Avenue',
  	address: '2451 Grant Avenue<br>Philadelphia, PA',
  	phone: 'Phone: 215-934-3471',
  	hours: 'Hours: 7 days a week, from 8 a.m. to 8 p.m.',
  	url: '/content/health/find-a-location/locations/jefferson-urgent-care-grant-avenue.html',
  	position: { lat: 40.080427, lng: -75.02851 }
  },
  {
  	type: 'urgent',
  	region: 'montgomery',
  	name: 'Jefferson Urgent Care &ndash; Willow Grove',
  	address: '2603 Easton Road<br>Willow Grove, PA 19090',
  	phone: 'Phone: 267-537-3300',
  	url: '/content/health/find-a-location/locations/jefferson-urgent-care-willow-grove.html',
  	position: { lat: 40.1688489, lng: -75.1262753 }
  }
];
