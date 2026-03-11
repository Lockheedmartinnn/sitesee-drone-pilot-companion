export const C = {
  bg: '#050a0f', panel: '#0b1520', panel2: '#0f1e2d',
  border: '#1a3a5c', accent: '#00c8ff', green: '#00ff88',
  yellow: '#ffcc00', orange: '#ff6b00', red: '#ff2244',
  text: '#c8e0f0', dim: '#5a8aaa',
};

export const SITES = [
  // === SYDNEY CBD / INNER ===
  { id:"DM0001-001", name:"Centurion Plaza", suburb:"Metro Central", state:"NSW", lat:-33.8775, lng:151.2062, diff:"orange", jobs:["CREATED"], factors:{gps:"HIGH URBAN CANYON",airspace:"CLASS C",obstacles:"VERY HIGH-RISE",wind:"CHANNELING",restricted:"YES - DRONE ZONE"} },
  { id:"DM0001-002", name:"Zenith Towers B", suburb:"Metro Central", state:"NSW", lat:-33.8780, lng:151.2058, diff:"orange", jobs:["COMPLETE"], factors:{gps:"HIGH URBAN CANYON",airspace:"CLASS C",obstacles:"VERY HIGH-RISE",wind:"CHANNELING",restricted:"YES - DRONE ZONE"} },
  { id:"DM0001-003", name:"Meridian House", suburb:"East Metro", state:"NSW", lat:-33.8756, lng:151.2189, diff:"orange", jobs:["COMPLETE"], factors:{gps:"URBAN CANYON",airspace:"CLASS C",obstacles:"HIGH-RISE",wind:"MODERATE",restricted:"YES"} },
  { id:"DM0001-004", name:"Apex Centre", suburb:"Southgate Metro", state:"NSW", lat:-33.8814, lng:151.2040, diff:"orange", jobs:["CREATED"], factors:{gps:"HIGH INTERFERENCE",airspace:"CLASS C",obstacles:"HIGH-RISE",wind:"CHANNELING",restricted:"YES"} },
  { id:"DM0001-005", name:"Horizon Tower A", suburb:"Metro Central", state:"NSW", lat:-33.8737, lng:151.2121, diff:"orange", jobs:["CREATED"], factors:{gps:"HIGH INTERFERENCE",airspace:"CLASS C",obstacles:"HIGH-RISE",wind:"MODERATE",restricted:"YES"} },
  { id:"DM0001-006", name:"Summit Plaza", suburb:"Metro Central", state:"NSW", lat:-33.8721, lng:151.2001, diff:"orange", jobs:["CREATED"], factors:{gps:"URBAN CANYON",airspace:"CLASS C",obstacles:"HIGH-RISE",wind:"CHANNELING",restricted:"YES"} },
  { id:"DM0001-007", name:"Harbourview Rise", suburb:"Waterfront Metro", state:"NSW", lat:-33.8604, lng:151.2028, diff:"orange", jobs:["CREATED"], factors:{gps:"HARBOUR MULTIPATH",airspace:"CLASS C",obstacles:"HIGH-RISE + CRANES",wind:"HARBOUR WIND",restricted:"YES"} },
  { id:"DM0001-008", name:"Pinnacle One", suburb:"Metro Central", state:"NSW", lat:-33.8699, lng:151.2100, diff:"orange", jobs:["CREATED"], factors:{gps:"HIGH INTERFERENCE",airspace:"CLASS C",obstacles:"SKYSCRAPERS",wind:"CHANNELING",restricted:"YES"} },
  { id:"DM0001-009", name:"Pinnacle Two", suburb:"Metro Central", state:"NSW", lat:-33.8700, lng:151.2098, diff:"orange", jobs:["CREATED"], factors:{gps:"HIGH INTERFERENCE",airspace:"CLASS C",obstacles:"SKYSCRAPERS",wind:"CHANNELING",restricted:"YES"} },
  { id:"DM0001-010", name:"Heritage Quay", suburb:"Old Quarter", state:"NSW", lat:-33.8594, lng:151.2082, diff:"orange", jobs:["COMPLETE"], factors:{gps:"HARBOUR MULTIPATH",airspace:"CLASS C",obstacles:"HERITAGE + CRANES",wind:"HARBOUR WIND",restricted:"YES"} },
  { id:"DM0001-011", name:"Civic Core Tower", suburb:"Metro Central", state:"NSW", lat:-33.8732, lng:151.2063, diff:"orange", jobs:["CREATED"], factors:{gps:"URBAN CANYON",airspace:"CLASS C",obstacles:"HIGH-RISE",wind:"CHANNELING",restricted:"YES"} },
  { id:"DM0001-012", name:"Gateway Station Block", suburb:"Metro Central", state:"NSW", lat:-33.8666, lng:151.2068, diff:"orange", jobs:["COMPLETE"], factors:{gps:"HIGH INTERFERENCE",airspace:"CLASS C",obstacles:"HIGH-RISE + RAIL",wind:"CHANNELING",restricted:"YES"} },
  { id:"DM0001-013", name:"Parkside Arena", suburb:"Inner Harbour", state:"NSW", lat:-33.8789, lng:151.1998, diff:"orange", jobs:["CREATED"], factors:{gps:"MULTIPATH",airspace:"CLASS C",obstacles:"HIGH-RISE + EVENT VENUE",wind:"HARBOUR WIND",restricted:"YES"} },
  { id:"DM0001-014", name:"Waterfront Quarter", suburb:"Inner Harbour", state:"NSW", lat:-33.8699, lng:151.1995, diff:"orange", jobs:["CREATED"], factors:{gps:"MULTIPATH",airspace:"CLASS C",obstacles:"HIGH-RISE",wind:"HARBOUR WIND",restricted:"YES"} },
  // === SYDNEY INNER SUBURBS ===
  { id:"DM0002-001", name:"Campus North Hub", suburb:"Southgate Inner", state:"NSW", lat:-33.8888, lng:151.1934, diff:"orange", jobs:["CREATED"], factors:{gps:"URBAN",airspace:"CLASS C",obstacles:"CAMPUS BUILDINGS",wind:"MODERATE",restricted:"YES"} },
  { id:"DM0002-002", name:"Techpark West", suburb:"Westside Inner", state:"NSW", lat:-33.8825, lng:151.1975, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"MODERATE INTERFERENCE",airspace:"CLASS C",obstacles:"MEDIUM-RISE",wind:"MODERATE",restricted:"YES"} },
  { id:"DM0002-003", name:"Broadview Estate B", suburb:"Northgate Inner", state:"NSW", lat:-33.8847, lng:151.1961, diff:"yellow", jobs:["COMPLETE","FAILED"], factors:{gps:"URBAN",airspace:"CLASS C",obstacles:"MEDIUM-RISE",wind:"MODERATE",restricted:"YES"} },
  { id:"DM0002-004", name:"Rosewood Precinct", suburb:"Southgate Inner", state:"NSW", lat:-33.8892, lng:151.1975, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"MODERATE",airspace:"CLASS C",obstacles:"MEDIUM",wind:"MODERATE",restricted:"YES"} },
  { id:"DM0002-005", name:"Bridgeview Complex", suburb:"West Harbour Inner", state:"NSW", lat:-33.8725, lng:151.1930, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"HARBOUR MULTIPATH",airspace:"CLASS C",obstacles:"MEDIUM-RISE + BRIDGE",wind:"HARBOUR WIND",restricted:"YES"} },
  { id:"DM0002-006", name:"Bridgeview Annex", suburb:"West Harbour Inner", state:"NSW", lat:-33.8730, lng:151.1935, diff:"yellow", jobs:["CREATED"], factors:{gps:"HARBOUR MULTIPATH",airspace:"CLASS C",obstacles:"MEDIUM-RISE",wind:"HARBOUR WIND",restricted:"YES"} },
  { id:"DM0002-007", name:"Transit Hub South", suburb:"Southgate Inner", state:"NSW", lat:-33.8834, lng:151.2067, diff:"orange", jobs:["COMPLETE"], factors:{gps:"HIGH INTERFERENCE",airspace:"CLASS C",obstacles:"RAIL + HIGH-RISE",wind:"CHANNELING",restricted:"YES"} },
  { id:"DM0002-008", name:"Neon Quarter", suburb:"East Inner", state:"NSW", lat:-33.8737, lng:151.2226, diff:"orange", jobs:["COMPLETE"], factors:{gps:"HIGH INTERFERENCE",airspace:"CLASS C",obstacles:"HIGH-RISE + NEON",wind:"MODERATE",restricted:"YES"} },
  { id:"DM0002-009", name:"Rail Corridor Site", suburb:"Central Inner", state:"NSW", lat:-33.8924, lng:151.2038, diff:"orange", jobs:["FAILED"], factors:{gps:"HIGH INTERFERENCE",airspace:"CLASS C",obstacles:"RAIL INFRASTRUCTURE",wind:"MODERATE",restricted:"YES - RAIL"} },
  { id:"DM0002-010", name:"New Quarter North", suburb:"East Inner", state:"NSW", lat:-33.9003, lng:151.2090, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"MODERATE",airspace:"CLASS C",obstacles:"NEW DEVELOPMENT",wind:"MODERATE",restricted:"YES"} },
  { id:"DM0002-011", name:"Lakeside Flats", suburb:"Eastside Inner", state:"NSW", lat:-33.9175, lng:151.2069, diff:"green", jobs:["CREATED"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  { id:"DM0002-012", name:"Runway Approach Block", suburb:"South Airside", state:"NSW", lat:-33.9227, lng:151.1928, diff:"orange", jobs:["COMPLETE"], factors:{gps:"HIGH INTERFERENCE - AIRPORT",airspace:"CLASS C",obstacles:"AIRPORT PROXIMITY",wind:"JET WASH RISK",restricted:"YES - AIRPORT 3KM"} },
  // === SYDNEY EASTERN SUBURBS ===
  { id:"DM0003-001", name:"Junction Retail Complex", suburb:"East Junction", state:"NSW", lat:-33.8934, lng:151.2490, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"SHOPPING CENTRE + MED RISE",wind:"MODERATE",restricted:"NO"} },
  { id:"DM0003-002", name:"Coastal Terrace A", suburb:"Coastal East", state:"NSW", lat:-33.9041, lng:151.2660, diff:"green", jobs:["CREATED"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE COASTAL",wind:"SEA BREEZE - PREDICTABLE",restricted:"NO"} },
  { id:"DM0003-003", name:"Seacliff Residences", suburb:"North Coast", state:"NSW", lat:-33.8891, lng:151.2778, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE COASTAL",wind:"SEA BREEZE",restricted:"NO"} },
  { id:"DM0003-004", name:"Marina Views", suburb:"Harbour East", state:"NSW", lat:-33.8773, lng:151.2474, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"HARBOUR PROXIMITY + MASTS",wind:"HARBOUR WIND",restricted:"NO"} },
  { id:"DM0003-005", name:"Clifftop Estate", suburb:"Heights East", state:"NSW", lat:-33.8716, lng:151.2827, diff:"green", jobs:["CREATED"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"SEA BREEZE",restricted:"NO"} },
  { id:"DM0003-006", name:"Bayside Villas", suburb:"South Coast", state:"NSW", lat:-33.9155, lng:151.2637, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"SEA BREEZE",restricted:"NO"} },
  { id:"DM0003-007", name:"Grandstand View", suburb:"Parklands East", state:"NSW", lat:-33.9037, lng:151.2256, diff:"yellow", jobs:["COMPLETE","FAILED"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"GRANDSTANDS + TREES",wind:"MODERATE",restricted:"EVENT DAYS"} },
  { id:"DM0003-008", name:"Oceanview North", suburb:"Coastal South", state:"NSW", lat:-33.9210, lng:151.2573, diff:"green", jobs:["CREATED"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE COASTAL",wind:"SEA BREEZE",restricted:"NO"} },
  { id:"DM0003-009", name:"Sandpiper Junction", suburb:"South Coast", state:"NSW", lat:-33.9380, lng:151.2315, diff:"green", jobs:["CREATED"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  { id:"DM0003-010", name:"Ridgeline Estate", suburb:"South East", state:"NSW", lat:-33.9497, lng:151.2240, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  // === SYDNEY INNER WEST ===
  { id:"DM0004-001", name:"Warehouse Quarter", suburb:"Inner West A", state:"NSW", lat:-33.8882, lng:151.1983, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"URBAN",airspace:"CLASS C",obstacles:"MEDIUM-RISE",wind:"MODERATE",restricted:"YES"} },
  { id:"DM0004-002", name:"Greendale Row", suburb:"Inner West B", state:"NSW", lat:-33.8830, lng:151.1706, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW-MODERATE",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  { id:"DM0004-003", name:"Artisan Precinct", suburb:"Inner West C", state:"NSW", lat:-33.8975, lng:151.1800, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"MEDIUM DENSITY",wind:"MODERATE",restricted:"NO"} },
  { id:"DM0004-004", name:"Millstone Lane", suburb:"Inner West D", state:"NSW", lat:-33.9003, lng:151.1581, diff:"green", jobs:["CREATED"], factors:{gps:"LOW-MODERATE",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  // === SYDNEY NORTH SHORE ===
  { id:"DM0005-001", name:"Ridgeway Station", suburb:"North Shore A", state:"NSW", lat:-33.8360, lng:151.2093, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"HARBOUR MULTIPATH",airspace:"CLASS D",obstacles:"MEDIUM-RISE + RAIL",wind:"HARBOUR WIND",restricted:"NO"} },
  { id:"DM0005-002", name:"Broadcast Hill", suburb:"North Shore B", state:"NSW", lat:-33.8279, lng:151.1897, diff:"yellow", jobs:["CREATED"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"BROADCAST TOWERS",wind:"MODERATE",restricted:"YES - EMI FROM TOWERS"} },
  { id:"DM0005-003", name:"Uptown Commercial", suburb:"North Shore C", state:"NSW", lat:-33.7979, lng:151.1823, diff:"yellow", jobs:["CREATED"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"HIGH-RISE COMMERCIAL",wind:"MODERATE",restricted:"NO"} },
  { id:"DM0005-004", name:"Fernwood Heights", suburb:"North Shore D", state:"NSW", lat:-33.8068, lng:151.1823, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE + TREES",wind:"LIGHT",restricted:"NO"} },
  { id:"DM0005-005", name:"Village Shops A", suburb:"North Shore E", state:"NSW", lat:-33.7766, lng:151.1676, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE SHOPS",wind:"LIGHT",restricted:"NO"} },
  { id:"DM0005-006", name:"Village Shops B", suburb:"North Shore F", state:"NSW", lat:-33.7026, lng:151.1005, diff:"green", jobs:["CREATED"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE SHOPS",wind:"LIGHT",restricted:"NO"} },
  { id:"DM0005-007", name:"Bushland Fringe", suburb:"North Shore G", state:"NSW", lat:-33.7392, lng:151.2201, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE + BUSH",wind:"LIGHT",restricted:"NO"} },
  { id:"DM0005-008", name:"Harbourside Terrace", suburb:"North Shore H", state:"NSW", lat:-33.8301, lng:151.2218, diff:"yellow", jobs:["CREATED"], factors:{gps:"HARBOUR PROXIMITY",airspace:"CLASS D",obstacles:"MEDIUM DENSITY",wind:"HARBOUR WIND",restricted:"NO"} },
  { id:"DM0005-009", name:"Peninsular Rise", suburb:"North Shore I", state:"NSW", lat:-33.8291, lng:151.2471, diff:"yellow", jobs:["CREATED"], factors:{gps:"HARBOUR PROXIMITY",airspace:"CLASS D",obstacles:"MEDIUM DENSITY",wind:"HARBOUR WIND",restricted:"NO"} },
  { id:"DM0005-010", name:"Cliffside Lookout", suburb:"North Shore J", state:"NSW", lat:-33.7964, lng:151.2571, diff:"green", jobs:["CREATED"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"SEA BREEZE",restricted:"NO"} },
  { id:"DM0005-011", name:"Ferry Terminal Shops", suburb:"North Shore K", state:"NSW", lat:-33.7960, lng:151.2873, diff:"yellow", jobs:["CREATED"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"FERRY TERMINAL + SHOPS",wind:"SEA BREEZE STRONG",restricted:"NO"} },
  { id:"DM0005-012", name:"Dune Ridge", suburb:"North Shore L", state:"NSW", lat:-33.7529, lng:151.2779, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"SEA BREEZE",restricted:"NO"} },
  { id:"DM0005-013", name:"Coastline South", suburb:"North Shore M", state:"NSW", lat:-33.7528, lng:151.2870, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"SEA BREEZE",restricted:"NO"} },
  { id:"DM0005-014", name:"Cove Residences", suburb:"North Shore N", state:"NSW", lat:-33.6781, lng:151.3009, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE COASTAL",wind:"SEA BREEZE",restricted:"NO"} },
  { id:"DM0005-015", name:"Headland Estate", suburb:"North Shore O", state:"NSW", lat:-33.6584, lng:151.3236, diff:"green", jobs:["COMPLETE","CREATED"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE COASTAL",wind:"SEA BREEZE",restricted:"NO"} },
  { id:"DM0005-016", name:"Sandhaven Rise", suburb:"North Shore P", state:"NSW", lat:-33.6304, lng:151.3411, diff:"green", jobs:["FAILED"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"SEA BREEZE",restricted:"NO"} },
  // === WESTERN SYDNEY ===
  { id:"DM0006-001", name:"Westfield Hub", suburb:"West Metro A", state:"NSW", lat:-33.8164, lng:151.1002, diff:"green", jobs:["CREATED"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"SHOPPING CENTRE + LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  { id:"DM0006-002", name:"Southvale Estate", suburb:"West Metro B", state:"NSW", lat:-33.7818, lng:151.0534, diff:"green", jobs:["COMPLETE","FAILED"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  { id:"DM0006-003", name:"Harborpoint Residences", suburb:"West Metro C", state:"NSW", lat:-33.8108, lng:151.0608, diff:"yellow", jobs:["COMPLETE","CREATED"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"HIGH DENSITY RESIDENTIAL",wind:"HARBOUR WIND",restricted:"NO"} },
  { id:"DM0006-004", name:"Clearview Estate", suburb:"West Metro D", state:"NSW", lat:-33.8895, lng:151.1294, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  { id:"DM0006-005", name:"Sports Precinct Complex", suburb:"West Metro E", state:"NSW", lat:-33.8468, lng:151.0693, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"STADIUM + EVENT COMPLEX",wind:"MODERATE",restricted:"EVENT DAYS"} },
  { id:"DM0006-006", name:"Mediplex Tower", suburb:"West Metro F", state:"NSW", lat:-33.8081, lng:150.9870, diff:"orange", jobs:["CREATED"], factors:{gps:"HIGH INTERFERENCE - HOSPITAL",airspace:"CLASS D",obstacles:"HOSPITAL COMPLEX + HELIPAD",wind:"MODERATE",restricted:"YES - HELIPAD 1KM"} },
  { id:"DM0006-007", name:"Commerce Centre West", suburb:"West Metro G", state:"NSW", lat:-33.7689, lng:150.9056, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"MEDIUM COMMERCIAL",wind:"LIGHT",restricted:"NO"} },
  { id:"DM0006-008", name:"Urban Core West", suburb:"West Metro H", state:"NSW", lat:-33.8152, lng:151.0017, diff:"yellow", jobs:["COMPLETE","FAILED"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"HIGH-RISE CBD",wind:"MODERATE",restricted:"NO"} },
  { id:"DM0006-009", name:"Techpark North", suburb:"West Metro I", state:"NSW", lat:-33.7295, lng:150.9720, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"BUSINESS PARK",wind:"LIGHT",restricted:"NO"} },
  { id:"DM0006-010", name:"Greenfields Estate", suburb:"West Metro J", state:"NSW", lat:-33.7098, lng:151.0008, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  // === SYDNEY SOUTH/SOUTHWEST ===
  { id:"DM0007-001", name:"Southbrook Row", suburb:"South Metro A", state:"NSW", lat:-33.8761, lng:150.9542, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  { id:"DM0007-002", name:"Market Lane South", suburb:"South Metro B", state:"NSW", lat:-33.8968, lng:150.9440, diff:"green", jobs:["COMPLETE","FAILED"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE SHOPS",wind:"LIGHT",restricted:"NO"} },
  { id:"DM0007-003", name:"Greenfield Park", suburb:"South Metro C", state:"NSW", lat:-33.9874, lng:150.7697, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS G",obstacles:"LOW-RISE NEW DEV",wind:"LIGHT",restricted:"NO"} },
  { id:"DM0007-004", name:"Riverside South", suburb:"South Metro D", state:"NSW", lat:-33.9155, lng:151.0907, diff:"green", jobs:["CREATED"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  { id:"DM0007-005", name:"Valley View", suburb:"South Metro E", state:"NSW", lat:-33.9086, lng:151.1177, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  { id:"DM0007-006", name:"Approach Corridor", suburb:"South Metro F", state:"NSW", lat:-33.9285, lng:151.1555, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"MODERATE - AIRPORT",airspace:"CLASS C",obstacles:"MEDIUM-RISE",wind:"JET WASH",restricted:"YES - AIRPORT APPROACH"} },
  { id:"DM0007-007", name:"Hillcrest South", suburb:"South Metro G", state:"NSW", lat:-33.9686, lng:151.0079, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  { id:"DM0007-008", name:"Seaside Flats", suburb:"South Metro H", state:"NSW", lat:-33.9574, lng:151.1614, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE COASTAL",wind:"SEA BREEZE",restricted:"NO"} },
  { id:"DM0007-009", name:"Inlet Views", suburb:"South Metro I", state:"NSW", lat:-33.9927, lng:151.1325, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE COASTAL",wind:"SEA BREEZE",restricted:"NO"} },
  { id:"DM0007-010", name:"Waterside Manor", suburb:"South Metro J", state:"NSW", lat:-34.0199, lng:151.1118, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE WATERFRONT",wind:"SEA BREEZE",restricted:"NO"} },
  { id:"DM0007-011", name:"Tidewater Shops", suburb:"South Metro K", state:"NSW", lat:-34.0380, lng:151.1240, diff:"green", jobs:["COMPLETE","CREATED"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE SHOPS",wind:"LIGHT",restricted:"NO"} },
  { id:"DM0007-012", name:"Peninsula Point", suburb:"South Metro L", state:"NSW", lat:-34.0566, lng:151.1512, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE COASTAL",wind:"SEA BREEZE",restricted:"NO"} },
  // === BRISBANE CBD ===
  { id:"DM0008-001", name:"Commerce House Alpha", suburb:"River City CBD", state:"QLD", lat:-27.4683, lng:153.0235, diff:"orange", jobs:["COMPLETE"], factors:{gps:"HIGH URBAN CANYON",airspace:"CLASS C",obstacles:"SKYSCRAPERS",wind:"CHANNELING",restricted:"YES - RESTRICTED AIRSPACE"} },
  { id:"DM0008-002", name:"Crossroads Tower", suburb:"River City CBD", state:"QLD", lat:-27.4675, lng:153.0269, diff:"orange", jobs:["COMPLETE","CREATED"], factors:{gps:"HIGH URBAN CANYON",airspace:"CLASS C",obstacles:"SKYSCRAPERS",wind:"CHANNELING",restricted:"YES"} },
  { id:"DM0008-003", name:"Central Spire", suburb:"River City CBD", state:"QLD", lat:-27.4700, lng:153.0260, diff:"orange", jobs:["COMPLETE","CREATED"], factors:{gps:"HIGH URBAN CANYON",airspace:"CLASS C",obstacles:"SKYSCRAPERS",wind:"CHANNELING",restricted:"YES"} },
  { id:"DM0008-004", name:"Merchant Quarter", suburb:"River City CBD", state:"QLD", lat:-27.4671, lng:153.0261, diff:"orange", jobs:["STARTED"], factors:{gps:"HIGH URBAN CANYON",airspace:"CLASS C",obstacles:"SKYSCRAPERS",wind:"CHANNELING",restricted:"YES"} },
  { id:"DM0008-005", name:"Riverwalk High-Rise", suburb:"River City CBD", state:"QLD", lat:-27.4680, lng:153.0287, diff:"orange", jobs:["FAILED"], factors:{gps:"HIGH INTERFERENCE",airspace:"CLASS C",obstacles:"HIGH-RISE + WATERFRONT",wind:"RIVER WIND",restricted:"YES"} },
  // === BRISBANE INNER ===
  { id:"DM0009-001", name:"Stadium Precinct", suburb:"River City Inner A", state:"QLD", lat:-27.4405, lng:153.0387, diff:"yellow", jobs:["COMPLETE","FAILED"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"STADIUM + RAIL",wind:"MODERATE",restricted:"EVENT DAYS"} },
  { id:"DM0009-002", name:"Markets Quarter", suburb:"River City Inner B", state:"QLD", lat:-27.4575, lng:153.0354, diff:"yellow", jobs:["COMPLETE","FAILED"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"MEDIUM-RISE PRECINCT",wind:"MODERATE",restricted:"NO"} },
  { id:"DM0009-003", name:"Chapel Road Site", suburb:"River City Inner C", state:"QLD", lat:-27.3964, lng:153.0453, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE + CHURCH",wind:"LIGHT",restricted:"NO"} },
  { id:"DM0009-004", name:"Coastal North Block", suburb:"River City North", state:"QLD", lat:-27.2930, lng:153.0466, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE COASTAL",wind:"SEA BREEZE",restricted:"NO"} },
  { id:"DM0009-005", name:"Retail & Health Hub", suburb:"River City Inner D", state:"QLD", lat:-27.3859, lng:153.0316, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"MODERATE",airspace:"CLASS C",obstacles:"SHOPPING CENTRE + HOSPITAL",wind:"MODERATE",restricted:"YES - HOSPITAL PROXIMITY"} },
  { id:"DM0009-006", name:"Hillside Terraces", suburb:"River City Inner E", state:"QLD", lat:-27.4386, lng:152.9878, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE HILLY",wind:"LIGHT - HILLY TERRAIN",restricted:"NO"} },
  { id:"DM0009-007", name:"Riverside Medium Rise", suburb:"River City Inner F", state:"QLD", lat:-27.4730, lng:152.9934, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"MEDIUM-RISE",wind:"MODERATE",restricted:"NO"} },
  { id:"DM0009-008", name:"University Quarter", suburb:"River City Inner G", state:"QLD", lat:-27.4844, lng:152.9808, diff:"yellow", jobs:["COMPLETE","FAILED"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"MEDIUM-RISE + UNI",wind:"MODERATE",restricted:"NO"} },
  { id:"DM0009-009", name:"Ridgecrest Complex", suburb:"River City Inner H", state:"QLD", lat:-27.4975, lng:153.0150, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"MEDIUM-RISE HILLY",wind:"HILLY TERRAIN",restricted:"NO"} },
  { id:"DM0009-010", name:"Cultural Mile", suburb:"River City South A", state:"QLD", lat:-27.4876, lng:153.0176, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"TAFE + CULTURAL PRECINCT",wind:"MODERATE",restricted:"EVENT DAYS"} },
  { id:"DM0009-011", name:"Oval District", suburb:"River City South B", state:"QLD", lat:-27.4933, lng:153.0350, diff:"yellow", jobs:["STARTED"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"STADIUM + MEDIUM",wind:"MODERATE",restricted:"EVENT DAYS - STADIUM"} },
  { id:"DM0009-012", name:"Lowlands South", suburb:"River City South C", state:"QLD", lat:-27.5230, lng:153.0161, diff:"green", jobs:["COMPLETE","CREATED"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  { id:"DM0009-013", name:"Mediplex South", suburb:"River City South D", state:"QLD", lat:-27.5624, lng:153.0231, diff:"yellow", jobs:["COMPLETE","CREATED"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"HOSPITAL COMPLEX",wind:"MODERATE",restricted:"YES - HELIPAD"} },
  { id:"DM0009-014", name:"Metro Health Tower", suburb:"River City South E", state:"QLD", lat:-27.5117, lng:153.0424, diff:"orange", jobs:["CREATED"], factors:{gps:"HIGH INTERFERENCE",airspace:"CLASS D",obstacles:"MAJOR HOSPITAL + HELIPAD",wind:"MODERATE",restricted:"YES - HELIPAD EXCLUSION ZONE"} },
  { id:"DM0009-015", name:"Lowrise Suburb East", suburb:"River City East", state:"QLD", lat:-27.5027, lng:153.0561, diff:"green", jobs:["COMPLETE","CREATED"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  { id:"DM0009-016", name:"Cliffside River", suburb:"River City East B", state:"QLD", lat:-27.4850, lng:153.0367, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"CLIFFS + MEDIUM-RISE",wind:"RIVER WIND",restricted:"NO"} },
  { id:"DM0009-017", name:"Bridge South Complex", suburb:"River City East C", state:"QLD", lat:-27.4803, lng:153.0417, diff:"orange", jobs:["COMPLETE"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"BRIDGE + HIGH TOURIST",wind:"RIVER WIND + BRIDGE",restricted:"YES - BRIDGE EXCLUSION"} },
  // === GOLD COAST ===
  { id:"DM0010-001", name:"Coastal City Hospital", suburb:"Gold Coast A", state:"QLD", lat:-27.9803, lng:153.4012, diff:"yellow", jobs:["COMPLETE","CREATED"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"MEDIUM-RISE + HOSPITAL",wind:"SEA BREEZE",restricted:"YES - HOSPITAL"} },
  { id:"DM0010-002", name:"Beachfront Towers", suburb:"Gold Coast B", state:"QLD", lat:-28.0033, lng:153.4319, diff:"orange", jobs:["COMPLETE","CREATED"], factors:{gps:"HIGH INTERFERENCE",airspace:"CLASS D",obstacles:"HIGH-RISE + BEACH",wind:"STRONG SEA WINDS",restricted:"YES - HIGH TOURIST ZONE"} },
  { id:"DM0010-003", name:"Airport Gateway", suburb:"Gold Coast C", state:"QLD", lat:-28.1670, lng:153.5433, diff:"orange", jobs:["CREATED"], factors:{gps:"HIGH - TWEED HEADS AIRPORT",airspace:"CLASS D",obstacles:"AIRPORT + COASTAL HIGH-RISE",wind:"STRONG SEA WINDS",restricted:"YES - AIRPORT 2KM"} },
  { id:"DM0010-004", name:"Pinelands Estate", suburb:"Gold Coast D", state:"QLD", lat:-28.0817, lng:153.3847, diff:"green", jobs:["CREATED"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  // === SUNSHINE COAST ===
  { id:"DM0011-001", name:"Newland Rise", suburb:"Sunshine A", state:"QLD", lat:-26.7867, lng:153.1189, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS G",obstacles:"NEW DEVELOPMENT",wind:"LIGHT",restricted:"NO"} },
  { id:"DM0011-002", name:"Headland Village", suburb:"Sunshine B", state:"QLD", lat:-26.3923, lng:153.0960, diff:"green", jobs:["CREATED"], factors:{gps:"LOW",airspace:"CLASS G",obstacles:"LOW-RISE COASTAL",wind:"SEA BREEZE",restricted:"NO"} },
  // === MELBOURNE CBD ===
  { id:"DM0012-001", name:"Exchange Tower", suburb:"Southern Metro CBD", state:"VIC", lat:-37.8136, lng:144.9722, diff:"orange", jobs:["COMPLETE"], factors:{gps:"HIGH URBAN CANYON",airspace:"CLASS C",obstacles:"SKYSCRAPERS",wind:"CHANNELING",restricted:"YES - RESTRICTED AIRSPACE"} },
  { id:"DM0012-002", name:"Laneway Centre", suburb:"Southern Metro CBD", state:"VIC", lat:-37.8115, lng:144.9643, diff:"orange", jobs:["CREATED"], factors:{gps:"HIGH URBAN CANYON",airspace:"CLASS C",obstacles:"SKYSCRAPERS",wind:"CHANNELING",restricted:"YES"} },
  { id:"DM0012-003", name:"Westend Tower", suburb:"Southern Metro CBD", state:"VIC", lat:-37.8095, lng:144.9569, diff:"orange", jobs:["COMPLETE"], factors:{gps:"HIGH INTERFERENCE",airspace:"CLASS C",obstacles:"HIGH-RISE",wind:"CHANNELING",restricted:"YES"} },
  { id:"DM0012-004", name:"Riverside Offices", suburb:"Southern Metro Waterfront", state:"VIC", lat:-37.8200, lng:144.9649, diff:"orange", jobs:["CREATED"], factors:{gps:"HIGH INTERFERENCE",airspace:"CLASS C",obstacles:"HIGH-RISE + YARRA",wind:"RIVER + CHANNELING",restricted:"YES"} },
  { id:"DM0012-005", name:"Portside Arena", suburb:"Southern Metro Docks", state:"VIC", lat:-37.8152, lng:144.9467, diff:"orange", jobs:["CREATED"], factors:{gps:"MARITIME MULTIPATH",airspace:"CLASS C",obstacles:"HIGH-RISE + CRANES",wind:"HARBOUR + CHANNELING",restricted:"YES - ETIHAD/MARVEL STADIUM"} },
  // === MELBOURNE INNER ===
  { id:"DM0013-001", name:"Gardens Complex", suburb:"Southern Metro Inner A", state:"VIC", lat:-37.8155, lng:144.9866, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"PARK TREES + MEDIUM-RISE",wind:"MODERATE",restricted:"NO"} },
  { id:"DM0013-002", name:"Lakeside Event Centre", suburb:"Southern Metro Inner B", state:"VIC", lat:-37.8453, lng:144.9640, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"PARK + MEDIUM-RISE",wind:"MODERATE",restricted:"F1 RACE DAYS"} },
  { id:"DM0013-003", name:"Airport Fringe Res", suburb:"Southern Metro Inner C", state:"VIC", lat:-37.7497, lng:144.9198, diff:"yellow", jobs:["CREATED"], factors:{gps:"MODERATE - AIRPORT",airspace:"CLASS D",obstacles:"RESIDENTIAL + ESSENDON AIRPORT",wind:"JET WASH",restricted:"YES - ESSENDON AIRPORT"} },
  { id:"DM0013-004", name:"Aerodrome Block", suburb:"Southern Metro Inner D", state:"VIC", lat:-37.7118, lng:144.8877, diff:"orange", jobs:["CREATED"], factors:{gps:"HIGH INTERFERENCE - AIRPORT",airspace:"CLASS C",obstacles:"AIRPORT PROXIMITY",wind:"JET WASH",restricted:"YES - MELB AIRPORT CTR"} },
  { id:"DM0013-005", name:"Northgate Residential", suburb:"Southern Metro Inner E", state:"VIC", lat:-37.7056, lng:144.9290, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  { id:"DM0013-006", name:"Healthcare Hub", suburb:"Southern Metro Inner F", state:"VIC", lat:-37.7990, lng:144.9553, diff:"orange", jobs:["CREATED"], factors:{gps:"HIGH INTERFERENCE - HOSPITAL",airspace:"CLASS D",obstacles:"HOSPITAL + HELIPAD",wind:"MODERATE",restricted:"YES - HELIPAD"} },
  { id:"DM0013-007", name:"Northside Rise", suburb:"Southern Metro Inner G", state:"VIC", lat:-37.7770, lng:144.9621, diff:"yellow", jobs:["CREATED"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"MEDIUM-RISE",wind:"MODERATE",restricted:"NO"} },
  { id:"DM0013-008", name:"Urban Lofts", suburb:"Southern Metro Inner H", state:"VIC", lat:-37.7980, lng:144.9770, diff:"yellow", jobs:["CREATED"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"MEDIUM-RISE",wind:"MODERATE",restricted:"NO"} },
  { id:"DM0013-009", name:"Industrial East", suburb:"Southern Metro Inner I", state:"VIC", lat:-37.8230, lng:145.0048, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"MEDIUM-RISE",wind:"MODERATE",restricted:"NO"} },
  { id:"DM0013-010", name:"Upmarket Strip", suburb:"Southern Metro Inner J", state:"VIC", lat:-37.8400, lng:144.9920, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"MEDIUM HIGH-RISE",wind:"MODERATE",restricted:"NO"} },
  { id:"DM0013-011", name:"Bay Precinct", suburb:"Southern Metro Bay A", state:"VIC", lat:-37.8681, lng:144.9823, diff:"yellow", jobs:["CREATED"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"MEDIUM-RISE + EVENTS",wind:"BAY BREEZE",restricted:"EVENT DAYS"} },
  { id:"DM0013-012", name:"Beachside West", suburb:"Southern Metro Bay B", state:"VIC", lat:-37.8669, lng:144.9683, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"MEDIUM-RISE COASTAL",wind:"BAY BREEZE",restricted:"NO"} },
  { id:"DM0013-013", name:"Coastal Flats", suburb:"Southern Metro Bay C", state:"VIC", lat:-37.8807, lng:144.9887, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE COASTAL",wind:"BAY BREEZE",restricted:"NO"} },
  { id:"DM0013-014", name:"Meadowvale Estate", suburb:"Southern Metro Bay D", state:"VIC", lat:-37.9063, lng:145.0364, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  { id:"DM0013-015", name:"Shoreline Villas", suburb:"Southern Metro Bay E", state:"VIC", lat:-37.9048, lng:145.0046, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE COASTAL",wind:"BAY BREEZE",restricted:"NO"} },
  { id:"DM0013-016", name:"Bay Health Complex", suburb:"Southern Metro Bay F", state:"VIC", lat:-37.9494, lng:145.0038, diff:"yellow", jobs:["CREATED"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"HOSPITAL + HELIPAD",wind:"BAY BREEZE",restricted:"YES - HELIPAD"} },
  { id:"DM0013-017", name:"Port City", suburb:"Southern Metro Regional", state:"VIC", lat:-38.1499, lng:144.3617, diff:"yellow", jobs:["CREATED"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"MEDIUM-RISE + HARBOUR",wind:"BAY WIND",restricted:"NO"} },
  // === PERTH ===
  { id:"DM0014-001", name:"West City Tower", suburb:"West Metro CBD", state:"WA", lat:-31.9543, lng:115.8606, diff:"orange", jobs:["CREATED"], factors:{gps:"HIGH URBAN CANYON",airspace:"CLASS C",obstacles:"HIGH-RISE",wind:"FREMANTLE DOCTOR",restricted:"YES"} },
  { id:"DM0014-002", name:"Coastal Residential", suburb:"West Metro Coast A", state:"WA", lat:-31.9955, lng:115.7616, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE COASTAL",wind:"FREMANTLE DOCTOR - PREDICTABLE",restricted:"NO"} },
  { id:"DM0014-003", name:"Suburban Estate", suburb:"West Metro Inner A", state:"WA", lat:-31.9333, lng:115.8174, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"FREMANTLE DOCTOR",restricted:"NO"} },
  { id:"DM0014-004", name:"Oval Park Complex", suburb:"West Metro Inner B", state:"WA", lat:-31.9785, lng:115.8863, diff:"yellow", jobs:["CREATED"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"MEDIUM-RISE + STADIUM",wind:"MODERATE",restricted:"EVENT DAYS"} },
  { id:"DM0014-005", name:"River Crossing", suburb:"West Metro South", state:"WA", lat:-31.9784, lng:115.8607, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"MODERATE - BRIDGE",airspace:"CLASS D",obstacles:"BRIDGE + HIGHWAY",wind:"RIVER WIND",restricted:"BRIDGE EXCLUSION"} },
  { id:"DM0014-006", name:"Retail Park West", suburb:"West Metro South B", state:"WA", lat:-32.0333, lng:115.8390, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"SHOPPING CENTRE",wind:"LIGHT",restricted:"NO"} },
  // === CANBERRA ===
  { id:"DM0015-001", name:"Capital Civic", suburb:"Capital Region A", state:"ACT", lat:-35.2777, lng:149.1317, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"MODERATE",airspace:"CLASS C",obstacles:"MEDIUM-RISE CIVIC",wind:"MODERATE",restricted:"YES - PARLIAMENTARY ZONE"} },
  { id:"DM0015-002", name:"Research Campus", suburb:"Capital Region B", state:"ACT", lat:-35.2797, lng:149.1181, diff:"yellow", jobs:["CREATED"], factors:{gps:"MODERATE",airspace:"CLASS C",obstacles:"UNIVERSITY CAMPUS",wind:"MODERATE",restricted:"YES"} },
  { id:"DM0015-003", name:"Southside Suburbs", suburb:"Capital Region C", state:"ACT", lat:-35.3753, lng:149.1012, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  { id:"DM0015-004", name:"Northern Fringe", suburb:"Capital Region D", state:"ACT", lat:-35.1761, lng:149.1073, diff:"green", jobs:["COMPLETE","CREATED"], factors:{gps:"LOW",airspace:"CLASS G",obstacles:"LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  // === HOBART ===
  { id:"DM0016-001", name:"Riverside Hamlet A", suburb:"Island South A", state:"TAS", lat:-42.8404, lng:147.2605, diff:"green", jobs:["COMPLETE","CREATED"], factors:{gps:"LOW",airspace:"CLASS G",obstacles:"LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  { id:"DM0016-002", name:"Riverside Hamlet B", suburb:"Island South B", state:"TAS", lat:-42.7644, lng:147.2530, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS G",obstacles:"LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  // === DARWIN ===
  { id:"DM0017-001", name:"Tropical Metro Core", suburb:"Northern Territory CBD", state:"NT", lat:-12.4634, lng:130.8456, diff:"orange", jobs:["CREATED"], factors:{gps:"TROPICAL IONOSPHERE",airspace:"CLASS C",obstacles:"HIGH-RISE + HARBOUR",wind:"MONSOON SEASON",restricted:"YES - MILITARY PROXIMITY"} },
  { id:"DM0017-002", name:"Northern Retail Hub", suburb:"Northern Territory Inner A", state:"NT", lat:-12.3778, lng:130.8741, diff:"yellow", jobs:["CREATED"], factors:{gps:"MODERATE - TROPICAL",airspace:"CLASS D",obstacles:"SHOPPING CENTRE",wind:"TROPICAL WIND",restricted:"NO"} },
  { id:"DM0017-003", name:"Tropical Mediplex", suburb:"Northern Territory Inner B", state:"NT", lat:-12.3752, lng:130.8795, diff:"orange", jobs:["CREATED"], factors:{gps:"MODERATE - TROPICAL",airspace:"CLASS D",obstacles:"HOSPITAL + HELIPAD",wind:"TROPICAL WIND",restricted:"YES - HELIPAD"} },
  { id:"DM0017-004", name:"Desert Gateway Airport", suburb:"Central Territory", state:"NT", lat:-23.8059, lng:133.9022, diff:"orange", jobs:["CREATED"], factors:{gps:"HIGH - AIRPORT",airspace:"CLASS D",obstacles:"AIRPORT",wind:"DUST + THERMAL TURBULENCE",restricted:"YES - AIRPORT"} },
  // === VIC COASTAL ===
  { id:"DM0018-001", name:"Island Reserve", suburb:"Coastal VIC A", state:"VIC", lat:-38.4849, lng:145.2285, diff:"orange", jobs:["CREATED","FAILED"], factors:{gps:"MODERATE - COASTAL",airspace:"CLASS G",obstacles:"NATURE PARK + COASTAL CLIFFS",wind:"VERY STRONG BASS STRAIT WINDS",restricted:"YES - WILDLIFE RESERVE"} },
  { id:"DM0018-002", name:"Rural Lowlands", suburb:"Coastal VIC B", state:"VIC", lat:-37.7080, lng:142.8020, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS G",obstacles:"RURAL LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  // === NEWCASTLE ===
  { id:"DM0019-001", name:"Industrial Suburb", suburb:"Hunter Valley A", state:"NSW", lat:-32.9447, lng:151.6280, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS G",obstacles:"LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  { id:"DM0019-002", name:"Harbour Industrial", suburb:"Hunter Valley B", state:"NSW", lat:-32.9154, lng:151.7589, diff:"yellow", jobs:["CREATED"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"HARBOUR INDUSTRIAL",wind:"HARBOUR WIND",restricted:"NO"} },
  { id:"DM0019-003", name:"Power Station West", suburb:"Hunter Valley C", state:"NSW", lat:-32.8971, lng:151.7273, diff:"yellow", jobs:["COMPLETE","FAILED"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"INDUSTRIAL + POWER STATION",wind:"MODERATE",restricted:"YES - INDUSTRIAL"} },
  // === WOLLONGONG ===
  { id:"DM0020-001", name:"Escarpment View A", suburb:"Steel City A", state:"NSW", lat:-34.4278, lng:150.8929, diff:"yellow", jobs:["CREATED"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"MEDIUM-RISE + ESCARPMENT",wind:"ESCARPMENT WIND",restricted:"NO"} },
  { id:"DM0020-002", name:"Escarpment View B", suburb:"Steel City A", state:"NSW", lat:-34.4244, lng:150.8939, diff:"yellow", jobs:["CREATED"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"MEDIUM-RISE + STEEL WORKS",wind:"ESCARPMENT + SEA BREEZE",restricted:"NO"} },
  { id:"DM0020-003", name:"Coastal Lowrise", suburb:"Steel City B", state:"NSW", lat:-34.5762, lng:150.8697, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS G",obstacles:"LOW-RISE",wind:"SEA BREEZE",restricted:"NO"} },
  // === CENTRAL COAST ===
  { id:"DM0021-001", name:"Hilltop CBD", suburb:"Central Coast A", state:"NSW", lat:-33.4279, lng:151.3414, diff:"yellow", jobs:["FAILED"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"MEDIUM-RISE + HILLS",wind:"MODERATE",restricted:"NO"} },
  { id:"DM0021-002", name:"Rural Fringe", suburb:"Central Coast B", state:"NSW", lat:-33.1843, lng:151.5073, diff:"green", jobs:["COMPLETE","CREATED"], factors:{gps:"LOW",airspace:"CLASS G",obstacles:"RURAL LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  // === RURAL NSW ===
  { id:"DM0022-001", name:"Creek Settlement", suburb:"Rural NSW A", state:"NSW", lat:-29.9234, lng:152.3561, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS G",obstacles:"RURAL LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  { id:"DM0022-002", name:"Outback Township", suburb:"Rural NSW B", state:"NSW", lat:-30.3227, lng:149.7795, diff:"green", jobs:["CREATED"], factors:{gps:"LOW",airspace:"CLASS G",obstacles:"RURAL LOW-RISE",wind:"LIGHT",restricted:"NO"} },
];

export function getFlightPlan(site) {
  const d = site.diff;
  const highGPS = site.factors.gps.includes('HIGH') || site.factors.gps.includes('URBAN CANYON') || site.factors.gps.includes('TROPICAL') || site.factors.gps.includes('MULTIPATH') || site.factors.gps.includes('MARITIME');
  const isLarge = site.factors.obstacles.includes('SKYSCRAPER') || site.name.toLowerCase().includes('cbd');
  const hospital = site.factors.obstacles.includes('HOSPITAL') || site.factors.obstacles.includes('HELIPAD');
  const airport = site.factors.gps.includes('AIRPORT') || site.factors.restricted.includes('AIRPORT') || site.factors.restricted.includes('CTR');
  const tropical = site.factors.gps.includes('TROPICAL');
  const maritime = site.factors.gps.includes('MARITIME') || site.factors.gps.includes('HARBOUR');

  const camera = "Dewarping ON · Mechanical Shutter ON · Wide Mode · Zoom 1x · ISO 100 · F/4.0 · Shutter 1/1000–1/2000 · Manual Mode";
  const missionSetup = "V9.8.0: Planar height AUTO-CALCULATED (highest obstacle + 11m). Mark boundary clockwise OR anti-clockwise in sequence (no zig-zag). Antenna radius — no manual offset. Ortho ~30m above rooftop height — too low throws an error. Screen recording ON from hover start to mission end.";

  let gpsAction = highGPS
    ? `⚠ CRITICAL: Stabilise minimum 2 min before takeoff. M3E — on ground props OFF. M2E — at hover. Must reach 26–32 satellites.${tropical ? ' Tropical ionosphere expected — allow 5+ min.' : ''}${maritime ? ' Harbour multipath — verify HDOP < 1.5.' : ''}`
    : "⚠ CRITICAL: Stabilise 2 min before takeoff. M3E — on ground props OFF. M2E — at hover. Confirm 26–32 satellites before proceeding.";

  let batteryNote = (highGPS && isLarge)
    ? "⚠ SINGLE BATTERY RULE: All markup and capture on single battery. Split into zones if needed. Battery swap: land at EXACT same takeoff spot, swap, wait 5 min GPS re-stabilisation, re-verify satellite count and camera settings."
    : highGPS
      ? "⚠ SINGLE BATTERY RULE: All markup and capture within single battery. If unavoidable: land at EXACT same spot, swap, wait 5 min, re-verify GPS and camera."
      : "Battery swaps permitted. Land at EXACT same takeoff location. Swap, allow 5 min GPS re-stabilisation, re-verify camera settings, then continue.";

  let gcpNote = highGPS
    ? "⚠ Min 5 GCPs — distribute around perimeter, MUST be staggered. Place all GCPs and complete markup BEFORE starting battery."
    : "Min 5 GCPs — staggered around perimeter (never in a straight line). Record all coordinates.";

  let bestTime, weather, crew, permits, flightTime, altitude, approach, risks, equipment;
  const cbdUrban = d === 'orange' && (site.factors.gps.includes('URBAN CANYON') || site.factors.obstacles.includes('SKYSCRAPER'));
  const coastalWind = d === 'orange' && (site.factors.wind.includes('BASS STRAIT') || site.factors.wind.includes('STRONG COASTAL'));

  if (d === 'green') {
    bestTime = "07:00 – 10:00 or 15:00 – 17:00";
    weather = "Wind < 15 knots · Visibility > 5km · No rain";
    approach = "Standard approach. Single pilot sufficient.";
    altitude = "Max 50m AGL recommended";
    crew = "1 Pilot + Spotter (optional)";
    permits = "Standard CASA RePAS check";
    flightTime = "30–45 min total including prep";
    risks = "Standard pre-flight checks apply";
    equipment = "DJI M30T or equivalent";
  } else if (d === 'yellow') {
    bestTime = "07:00 – 09:30 (post-sunrise, pre-business hours)";
    weather = "Wind < 10 knots · Avoid afternoons · Check BOM 24hr forecast";
    approach = hospital ? "Hospital helipad in proximity — confirm helipad status before flight. Two-pilot operation." : "Two-pilot operation recommended. Brief team on site hazards pre-flight.";
    altitude = "Max 30–40m AGL near structures";
    crew = "1 Pilot + 1 Spotter minimum";
    permits = airport ? "CASA RePAS + airport authority notification required" : "CASA RePAS + local council notification if near public spaces";
    flightTime = "45–60 min including safety prep";
    risks = "Moderate. Review site factors. Have abort plan ready.";
    equipment = "DJI M30T or Matrice 350. Redundant battery.";
  } else {
    bestTime = cbdUrban
      ? "07:00 – 09:00 — GPS signal quality at peak. Ionosphere settled from overnight, RF noise minimal. Do NOT fly after 10:00."
      : tropical ? "06:30 – 08:30 — ionospheric distortion peaks midday. Fly as early as access permits."
      : hospital ? "07:00 – 09:00 — coordinate with site to confirm helipad quiet period."
      : airport ? "Time driven by ATC NOTAM — coordinate minimum 7 days in advance."
      : coastalWind ? "First light to 08:00 — sea breeze establishes fast. Conditions deteriorate after 08:30."
      : "07:00 – 09:00 — best GPS signal quality, lowest wind, minimal RF interference.";
    weather = "Wind MUST be < 8 knots · No operations in rain · Avoid >70% cloud cover";
    approach = hospital ? "Hospital helipad exclusion zone — confirm helipad inactive with site before dispatch."
      : airport ? "Airport CTR — full RPAOC required, coordinate with ATC before flight."
      : "Advance site survey on foot before flight day. Brief full crew on abort conditions.";
    altitude = "Strictly follow tower clearances. Max 20m lateral from structure.";
    crew = "1 Pilot + 1 Spotter + 1 Ground Safety Officer";
    permits = airport ? "CASA RPAOC + ATC coordination (7-day min lead). Restricted airspace application."
      : hospital ? "CASA RPAOC + hospital site permit. Helipad exclusion confirmation required."
      : "CASA RPAOC required. Restricted airspace application (7-day lead). Council approval likely.";
    flightTime = "60–90 min including permits, pre-survey, and post-flight report";
    risks = "HIGH — " + (cbdUrban ? "Urban canyon GPS multipath + RF noise. " : "") + (tropical ? "Tropical ionosphere peaks midday. " : "") + (maritime ? "Harbour multipath. " : "") + "ADSB awareness mandatory.";
    equipment = "Enterprise-grade drone. Obstacle avoidance active. Backup comms. Hi-vis gear.";
  }
  return { bestTime, weather, approach, altitude, gpsAction, batteryNote, gcpNote, camera, missionSetup, crew, permits, flightTime, risks, equipment };
}

export function getDifficultyScore(site) {
  return site.diff === 'orange' ? 75 + Math.random() * 20 : site.diff === 'yellow' ? 40 + Math.random() * 30 : 10 + Math.random() * 25;
}

export function getScoreColor(diff) {
  return diff === 'orange' ? 'linear-gradient(90deg, #ff6b00, #ff3300)' : diff === 'yellow' ? 'linear-gradient(90deg, #ffcc00, #ff9900)' : 'linear-gradient(90deg, #00ff88, #00cc66)';
}