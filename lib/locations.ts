// Location dataset for TAARi — focused on the African Diaspora's primary cities.
// Countries, their states/provinces/regions, and major cities within each.

export interface CountryData {
  name: string;
  code: string;
  states: { name: string; cities: string[] }[];
}

export const COUNTRIES: CountryData[] = [
  {
    name: 'United States',
    code: 'US',
    states: [
      { name: 'Alabama', cities: ['Birmingham', 'Montgomery', 'Mobile', 'Huntsville'] },
      { name: 'California', cities: ['Los Angeles', 'San Francisco', 'Oakland', 'San Diego', 'Sacramento'] },
      { name: 'Florida', cities: ['Miami', 'Jacksonville', 'Orlando', 'Tampa', 'Tallahassee'] },
      { name: 'Georgia', cities: ['Atlanta', 'Savannah', 'Augusta', 'Macon', 'Columbus'] },
      { name: 'Illinois', cities: ['Chicago', 'Springfield', 'Rockford', 'Peoria'] },
      { name: 'Louisiana', cities: ['New Orleans', 'Baton Rouge', 'Shreveport', 'Lafayette'] },
      { name: 'Maryland', cities: ['Baltimore', 'Silver Spring', 'Columbia', 'Annapolis'] },
      { name: 'Massachusetts', cities: ['Boston', 'Cambridge', 'Worcester', 'Springfield'] },
      { name: 'Michigan', cities: ['Detroit', 'Grand Rapids', 'Lansing', 'Ann Arbor'] },
      { name: 'Minnesota', cities: ['Minneapolis', 'Saint Paul', 'Rochester'] },
      { name: 'New Jersey', cities: ['Newark', 'Jersey City', 'Paterson', 'Trenton'] },
      { name: 'New York', cities: ['New York City', 'Buffalo', 'Rochester', 'Albany', 'Syracuse'] },
      { name: 'North Carolina', cities: ['Charlotte', 'Raleigh', 'Durham', 'Greensboro'] },
      { name: 'Ohio', cities: ['Columbus', 'Cleveland', 'Cincinnati', 'Dayton'] },
      { name: 'Pennsylvania', cities: ['Philadelphia', 'Pittsburgh', 'Harrisburg', 'Allentown', 'Erie'] },
      { name: 'South Carolina', cities: ['Charleston', 'Columbia', 'Greenville'] },
      { name: 'Tennessee', cities: ['Nashville', 'Memphis', 'Knoxville', 'Chattanooga'] },
      { name: 'Texas', cities: ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth'] },
      { name: 'Virginia', cities: ['Richmond', 'Virginia Beach', 'Norfolk', 'Arlington'] },
      { name: 'Washington', cities: ['Seattle', 'Tacoma', 'Spokane', 'Bellevue'] },
      { name: 'Washington D.C.', cities: ['Washington'] },
    ],
  },
  {
    name: 'Canada',
    code: 'CA',
    states: [
      { name: 'Alberta', cities: ['Calgary', 'Edmonton', 'Red Deer'] },
      { name: 'British Columbia', cities: ['Vancouver', 'Victoria', 'Surrey', 'Burnaby'] },
      { name: 'Manitoba', cities: ['Winnipeg', 'Brandon'] },
      { name: 'Nova Scotia', cities: ['Halifax', 'Dartmouth'] },
      { name: 'Ontario', cities: ['Toronto', 'Ottawa', 'Mississauga', 'Brampton', 'Hamilton', 'London'] },
      { name: 'Quebec', cities: ['Montreal', 'Quebec City', 'Laval', 'Gatineau'] },
      { name: 'Saskatchewan', cities: ['Saskatoon', 'Regina'] },
    ],
  },
  {
    name: 'United Kingdom',
    code: 'GB',
    states: [
      { name: 'England', cities: ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds', 'Bristol', 'Nottingham', 'Sheffield'] },
      { name: 'Scotland', cities: ['Edinburgh', 'Glasgow', 'Aberdeen', 'Dundee'] },
      { name: 'Wales', cities: ['Cardiff', 'Swansea', 'Newport'] },
      { name: 'Northern Ireland', cities: ['Belfast', 'Derry'] },
    ],
  },
  {
    name: 'Nigeria',
    code: 'NG',
    states: [
      { name: 'Abuja (FCT)', cities: ['Abuja', 'Gwagwalada'] },
      { name: 'Abia', cities: ['Umuahia', 'Aba'] },
      { name: 'Anambra', cities: ['Awka', 'Onitsha', 'Nnewi'] },
      { name: 'Cross River', cities: ['Calabar', 'Ikom'] },
      { name: 'Delta', cities: ['Asaba', 'Warri', 'Sapele'] },
      { name: 'Edo', cities: ['Benin City', 'Auchi'] },
      { name: 'Enugu', cities: ['Enugu', 'Nsukka'] },
      { name: 'Kaduna', cities: ['Kaduna', 'Zaria'] },
      { name: 'Kano', cities: ['Kano'] },
      { name: 'Lagos', cities: ['Lagos', 'Ikeja', 'Lekki', 'Victoria Island', 'Surulere'] },
      { name: 'Ogun', cities: ['Abeokuta', 'Sagamu', 'Ijebu Ode'] },
      { name: 'Oyo', cities: ['Ibadan', 'Ogbomoso'] },
      { name: 'Rivers', cities: ['Port Harcourt', 'Obio-Akpor'] },
    ],
  },
  {
    name: 'Ghana',
    code: 'GH',
    states: [
      { name: 'Greater Accra', cities: ['Accra', 'Tema', 'Madina'] },
      { name: 'Ashanti', cities: ['Kumasi', 'Obuasi'] },
      { name: 'Central', cities: ['Cape Coast', 'Kasoa'] },
      { name: 'Eastern', cities: ['Koforidua', 'Nkawkaw'] },
      { name: 'Northern', cities: ['Tamale', 'Yendi'] },
      { name: 'Western', cities: ['Takoradi', 'Sekondi'] },
    ],
  },
  {
    name: 'Kenya',
    code: 'KE',
    states: [
      { name: 'Nairobi', cities: ['Nairobi'] },
      { name: 'Mombasa', cities: ['Mombasa'] },
      { name: 'Kisumu', cities: ['Kisumu'] },
      { name: 'Nakuru', cities: ['Nakuru'] },
      { name: 'Kiambu', cities: ['Thika', 'Ruiru'] },
      { name: 'Uasin Gishu', cities: ['Eldoret'] },
    ],
  },
  {
    name: 'South Africa',
    code: 'ZA',
    states: [
      { name: 'Gauteng', cities: ['Johannesburg', 'Pretoria', 'Soweto'] },
      { name: 'Western Cape', cities: ['Cape Town', 'Stellenbosch'] },
      { name: 'KwaZulu-Natal', cities: ['Durban', 'Pietermaritzburg'] },
      { name: 'Eastern Cape', cities: ['Port Elizabeth', 'East London'] },
      { name: 'Free State', cities: ['Bloemfontein'] },
    ],
  },
  {
    name: 'Ethiopia',
    code: 'ET',
    states: [
      { name: 'Addis Ababa', cities: ['Addis Ababa'] },
      { name: 'Oromia', cities: ['Adama', 'Jimma'] },
      { name: 'Amhara', cities: ['Bahir Dar', 'Gondar'] },
      { name: 'Tigray', cities: ['Mekelle'] },
    ],
  },
  {
    name: 'France',
    code: 'FR',
    states: [
      { name: 'Île-de-France', cities: ['Paris', 'Versailles', 'Saint-Denis'] },
      { name: 'Provence-Alpes-Côte d\'Azur', cities: ['Marseille', 'Nice', 'Cannes'] },
      { name: 'Auvergne-Rhône-Alpes', cities: ['Lyon', 'Grenoble'] },
      { name: 'Occitanie', cities: ['Toulouse', 'Montpellier'] },
    ],
  },
  {
    name: 'Germany',
    code: 'DE',
    states: [
      { name: 'Berlin', cities: ['Berlin'] },
      { name: 'Bavaria', cities: ['Munich', 'Nuremberg'] },
      { name: 'Hamburg', cities: ['Hamburg'] },
      { name: 'Hesse', cities: ['Frankfurt', 'Wiesbaden'] },
      { name: 'North Rhine-Westphalia', cities: ['Cologne', 'Düsseldorf', 'Dortmund'] },
    ],
  },
];

export function getStatesForCountry(countryName: string): string[] {
  const country = COUNTRIES.find((c) => c.name === countryName);
  return country ? country.states.map((s) => s.name) : [];
}

export function getCitiesForState(countryName: string, stateName: string): string[] {
  const country = COUNTRIES.find((c) => c.name === countryName);
  if (!country) return [];
  const state = country.states.find((s) => s.name === stateName);
  return state ? state.cities : [];
}
