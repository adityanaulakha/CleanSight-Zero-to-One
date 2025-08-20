// Location data structure for India - State > District > Zone > Areas mapping
export const locationData = {
  "Delhi": {
    "New Delhi": {
      zones: {
        "Connaught Place Zone": {
          areas: ["Connaught Place", "Janpath", "Barakhamba Road", "Tolstoy Marg", "Sansad Marg"]
        },
        "India Gate Zone": {
          areas: ["India Gate", "Rajpath", "Teen Murti", "Safdarjung Tomb", "Lodhi Gardens"]
        }, 
        "Rajpath Zone": {
          areas: ["Rajpath", "Rashtrapati Bhavan", "North Block", "South Block", "Vijay Chowk"]
        },
        "Central Delhi Zone": {
          areas: ["Karol Bagh", "Paharganj", "Daryaganj", "Chandni Chowk", "Red Fort Area"]
        }
      }
    },
    "North Delhi": {
      zones: {
        "Civil Lines Zone": {
          areas: ["Civil Lines", "Mall Road", "Kamla Nagar", "Maurice Nagar", "Shakti Nagar"]
        },
        "Model Town Zone": {
          areas: ["Model Town", "Azadpur", "Shalimar Bagh", "Pitampura", "Kohat Enclave"]
        },
        "GTB Nagar Zone": {
          areas: ["GTB Nagar", "Vijay Nagar", "Timarpur", "Shastri Nagar", "Burari"]
        },
        "Kamla Nagar Zone": {
          areas: ["Kamla Nagar", "Pratap Nagar", "Roop Nagar", "Jawahar Nagar", "Gulabi Bagh"]
        }
      }
    },
    "South Delhi": {
      zones: {
        "Hauz Khas Zone": {
          areas: ["Hauz Khas", "Green Park", "Safdarjung", "Aurobindo Marg", "IIT Delhi Area"]
        },
        "Lajpat Nagar Zone": {
          areas: ["Lajpat Nagar", "Andrews Ganj", "Jangpura", "Bhogal", "Nizamuddin"]
        },
        "Greater Kailash Zone": {
          areas: ["Greater Kailash I", "Greater Kailash II", "Kailash Colony", "C R Park", "Nehru Place"]
        },
        "Vasant Kunj Zone": {
          areas: ["Vasant Kunj", "Vasant Vihar", "Munirka", "JNU Area", "Arjun Nagar"]
        }
      }
    },
    "East Delhi": {
      zones: {
        "Laxmi Nagar Zone": {
          areas: ["Laxmi Nagar", "Shakarpur", "Krishna Nagar", "Geeta Colony", "Pandav Nagar"]
        },
        "Preet Vihar Zone": {
          areas: ["Preet Vihar", "Vikas Marg", "Nirman Vihar", "Laxmi Nagar Metro", "Karkardooma"]
        },
        "Mayur Vihar Zone": {
          areas: ["Mayur Vihar Phase I", "Mayur Vihar Phase II", "Mayur Vihar Phase III", "Trilokpuri", "Kondli"]
        },
        "Patparganj Zone": {
          areas: ["Patparganj", "IP Extension", "Mandawali", "Fazalpur", "New Ashok Nagar"]
        }
      }
    },
    "West Delhi": {
      zones: {
        "Janakpuri Zone": {
          areas: ["Janakpuri", "Hari Nagar", "Subhash Nagar", "Rajouri Garden", "Tagore Garden"]
        },
        "Rajouri Garden Zone": {
          areas: ["Rajouri Garden", "Ramesh Nagar", "Moti Nagar", "Kirti Nagar", "East Patel Nagar"]
        },
        "Tilak Nagar Zone": {
          areas: ["Tilak Nagar", "Janakpuri East", "Subhash Nagar", "Jail Road", "Raghubir Nagar"]
        },
        "Uttam Nagar Zone": {
          areas: ["Uttam Nagar", "Dwarka Mor", "Bindapur", "Palam", "Mahavir Enclave"]
        }
      }
    }
  },
  "Maharashtra": {
    "Mumbai": {
      zones: {
        "Bandra Zone": {
          areas: ["Bandra West", "Bandra East", "Khar", "Santa Cruz West", "Linking Road"]
        },
        "Andheri Zone": {
          areas: ["Andheri West", "Andheri East", "Jogeshwari", "Versova", "DN Nagar"]
        },
        "Borivali Zone": {
          areas: ["Borivali West", "Borivali East", "Kandivali", "Malad", "Goregaon"]
        },
        "Colaba Zone": {
          areas: ["Colaba", "Fort", "Nariman Point", "Churchgate", "Marine Drive"]
        },
        "Dadar Zone": {
          areas: ["Dadar East", "Dadar West", "Prabhadevi", "Lower Parel", "Matunga"]
        },
        "Juhu Zone": {
          areas: ["Juhu", "Vile Parle", "Santacruz", "Khar", "JVPD"]
        }
      }
    },
    "Pune": {
      zones: {
        "Kothrud Zone": {
          areas: ["Kothrud", "Karve Road", "Law College Road", "Erandwane", "Paud Road"]
        },
        "Hinjewadi Zone": {
          areas: ["Hinjewadi Phase 1", "Hinjewadi Phase 2", "Hinjewadi Phase 3", "Wakad", "Baner"]
        },
        "Baner Zone": {
          areas: ["Baner", "Aundh", "Balewadi", "Sus", "Pashan"]
        },
        "Shivaji Nagar Zone": {
          areas: ["Shivaji Nagar", "JM Road", "FC Road", "Camp", "Deccan"]
        }
      }
    }
  }
};

// Helper functions to get location data
export const getStates = () => {
  return Object.keys(locationData);
};

export const getDistricts = (state) => {
  if (!state || !locationData[state]) return [];
  return Object.keys(locationData[state]);
};

export const getZones = (state, district) => {
  if (!state || !district || !locationData[state] || !locationData[state][district]) return [];
  return Object.keys(locationData[state][district].zones);
};

export const getAreas = (state, district, zone) => {
  if (!state || !district || !zone || 
      !locationData[state] || 
      !locationData[state][district] || 
      !locationData[state][district].zones ||
      !locationData[state][district].zones[zone]) return [];
  return locationData[state][district].zones[zone].areas;
};

export const getFullLocationString = (state, district, zone, area = null) => {
  if (area) {
    return `${area}, ${zone}, ${district}, ${state}`;
  }
  return `${zone}, ${district}, ${state}`;
};
