export const C = {
  bg: '#050a0f', panel: '#0b1520', panel2: '#0f1e2d',
  border: '#1a3a5c', accent: '#00c8ff', green: '#00ff88',
  yellow: '#ffcc00', orange: '#ff6b00', red: '#ff2244',
  text: '#c8e0f0', dim: '#5a8aaa',
};

export const SITES = [
  // === SYDNEY CBD / INNER ===
  { id:"AN2000-033", name:"Chinatown", suburb:"Sydney CBD", state:"NSW", lat:-33.8775, lng:151.2062, diff:"orange", jobs:["CREATED"], factors:{gps:"HIGH URBAN CANYON",airspace:"CLASS C",obstacles:"VERY HIGH-RISE",wind:"CHANNELING",restricted:"YES - DRONE ZONE"} },
  { id:"AN2000-034", name:"Chinatown 2", suburb:"Sydney CBD", state:"NSW", lat:-33.8780, lng:151.2058, diff:"orange", jobs:["COMPLETE"], factors:{gps:"HIGH URBAN CANYON",airspace:"CLASS C",obstacles:"VERY HIGH-RISE",wind:"CHANNELING",restricted:"YES - DRONE ZONE"} },
  { id:"AN2000-036", name:"East Sydney", suburb:"East Sydney", state:"NSW", lat:-33.8756, lng:151.2189, diff:"orange", jobs:["COMPLETE"], factors:{gps:"URBAN CANYON",airspace:"CLASS C",obstacles:"HIGH-RISE",wind:"MODERATE",restricted:"YES"} },
  { id:"AN2000-037", name:"Haymarket", suburb:"Haymarket", state:"NSW", lat:-33.8814, lng:151.2040, diff:"orange", jobs:["CREATED"], factors:{gps:"HIGH INTERFERENCE",airspace:"CLASS C",obstacles:"HIGH-RISE",wind:"CHANNELING",restricted:"YES"} },
  { id:"AN2000-038", name:"Hyde Park", suburb:"Sydney CBD", state:"NSW", lat:-33.8737, lng:151.2121, diff:"orange", jobs:["CREATED"], factors:{gps:"HIGH INTERFERENCE",airspace:"CLASS C",obstacles:"HIGH-RISE",wind:"MODERATE",restricted:"YES"} },
  { id:"AN2000-039", name:"Kent-King", suburb:"Sydney CBD", state:"NSW", lat:-33.8721, lng:151.2001, diff:"orange", jobs:["CREATED"], factors:{gps:"URBAN CANYON",airspace:"CLASS C",obstacles:"HIGH-RISE",wind:"CHANNELING",restricted:"YES"} },
  { id:"AN2000-041", name:"Millers Point", suburb:"Millers Point", state:"NSW", lat:-33.8604, lng:151.2028, diff:"orange", jobs:["CREATED"], factors:{gps:"HARBOUR MULTIPATH",airspace:"CLASS C",obstacles:"HIGH-RISE + CRANES",wind:"HARBOUR WIND",restricted:"YES"} },
  { id:"AN2000-042", name:"Pitt Street", suburb:"Sydney CBD", state:"NSW", lat:-33.8699, lng:151.2100, diff:"orange", jobs:["CREATED"], factors:{gps:"HIGH INTERFERENCE",airspace:"CLASS C",obstacles:"SKYSCRAPERS",wind:"CHANNELING",restricted:"YES"} },
  { id:"AN2000-045", name:"Sydney - 332-336 Pitt St", suburb:"Sydney CBD", state:"NSW", lat:-33.8700, lng:151.2098, diff:"orange", jobs:["CREATED"], factors:{gps:"HIGH INTERFERENCE",airspace:"CLASS C",obstacles:"SKYSCRAPERS",wind:"CHANNELING",restricted:"YES"} },
  { id:"AN2000-046", name:"The Rocks", suburb:"The Rocks", state:"NSW", lat:-33.8594, lng:151.2082, diff:"orange", jobs:["COMPLETE"], factors:{gps:"HARBOUR MULTIPATH",airspace:"CLASS C",obstacles:"HERITAGE + CRANES",wind:"HARBOUR WIND",restricted:"YES"} },
  { id:"AN2000-047", name:"Town Hall", suburb:"Sydney CBD", state:"NSW", lat:-33.8732, lng:151.2063, diff:"orange", jobs:["CREATED"], factors:{gps:"URBAN CANYON",airspace:"CLASS C",obstacles:"HIGH-RISE",wind:"CHANNELING",restricted:"YES"} },
  { id:"AN2000-048", name:"Wynyard", suburb:"Sydney CBD", state:"NSW", lat:-33.8666, lng:151.2068, diff:"orange", jobs:["COMPLETE"], factors:{gps:"HIGH INTERFERENCE",airspace:"CLASS C",obstacles:"HIGH-RISE + RAIL",wind:"CHANNELING",restricted:"YES"} },
  { id:"AN2000-061", name:"Tumbalong Park", suburb:"Darling Harbour", state:"NSW", lat:-33.8789, lng:151.1998, diff:"orange", jobs:["CREATED"], factors:{gps:"MULTIPATH",airspace:"CLASS C",obstacles:"HIGH-RISE + EVENT VENUE",wind:"HARBOUR WIND",restricted:"YES"} },
  { id:"AN2000-030", name:"Darling Harbour Quarter", suburb:"Darling Harbour", state:"NSW", lat:-33.8699, lng:151.1995, diff:"orange", jobs:["CREATED"], factors:{gps:"MULTIPATH",airspace:"CLASS C",obstacles:"HIGH-RISE",wind:"HARBOUR WIND",restricted:"YES"} },
  // === SYDNEY INNER SUBURBS ===
  { id:"AN2006-001", name:"Chippendale - Sydney Uni", suburb:"Chippendale", state:"NSW", lat:-33.8888, lng:151.1934, diff:"orange", jobs:["CREATED"], factors:{gps:"URBAN",airspace:"CLASS C",obstacles:"CAMPUS BUILDINGS",wind:"MODERATE",restricted:"YES"} },
  { id:"AN2007-001", name:"Ultimo", suburb:"Ultimo", state:"NSW", lat:-33.8825, lng:151.1975, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"MODERATE INTERFERENCE",airspace:"CLASS C",obstacles:"MEDIUM-RISE",wind:"MODERATE",restricted:"YES"} },
  { id:"AN2008-001", name:"Broadway 2", suburb:"Glebe", state:"NSW", lat:-33.8847, lng:151.1961, diff:"yellow", jobs:["COMPLETE","FAILED"], factors:{gps:"URBAN",airspace:"CLASS C",obstacles:"MEDIUM-RISE",wind:"MODERATE",restricted:"YES"} },
  { id:"AN2008-002", name:"Darlington", suburb:"Darlington", state:"NSW", lat:-33.8892, lng:151.1975, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"MODERATE",airspace:"CLASS C",obstacles:"MEDIUM",wind:"MODERATE",restricted:"YES"} },
  { id:"AN2009-001", name:"Pyrmont", suburb:"Pyrmont", state:"NSW", lat:-33.8725, lng:151.1930, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"HARBOUR MULTIPATH",airspace:"CLASS C",obstacles:"MEDIUM-RISE + BRIDGE",wind:"HARBOUR WIND",restricted:"YES"} },
  { id:"AN2009-002", name:"Pyrmont 209 Harris St", suburb:"Pyrmont", state:"NSW", lat:-33.8730, lng:151.1935, diff:"yellow", jobs:["CREATED"], factors:{gps:"HARBOUR MULTIPATH",airspace:"CLASS C",obstacles:"MEDIUM-RISE",wind:"HARBOUR WIND",restricted:"YES"} },
  { id:"AN2010-001", name:"Central Railway South", suburb:"Haymarket", state:"NSW", lat:-33.8834, lng:151.2067, diff:"orange", jobs:["COMPLETE"], factors:{gps:"HIGH INTERFERENCE",airspace:"CLASS C",obstacles:"RAIL + HIGH-RISE",wind:"CHANNELING",restricted:"YES"} },
  { id:"AN2011-001", name:"Kings Cross", suburb:"Kings Cross", state:"NSW", lat:-33.8737, lng:151.2226, diff:"orange", jobs:["COMPLETE"], factors:{gps:"HIGH INTERFERENCE",airspace:"CLASS C",obstacles:"HIGH-RISE + NEON",wind:"MODERATE",restricted:"YES"} },
  { id:"AN2016-001", name:"Redfern Station", suburb:"Redfern", state:"NSW", lat:-33.8924, lng:151.2038, diff:"orange", jobs:["FAILED"], factors:{gps:"HIGH INTERFERENCE",airspace:"CLASS C",obstacles:"RAIL INFRASTRUCTURE",wind:"MODERATE",restricted:"YES - RAIL"} },
  { id:"AN2017-002", name:"Zetland North", suburb:"Zetland", state:"NSW", lat:-33.9003, lng:151.2090, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"MODERATE",airspace:"CLASS C",obstacles:"NEW DEVELOPMENT",wind:"MODERATE",restricted:"YES"} },
  { id:"AN2018-001", name:"Eastlakes", suburb:"Eastlakes", state:"NSW", lat:-33.9175, lng:151.2069, diff:"green", jobs:["CREATED"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  { id:"AN2020-001", name:"Mascot North", suburb:"Mascot", state:"NSW", lat:-33.9227, lng:151.1928, diff:"orange", jobs:["COMPLETE"], factors:{gps:"HIGH INTERFERENCE - AIRPORT",airspace:"CLASS C",obstacles:"AIRPORT PROXIMITY",wind:"JET WASH RISK",restricted:"YES - AIRPORT 3KM"} },
  // === SYDNEY EASTERN SUBURBS ===
  { id:"AN2022-001", name:"Bondi Junction", suburb:"Bondi Junction", state:"NSW", lat:-33.8934, lng:151.2490, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"SHOPPING CENTRE + MED RISE",wind:"MODERATE",restricted:"NO"} },
  { id:"AN2024-001", name:"Bronte", suburb:"Bronte", state:"NSW", lat:-33.9041, lng:151.2660, diff:"green", jobs:["CREATED"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE COASTAL",wind:"SEA BREEZE - PREDICTABLE",restricted:"NO"} },
  { id:"AN2026-002", name:"North Bondi", suburb:"North Bondi", state:"NSW", lat:-33.8891, lng:151.2778, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE COASTAL",wind:"SEA BREEZE",restricted:"NO"} },
  { id:"AN2028-001", name:"Double Bay", suburb:"Double Bay", state:"NSW", lat:-33.8773, lng:151.2474, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"HARBOUR PROXIMITY + MASTS",wind:"HARBOUR WIND",restricted:"NO"} },
  { id:"AN2030-001", name:"Dover Heights", suburb:"Dover Heights", state:"NSW", lat:-33.8716, lng:151.2827, diff:"green", jobs:["CREATED"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"SEA BREEZE",restricted:"NO"} },
  { id:"AN2031-002", name:"Clovelly", suburb:"Clovelly", state:"NSW", lat:-33.9155, lng:151.2637, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"SEA BREEZE",restricted:"NO"} },
  { id:"AN2033-002", name:"Randwick Racecourse", suburb:"Randwick", state:"NSW", lat:-33.9037, lng:151.2256, diff:"yellow", jobs:["COMPLETE","FAILED"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"GRANDSTANDS + TREES",wind:"MODERATE",restricted:"EVENT DAYS"} },
  { id:"AN2034-001", name:"Coogee North", suburb:"Coogee", state:"NSW", lat:-33.9210, lng:151.2573, diff:"green", jobs:["CREATED"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE COASTAL",wind:"SEA BREEZE",restricted:"NO"} },
  { id:"AN2035-002", name:"Maroubra Junction", suburb:"Maroubra", state:"NSW", lat:-33.9380, lng:151.2315, diff:"green", jobs:["CREATED"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  { id:"AN2036-002", name:"Hillsdale", suburb:"Hillsdale", state:"NSW", lat:-33.9497, lng:151.2240, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  // === SYDNEY INNER WEST ===
  { id:"AN2037-001", name:"Chippendale", suburb:"Chippendale", state:"NSW", lat:-33.8882, lng:151.1983, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"URBAN",airspace:"CLASS C",obstacles:"MEDIUM-RISE",wind:"MODERATE",restricted:"YES"} },
  { id:"AN2038-001", name:"Annandale", suburb:"Annandale", state:"NSW", lat:-33.8830, lng:151.1706, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW-MODERATE",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  { id:"AN2042-001", name:"Newtown East", suburb:"Newtown", state:"NSW", lat:-33.8975, lng:151.1800, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"MEDIUM DENSITY",wind:"MODERATE",restricted:"NO"} },
  { id:"AN2049-001", name:"Petersham", suburb:"Petersham", state:"NSW", lat:-33.9003, lng:151.1581, diff:"green", jobs:["CREATED"], factors:{gps:"LOW-MODERATE",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  // === SYDNEY NORTH SHORE ===
  { id:"AN2060-006", name:"Waverton East", suburb:"Waverton", state:"NSW", lat:-33.8360, lng:151.2093, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"HARBOUR MULTIPATH",airspace:"CLASS D",obstacles:"MEDIUM-RISE + RAIL",wind:"HARBOUR WIND",restricted:"NO"} },
  { id:"AN2065-004", name:"Gore Hill", suburb:"Gore Hill", state:"NSW", lat:-33.8279, lng:151.1897, diff:"yellow", jobs:["CREATED"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"BROADCAST TOWERS",wind:"MODERATE",restricted:"YES - EMI FROM TOWERS"} },
  { id:"AN2067-001", name:"Chatswood", suburb:"Chatswood", state:"NSW", lat:-33.7979, lng:151.1823, diff:"yellow", jobs:["CREATED"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"HIGH-RISE COMMERCIAL",wind:"MODERATE",restricted:"NO"} },
  { id:"AN2068-001", name:"Castlecrag", suburb:"Castlecrag", state:"NSW", lat:-33.8068, lng:151.1823, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE + TREES",wind:"LIGHT",restricted:"NO"} },
  { id:"AN2070-001", name:"Lindfield Shops", suburb:"Lindfield", state:"NSW", lat:-33.7766, lng:151.1676, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE SHOPS",wind:"LIGHT",restricted:"NO"} },
  { id:"AN2077-004", name:"Hornsby Shops", suburb:"Hornsby", state:"NSW", lat:-33.7026, lng:151.1005, diff:"green", jobs:["CREATED"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE SHOPS",wind:"LIGHT",restricted:"NO"} },
  { id:"AN2085-001", name:"Belrose South", suburb:"Belrose", state:"NSW", lat:-33.7392, lng:151.2201, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE + BUSH",wind:"LIGHT",restricted:"NO"} },
  { id:"AN2088-001", name:"Cremorne", suburb:"Cremorne", state:"NSW", lat:-33.8301, lng:151.2218, diff:"yellow", jobs:["CREATED"], factors:{gps:"HARBOUR PROXIMITY",airspace:"CLASS D",obstacles:"MEDIUM DENSITY",wind:"HARBOUR WIND",restricted:"NO"} },
  { id:"AN2088-002", name:"Mosman", suburb:"Mosman", state:"NSW", lat:-33.8291, lng:151.2471, diff:"yellow", jobs:["CREATED"], factors:{gps:"HARBOUR PROXIMITY",airspace:"CLASS D",obstacles:"MEDIUM DENSITY",wind:"HARBOUR WIND",restricted:"NO"} },
  { id:"AN2092-001", name:"Balgowlah", suburb:"Balgowlah", state:"NSW", lat:-33.7964, lng:151.2571, diff:"green", jobs:["CREATED"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"SEA BREEZE",restricted:"NO"} },
  { id:"AN2095-001", name:"Manly Corso", suburb:"Manly", state:"NSW", lat:-33.7960, lng:151.2873, diff:"yellow", jobs:["CREATED"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"FERRY TERMINAL + SHOPS",wind:"SEA BREEZE STRONG",restricted:"NO"} },
  { id:"AN2097-001", name:"Cromer", suburb:"Cromer", state:"NSW", lat:-33.7529, lng:151.2779, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"SEA BREEZE",restricted:"NO"} },
  { id:"AN2099-003", name:"Dee Why South", suburb:"Dee Why", state:"NSW", lat:-33.7528, lng:151.2870, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"SEA BREEZE",restricted:"NO"} },
  { id:"AN2103-001", name:"Mona Vale", suburb:"Mona Vale", state:"NSW", lat:-33.6781, lng:151.3009, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE COASTAL",wind:"SEA BREEZE",restricted:"NO"} },
  { id:"AN2106-001", name:"Newport", suburb:"Newport", state:"NSW", lat:-33.6584, lng:151.3236, diff:"green", jobs:["COMPLETE","CREATED"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE COASTAL",wind:"SEA BREEZE",restricted:"NO"} },
  { id:"AN2107-001", name:"Avalon", suburb:"Avalon", state:"NSW", lat:-33.6304, lng:151.3411, diff:"green", jobs:["FAILED"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"SEA BREEZE",restricted:"NO"} },
  // === WESTERN SYDNEY ===
  { id:"AN2112-002", name:"Top Ryde", suburb:"Ryde", state:"NSW", lat:-33.8164, lng:151.1002, diff:"green", jobs:["CREATED"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"SHOPPING CENTRE + LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  { id:"AN2118-003", name:"Carlingford South", suburb:"Carlingford", state:"NSW", lat:-33.7818, lng:151.0534, diff:"green", jobs:["COMPLETE","FAILED"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  { id:"AN2127-001", name:"Wentworth Point North", suburb:"Wentworth Point", state:"NSW", lat:-33.8108, lng:151.0608, diff:"yellow", jobs:["COMPLETE","CREATED"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"HIGH DENSITY RESIDENTIAL",wind:"HARBOUR WIND",restricted:"NO"} },
  { id:"AN2131-001", name:"Ashfield East", suburb:"Ashfield", state:"NSW", lat:-33.8895, lng:151.1294, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  { id:"AN2140-001", name:"Homebush Bay 1", suburb:"Homebush Bay", state:"NSW", lat:-33.8468, lng:151.0693, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"STADIUM + EVENT COMPLEX",wind:"MODERATE",restricted:"EVENT DAYS"} },
  { id:"AN2145-017", name:"Westmead Hospital", suburb:"Westmead", state:"NSW", lat:-33.8081, lng:150.9870, diff:"orange", jobs:["CREATED"], factors:{gps:"HIGH INTERFERENCE - HOSPITAL",airspace:"CLASS D",obstacles:"HOSPITAL COMPLEX + HELIPAD",wind:"MODERATE",restricted:"YES - HELIPAD 1KM"} },
  { id:"AN2148-005", name:"Blacktown", suburb:"Blacktown", state:"NSW", lat:-33.7689, lng:150.9056, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"MEDIUM COMMERCIAL",wind:"LIGHT",restricted:"NO"} },
  { id:"AN2150-004", name:"Parramatta", suburb:"Parramatta", state:"NSW", lat:-33.8152, lng:151.0017, diff:"yellow", jobs:["COMPLETE","FAILED"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"HIGH-RISE CBD",wind:"MODERATE",restricted:"NO"} },
  { id:"AN2153-003", name:"Norwest Lake", suburb:"Norwest", state:"NSW", lat:-33.7295, lng:150.9720, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"BUSINESS PARK",wind:"LIGHT",restricted:"NO"} },
  { id:"AN2155-002", name:"Beaumont Hills East", suburb:"Beaumont Hills", state:"NSW", lat:-33.7098, lng:151.0008, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  // === SYDNEY SOUTH/SOUTHWEST ===
  { id:"AN2165-001", name:"Fairfield East", suburb:"Fairfield East", state:"NSW", lat:-33.8761, lng:150.9542, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  { id:"AN2166-001", name:"Cabramatta", suburb:"Cabramatta", state:"NSW", lat:-33.8968, lng:150.9440, diff:"green", jobs:["COMPLETE","FAILED"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE SHOPS",wind:"LIGHT",restricted:"NO"} },
  { id:"AN2171-003", name:"Oran Park", suburb:"Oran Park", state:"NSW", lat:-33.9874, lng:150.7697, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS G",obstacles:"LOW-RISE NEW DEV",wind:"LIGHT",restricted:"NO"} },
  { id:"AN2192-001", name:"Belmore", suburb:"Belmore", state:"NSW", lat:-33.9155, lng:151.0907, diff:"green", jobs:["CREATED"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  { id:"AN2193-001", name:"Canterbury", suburb:"Canterbury", state:"NSW", lat:-33.9086, lng:151.1177, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  { id:"AN2205-002", name:"Arncliffe 2", suburb:"Arncliffe", state:"NSW", lat:-33.9285, lng:151.1555, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"MODERATE - AIRPORT",airspace:"CLASS C",obstacles:"MEDIUM-RISE",wind:"JET WASH",restricted:"YES - AIRPORT APPROACH"} },
  { id:"AN2213-001", name:"East Hills", suburb:"East Hills", state:"NSW", lat:-33.9686, lng:151.0079, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  { id:"AN2216-002", name:"Brighton Le Sands", suburb:"Brighton-Le-Sands", state:"NSW", lat:-33.9574, lng:151.1614, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE COASTAL",wind:"SEA BREEZE",restricted:"NO"} },
  { id:"AN2219-001", name:"Sans Souci Central", suburb:"Sans Souci", state:"NSW", lat:-33.9927, lng:151.1325, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE COASTAL",wind:"SEA BREEZE",restricted:"NO"} },
  { id:"AN2224-001", name:"Sylvania Waters", suburb:"Sylvania Waters", state:"NSW", lat:-34.0199, lng:151.1118, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE WATERFRONT",wind:"SEA BREEZE",restricted:"NO"} },
  { id:"AN2229-001", name:"Caringbah 2", suburb:"Caringbah", state:"NSW", lat:-34.0380, lng:151.1240, diff:"green", jobs:["COMPLETE","CREATED"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE SHOPS",wind:"LIGHT",restricted:"NO"} },
  { id:"AN2230-004", name:"Cronulla", suburb:"Cronulla", state:"NSW", lat:-34.0566, lng:151.1512, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE COASTAL",wind:"SEA BREEZE",restricted:"NO"} },
  // === BRISBANE CBD ===
  { id:"AQ4000-001", name:"229 Elizabeth Street", suburb:"Brisbane CBD", state:"QLD", lat:-27.4683, lng:153.0235, diff:"orange", jobs:["COMPLETE"], factors:{gps:"HIGH URBAN CANYON",airspace:"CLASS C",obstacles:"SKYSCRAPERS",wind:"CHANNELING",restricted:"YES - RESTRICTED AIRSPACE"} },
  { id:"AQ4000-002", name:"Ann And Queen Street", suburb:"Brisbane CBD", state:"QLD", lat:-27.4675, lng:153.0269, diff:"orange", jobs:["COMPLETE","CREATED"], factors:{gps:"HIGH URBAN CANYON",airspace:"CLASS C",obstacles:"SKYSCRAPERS",wind:"CHANNELING",restricted:"YES"} },
  { id:"AQ4000-004", name:"Brisbane CBD", suburb:"Brisbane CBD", state:"QLD", lat:-27.4700, lng:153.0260, diff:"orange", jobs:["COMPLETE","CREATED"], factors:{gps:"HIGH URBAN CANYON",airspace:"CLASS C",obstacles:"SKYSCRAPERS",wind:"CHANNELING",restricted:"YES"} },
  { id:"AQ4000-008", name:"Margaret St CBD", suburb:"Brisbane CBD", state:"QLD", lat:-27.4671, lng:153.0261, diff:"orange", jobs:["STARTED"], factors:{gps:"HIGH URBAN CANYON",airspace:"CLASS C",obstacles:"SKYSCRAPERS",wind:"CHANNELING",restricted:"YES"} },
  { id:"AQ4000-011", name:"Queen And Wharf Street 2", suburb:"Brisbane CBD", state:"QLD", lat:-27.4680, lng:153.0287, diff:"orange", jobs:["FAILED"], factors:{gps:"HIGH INTERFERENCE",airspace:"CLASS C",obstacles:"HIGH-RISE + WATERFRONT",wind:"RIVER WIND",restricted:"YES"} },
  // === BRISBANE INNER ===
  { id:"AQ4006-002", name:"Bowen Hills", suburb:"Bowen Hills", state:"QLD", lat:-27.4405, lng:153.0387, diff:"yellow", jobs:["COMPLETE","FAILED"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"STADIUM + RAIL",wind:"MODERATE",restricted:"EVENT DAYS"} },
  { id:"AQ4006-004", name:"James St Markets", suburb:"Fortitude Valley", state:"QLD", lat:-27.4575, lng:153.0354, diff:"yellow", jobs:["COMPLETE","FAILED"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"MEDIUM-RISE PRECINCT",wind:"MODERATE",restricted:"NO"} },
  { id:"AQ4012-002", name:"Wavell Heights Church", suburb:"Wavell Heights", state:"QLD", lat:-27.3964, lng:153.0453, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE + CHURCH",wind:"LIGHT",restricted:"NO"} },
  { id:"AQ4017-001", name:"Brighton Nth", suburb:"Brighton", state:"QLD", lat:-27.2930, lng:153.0466, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE COASTAL",wind:"SEA BREEZE",restricted:"NO"} },
  { id:"AQ4032-002", name:"Chermside", suburb:"Chermside", state:"QLD", lat:-27.3859, lng:153.0316, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"MODERATE",airspace:"CLASS C",obstacles:"SHOPPING CENTRE + HOSPITAL",wind:"MODERATE",restricted:"YES - HOSPITAL PROXIMITY"} },
  { id:"AQ4060-001", name:"Ashgrove", suburb:"Ashgrove", state:"QLD", lat:-27.4386, lng:152.9878, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE HILLY",wind:"LIGHT - HILLY TERRAIN",restricted:"NO"} },
  { id:"AQ4064-001", name:"Milton", suburb:"Milton", state:"QLD", lat:-27.4730, lng:152.9934, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"MEDIUM-RISE",wind:"MODERATE",restricted:"NO"} },
  { id:"AQ4066-001", name:"Toowong", suburb:"Toowong", state:"QLD", lat:-27.4844, lng:152.9808, diff:"yellow", jobs:["COMPLETE","FAILED"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"MEDIUM-RISE + UNI",wind:"MODERATE",restricted:"NO"} },
  { id:"AQ4101-001", name:"Highgate Hill", suburb:"Highgate Hill", state:"QLD", lat:-27.4975, lng:153.0150, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"MEDIUM-RISE HILLY",wind:"HILLY TERRAIN",restricted:"NO"} },
  { id:"AQ4101-004", name:"Southbank TAFE", suburb:"South Bank", state:"QLD", lat:-27.4876, lng:153.0176, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"TAFE + CULTURAL PRECINCT",wind:"MODERATE",restricted:"EVENT DAYS"} },
  { id:"AQ4101-005", name:"Woolloongabba", suburb:"Woolloongabba", state:"QLD", lat:-27.4933, lng:153.0350, diff:"yellow", jobs:["STARTED"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"STADIUM + MEDIUM",wind:"MODERATE",restricted:"EVENT DAYS - STADIUM"} },
  { id:"AQ4103-001", name:"Fairfield", suburb:"Fairfield QLD", state:"QLD", lat:-27.5230, lng:153.0161, diff:"green", jobs:["COMPLETE","CREATED"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  { id:"AQ4108-001", name:"QE II Hospital", suburb:"Coopers Plains", state:"QLD", lat:-27.5624, lng:153.0231, diff:"yellow", jobs:["COMPLETE","CREATED"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"HOSPITAL COMPLEX",wind:"MODERATE",restricted:"YES - HELIPAD"} },
  { id:"AQ4120-003", name:"Greenslopes Hospital", suburb:"Greenslopes", state:"QLD", lat:-27.5117, lng:153.0424, diff:"orange", jobs:["CREATED"], factors:{gps:"HIGH INTERFERENCE",airspace:"CLASS D",obstacles:"MAJOR HOSPITAL + HELIPAD",wind:"MODERATE",restricted:"YES - HELIPAD EXCLUSION ZONE"} },
  { id:"AQ4151-002", name:"Coorparoo", suburb:"Coorparoo", state:"QLD", lat:-27.5027, lng:153.0561, diff:"green", jobs:["COMPLETE","CREATED"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  { id:"AQ4169-002", name:"Kangaroo Point", suburb:"Kangaroo Point", state:"QLD", lat:-27.4850, lng:153.0367, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"CLIFFS + MEDIUM-RISE",wind:"RIVER WIND",restricted:"NO"} },
  { id:"AQ4169-005", name:"Story Bridge South", suburb:"Kangaroo Point", state:"QLD", lat:-27.4803, lng:153.0417, diff:"orange", jobs:["COMPLETE"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"BRIDGE + HIGH TOURIST",wind:"RIVER WIND + BRIDGE",restricted:"YES - BRIDGE EXCLUSION"} },
  // === GOLD COAST ===
  { id:"AQ4215-003", name:"Southport", suburb:"Southport", state:"QLD", lat:-27.9803, lng:153.4012, diff:"yellow", jobs:["COMPLETE","CREATED"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"MEDIUM-RISE + HOSPITAL",wind:"SEA BREEZE",restricted:"YES - HOSPITAL"} },
  { id:"AQ4217-004", name:"Surfers Paradise 2", suburb:"Surfers Paradise", state:"QLD", lat:-28.0033, lng:153.4319, diff:"orange", jobs:["COMPLETE","CREATED"], factors:{gps:"HIGH INTERFERENCE",airspace:"CLASS D",obstacles:"HIGH-RISE + BEACH",wind:"STRONG SEA WINDS",restricted:"YES - HIGH TOURIST ZONE"} },
  { id:"AQ4225-001", name:"Coolangatta", suburb:"Coolangatta", state:"QLD", lat:-28.1670, lng:153.5433, diff:"orange", jobs:["CREATED"], factors:{gps:"HIGH - TWEED HEADS AIRPORT",airspace:"CLASS D",obstacles:"AIRPORT + COASTAL HIGH-RISE",wind:"STRONG SEA WINDS",restricted:"YES - AIRPORT 2KM"} },
  { id:"AQ4226-002", name:"Robina Woods", suburb:"Robina", state:"QLD", lat:-28.0817, lng:153.3847, diff:"green", jobs:["CREATED"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  // === SUNSHINE COAST ===
  { id:"AQ4551-003", name:"Aura 5 - Bellvista", suburb:"Bellvista", state:"QLD", lat:-26.7867, lng:153.1189, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS G",obstacles:"NEW DEVELOPMENT",wind:"LIGHT",restricted:"NO"} },
  { id:"AQ4567-001", name:"Noosa 2", suburb:"Noosa Heads", state:"QLD", lat:-26.3923, lng:153.0960, diff:"green", jobs:["CREATED"], factors:{gps:"LOW",airspace:"CLASS G",obstacles:"LOW-RISE COASTAL",wind:"SEA BREEZE",restricted:"NO"} },
  // === MELBOURNE CBD ===
  { id:"AV3000-010", name:"Bourke And Exhibition", suburb:"Melbourne CBD", state:"VIC", lat:-37.8136, lng:144.9722, diff:"orange", jobs:["COMPLETE"], factors:{gps:"HIGH URBAN CANYON",airspace:"CLASS C",obstacles:"SKYSCRAPERS",wind:"CHANNELING",restricted:"YES - RESTRICTED AIRSPACE"} },
  { id:"AV3000-013", name:"City Little Bourke", suburb:"Melbourne CBD", state:"VIC", lat:-37.8115, lng:144.9643, diff:"orange", jobs:["CREATED"], factors:{gps:"HIGH URBAN CANYON",airspace:"CLASS C",obstacles:"SKYSCRAPERS",wind:"CHANNELING",restricted:"YES"} },
  { id:"AV3000-017", name:"Flagstaff West", suburb:"Melbourne CBD", state:"VIC", lat:-37.8095, lng:144.9569, diff:"orange", jobs:["COMPLETE"], factors:{gps:"HIGH INTERFERENCE",airspace:"CLASS C",obstacles:"HIGH-RISE",wind:"CHANNELING",restricted:"YES"} },
  { id:"AV3000-027", name:"Southgate", suburb:"Southbank", state:"VIC", lat:-37.8200, lng:144.9649, diff:"orange", jobs:["CREATED"], factors:{gps:"HIGH INTERFERENCE",airspace:"CLASS C",obstacles:"HIGH-RISE + YARRA",wind:"RIVER + CHANNELING",restricted:"YES"} },
  { id:"AV3008-002", name:"Docklands", suburb:"Docklands", state:"VIC", lat:-37.8152, lng:144.9467, diff:"orange", jobs:["CREATED"], factors:{gps:"MARITIME MULTIPATH",airspace:"CLASS C",obstacles:"HIGH-RISE + CRANES",wind:"HARBOUR + CHANNELING",restricted:"YES - ETIHAD/MARVEL STADIUM"} },
  // === MELBOURNE INNER ===
  { id:"AV3002-002", name:"Fitzroy Gardens", suburb:"East Melbourne", state:"VIC", lat:-37.8155, lng:144.9866, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"PARK TREES + MEDIUM-RISE",wind:"MODERATE",restricted:"NO"} },
  { id:"AV3004-002", name:"Albert Park", suburb:"Albert Park", state:"VIC", lat:-37.8453, lng:144.9640, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"PARK + MEDIUM-RISE",wind:"MODERATE",restricted:"F1 RACE DAYS"} },
  { id:"AV3040-001", name:"Essendon", suburb:"Essendon", state:"VIC", lat:-37.7497, lng:144.9198, diff:"yellow", jobs:["CREATED"], factors:{gps:"MODERATE - AIRPORT",airspace:"CLASS D",obstacles:"RESIDENTIAL + ESSENDON AIRPORT",wind:"JET WASH",restricted:"YES - ESSENDON AIRPORT"} },
  { id:"AV3043-001", name:"Tullamarine", suburb:"Tullamarine", state:"VIC", lat:-37.7118, lng:144.8877, diff:"orange", jobs:["CREATED"], factors:{gps:"HIGH INTERFERENCE - AIRPORT",airspace:"CLASS C",obstacles:"AIRPORT PROXIMITY",wind:"JET WASH",restricted:"YES - MELB AIRPORT CTR"} },
  { id:"AV3046-001", name:"Glenroy", suburb:"Glenroy", state:"VIC", lat:-37.7056, lng:144.9290, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  { id:"AV3052-001", name:"Royal Melbourne Hospital", suburb:"Parkville", state:"VIC", lat:-37.7990, lng:144.9553, diff:"orange", jobs:["CREATED"], factors:{gps:"HIGH INTERFERENCE - HOSPITAL",airspace:"CLASS D",obstacles:"HOSPITAL + HELIPAD",wind:"MODERATE",restricted:"YES - HELIPAD"} },
  { id:"AV3056-001", name:"Brunswick South", suburb:"Brunswick South", state:"VIC", lat:-37.7770, lng:144.9621, diff:"yellow", jobs:["CREATED"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"MEDIUM-RISE",wind:"MODERATE",restricted:"NO"} },
  { id:"AV3065-002", name:"Fitzroy", suburb:"Fitzroy", state:"VIC", lat:-37.7980, lng:144.9770, diff:"yellow", jobs:["CREATED"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"MEDIUM-RISE",wind:"MODERATE",restricted:"NO"} },
  { id:"AV3121-006", name:"South Richmond", suburb:"Richmond", state:"VIC", lat:-37.8230, lng:145.0048, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"MEDIUM-RISE",wind:"MODERATE",restricted:"NO"} },
  { id:"AV3181-003", name:"South Yarra", suburb:"South Yarra", state:"VIC", lat:-37.8400, lng:144.9920, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"MEDIUM HIGH-RISE",wind:"MODERATE",restricted:"NO"} },
  { id:"AV3182-002", name:"St Kilda", suburb:"St Kilda", state:"VIC", lat:-37.8681, lng:144.9823, diff:"yellow", jobs:["CREATED"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"MEDIUM-RISE + EVENTS",wind:"BAY BREEZE",restricted:"EVENT DAYS"} },
  { id:"AV3182-005", name:"St Kilda West", suburb:"St Kilda West", state:"VIC", lat:-37.8669, lng:144.9683, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"MEDIUM-RISE COASTAL",wind:"BAY BREEZE",restricted:"NO"} },
  { id:"AV3184-001", name:"Elwood", suburb:"Elwood", state:"VIC", lat:-37.8807, lng:144.9887, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE COASTAL",wind:"BAY BREEZE",restricted:"NO"} },
  { id:"AV3187-001", name:"Mckinnon West", suburb:"McKinnon", state:"VIC", lat:-37.9063, lng:145.0364, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  { id:"AV3188-001", name:"Brighton Central", suburb:"Brighton", state:"VIC", lat:-37.9048, lng:145.0046, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE COASTAL",wind:"BAY BREEZE",restricted:"NO"} },
  { id:"AV3191-002", name:"Sandringham Hospital", suburb:"Sandringham", state:"VIC", lat:-37.9494, lng:145.0038, diff:"yellow", jobs:["CREATED"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"HOSPITAL + HELIPAD",wind:"BAY BREEZE",restricted:"YES - HELIPAD"} },
  { id:"AV3220-001", name:"Geelong", suburb:"Geelong", state:"VIC", lat:-38.1499, lng:144.3617, diff:"yellow", jobs:["CREATED"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"MEDIUM-RISE + HARBOUR",wind:"BAY WIND",restricted:"NO"} },
  // === PERTH ===
  { id:"AW6000-008", name:"Hay Street Central", suburb:"Perth CBD", state:"WA", lat:-31.9543, lng:115.8606, diff:"orange", jobs:["CREATED"], factors:{gps:"HIGH URBAN CANYON",airspace:"CLASS C",obstacles:"HIGH-RISE",wind:"FREMANTLE DOCTOR",restricted:"YES"} },
  { id:"AW6010-001", name:"Cottesloe East", suburb:"Cottesloe", state:"WA", lat:-31.9955, lng:115.7616, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE COASTAL",wind:"FREMANTLE DOCTOR - PREDICTABLE",restricted:"NO"} },
  { id:"AW6014-001", name:"Wembley", suburb:"Wembley", state:"WA", lat:-31.9333, lng:115.8174, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"FREMANTLE DOCTOR",restricted:"NO"} },
  { id:"AW6100-003", name:"Victoria Park Central", suburb:"Victoria Park", state:"WA", lat:-31.9785, lng:115.8863, diff:"yellow", jobs:["CREATED"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"MEDIUM-RISE + STADIUM",wind:"MODERATE",restricted:"EVENT DAYS"} },
  { id:"AW6151-001", name:"Narrows", suburb:"South Perth", state:"WA", lat:-31.9784, lng:115.8607, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"MODERATE - BRIDGE",airspace:"CLASS D",obstacles:"BRIDGE + HIGHWAY",wind:"RIVER WIND",restricted:"BRIDGE EXCLUSION"} },
  { id:"AW6154-001", name:"Booragoon", suburb:"Booragoon", state:"WA", lat:-32.0333, lng:115.8390, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"SHOPPING CENTRE",wind:"LIGHT",restricted:"NO"} },
  // === CANBERRA ===
  { id:"AC2601-002", name:"Civic", suburb:"Civic", state:"ACT", lat:-35.2777, lng:149.1317, diff:"yellow", jobs:["COMPLETE"], factors:{gps:"MODERATE",airspace:"CLASS C",obstacles:"MEDIUM-RISE CIVIC",wind:"MODERATE",restricted:"YES - PARLIAMENTARY ZONE"} },
  { id:"AC2601-003", name:"ANU", suburb:"Acton", state:"ACT", lat:-35.2797, lng:149.1181, diff:"yellow", jobs:["CREATED"], factors:{gps:"MODERATE",airspace:"CLASS C",obstacles:"UNIVERSITY CAMPUS",wind:"MODERATE",restricted:"YES"} },
  { id:"AC2607-001", name:"Torrens", suburb:"Torrens", state:"ACT", lat:-35.3753, lng:149.1012, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS D",obstacles:"LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  { id:"AC2912-002", name:"Ngunnawal", suburb:"Ngunnawal", state:"ACT", lat:-35.1761, lng:149.1073, diff:"green", jobs:["COMPLETE","CREATED"], factors:{gps:"LOW",airspace:"CLASS G",obstacles:"LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  // === HOBART ===
  { id:"AT7010-001", name:"Berriedale / Chigwell", suburb:"Berriedale", state:"TAS", lat:-42.8404, lng:147.2605, diff:"green", jobs:["COMPLETE","CREATED"], factors:{gps:"LOW",airspace:"CLASS G",obstacles:"LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  { id:"AT7011-001", name:"Austins Ferry", suburb:"Austins Ferry", state:"TAS", lat:-42.7644, lng:147.2530, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS G",obstacles:"LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  // === DARWIN ===
  { id:"AD800-001", name:"Darwin City", suburb:"Darwin CBD", state:"NT", lat:-12.4634, lng:130.8456, diff:"orange", jobs:["CREATED"], factors:{gps:"TROPICAL IONOSPHERE",airspace:"CLASS C",obstacles:"HIGH-RISE + HARBOUR",wind:"MONSOON SEASON",restricted:"YES - MILITARY PROXIMITY"} },
  { id:"AD810-001", name:"Casuarina Shopping Centre", suburb:"Casuarina", state:"NT", lat:-12.3778, lng:130.8741, diff:"yellow", jobs:["CREATED"], factors:{gps:"MODERATE - TROPICAL",airspace:"CLASS D",obstacles:"SHOPPING CENTRE",wind:"TROPICAL WIND",restricted:"NO"} },
  { id:"AD810-002", name:"Darwin Hospital", suburb:"Tiwi", state:"NT", lat:-12.3752, lng:130.8795, diff:"orange", jobs:["CREATED"], factors:{gps:"MODERATE - TROPICAL",airspace:"CLASS D",obstacles:"HOSPITAL + HELIPAD",wind:"TROPICAL WIND",restricted:"YES - HELIPAD"} },
  { id:"AD870-001", name:"Alice Springs Airport", suburb:"Alice Springs", state:"NT", lat:-23.8059, lng:133.9022, diff:"orange", jobs:["CREATED"], factors:{gps:"HIGH - AIRPORT",airspace:"CLASS D",obstacles:"AIRPORT",wind:"DUST + THERMAL TURBULENCE",restricted:"YES - AIRPORT"} },
  // === VIC COASTAL ===
  { id:"AV3925-001", name:"Phillip Island", suburb:"Phillip Island", state:"VIC", lat:-38.4849, lng:145.2285, diff:"orange", jobs:["CREATED","FAILED"], factors:{gps:"MODERATE - COASTAL",airspace:"CLASS G",obstacles:"NATURE PARK + COASTAL CLIFFS",wind:"VERY STRONG BASS STRAIT WINDS",restricted:"YES - WILDLIFE RESERVE"} },
  { id:"AV3351-001", name:"Lake Bolac North", suburb:"Lake Bolac", state:"VIC", lat:-37.7080, lng:142.8020, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS G",obstacles:"RURAL LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  // === NEWCASTLE ===
  { id:"AN2286-001", name:"Edgeworth", suburb:"Edgeworth", state:"NSW", lat:-32.9447, lng:151.6280, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS G",obstacles:"LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  { id:"AN2300-001", name:"Carrington", suburb:"Carrington", state:"NSW", lat:-32.9154, lng:151.7589, diff:"yellow", jobs:["CREATED"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"HARBOUR INDUSTRIAL",wind:"HARBOUR WIND",restricted:"NO"} },
  { id:"AN2304-001", name:"Mayfield West", suburb:"Mayfield West", state:"NSW", lat:-32.8971, lng:151.7273, diff:"yellow", jobs:["COMPLETE","FAILED"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"INDUSTRIAL + POWER STATION",wind:"MODERATE",restricted:"YES - INDUSTRIAL"} },
  // === WOLLONGONG ===
  { id:"AN2500-003", name:"Wollongong 2 Wilson Street", suburb:"Wollongong", state:"NSW", lat:-34.4278, lng:150.8929, diff:"yellow", jobs:["CREATED"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"MEDIUM-RISE + ESCARPMENT",wind:"ESCARPMENT WIND",restricted:"NO"} },
  { id:"AN2500-004", name:"Wollongong CBD", suburb:"Wollongong", state:"NSW", lat:-34.4244, lng:150.8939, diff:"yellow", jobs:["CREATED"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"MEDIUM-RISE + STEEL WORKS",wind:"ESCARPMENT + SEA BREEZE",restricted:"NO"} },
  { id:"AN2529-003", name:"Shellharbour City", suburb:"Shellharbour", state:"NSW", lat:-34.5762, lng:150.8697, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS G",obstacles:"LOW-RISE",wind:"SEA BREEZE",restricted:"NO"} },
  // === CENTRAL COAST ===
  { id:"AN2250-010", name:"Gosford CBD", suburb:"Gosford", state:"NSW", lat:-33.4279, lng:151.3414, diff:"yellow", jobs:["FAILED"], factors:{gps:"MODERATE",airspace:"CLASS D",obstacles:"MEDIUM-RISE + HILLS",wind:"MODERATE",restricted:"NO"} },
  { id:"AN2259-002", name:"Wyee", suburb:"Wyee", state:"NSW", lat:-33.1843, lng:151.5073, diff:"green", jobs:["COMPLETE","CREATED"], factors:{gps:"LOW",airspace:"CLASS G",obstacles:"RURAL LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  // === RURAL NSW ===
  { id:"AN2343-001", name:"Chilcotts Creek", suburb:"Chilcotts Creek", state:"NSW", lat:-29.9234, lng:152.3561, diff:"green", jobs:["COMPLETE"], factors:{gps:"LOW",airspace:"CLASS G",obstacles:"RURAL LOW-RISE",wind:"LIGHT",restricted:"NO"} },
  { id:"AN2390-001", name:"Narrabri", suburb:"Narrabri", state:"NSW", lat:-30.3227, lng:149.7795, diff:"green", jobs:["CREATED"], factors:{gps:"LOW",airspace:"CLASS G",obstacles:"RURAL LOW-RISE",wind:"LIGHT",restricted:"NO"} },
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