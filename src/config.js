// Superhuman Earth Flight Configuration & Presets

export const LANDMARKS = [
  {
    id: 'nyc',
    name: 'New York City, USA',
    desc: 'Fly between Manhattan skyscrapers and over Times Square',
    lon: -73.9857,
    lat: 40.7484,
    alt: 450,
    heading: 45,
    pitch: -10,
    icon: '🗽'
  },
  {
    id: 'everest',
    name: 'Mount Everest, Himalayas',
    desc: 'The top of the world at 8,848 meters peak elevation',
    lon: 86.9250,
    lat: 27.9881,
    alt: 9500,
    heading: 350,
    pitch: -5,
    icon: '🗻'
  },
  {
    id: 'paris',
    name: 'Paris, France',
    desc: 'Soar past the Eiffel Tower and along the Seine River',
    lon: 2.2945,
    lat: 48.8584,
    alt: 350,
    heading: 60,
    pitch: -8,
    icon: '🗼'
  },
  {
    id: 'tokyo',
    name: 'Tokyo, Japan',
    desc: 'Dense neon metropolis, Shinjuku, and Tokyo Skytree',
    lon: 139.6917,
    lat: 35.6895,
    alt: 400,
    heading: 90,
    pitch: -10,
    icon: '⛩️'
  },
  {
    id: 'grandcanyon',
    name: 'Grand Canyon, Arizona',
    desc: 'Supersonic canyon runs through towering red rock gorges',
    lon: -112.1401,
    lat: 36.0544,
    alt: 2300,
    heading: 270,
    pitch: -15,
    icon: '🏜️'
  },
  {
    id: 'dubai',
    name: 'Dubai, UAE',
    desc: 'Dive past the Burj Khalifa and artificial palm islands',
    lon: 55.2744,
    lat: 25.1972,
    alt: 850,
    heading: 180,
    pitch: -12,
    icon: '🏙️'
  },
  {
    id: 'giza',
    name: 'Pyramids of Giza, Egypt',
    desc: 'Ancient wonders standing at the desert border',
    lon: 31.1342,
    lat: 29.9792,
    alt: 300,
    heading: 135,
    pitch: -10,
    icon: '🏛️'
  },
  {
    id: 'rio',
    name: 'Rio de Janeiro, Brazil',
    desc: 'Sugarloaf Mountain, Copacabana, and Christ the Redeemer',
    lon: -43.2105,
    lat: -22.9519,
    alt: 850,
    heading: 45,
    pitch: -10,
    icon: '🗿'
  },
  {
    id: 'sf',
    name: 'San Francisco, USA',
    desc: 'Golden Gate Bridge, coastal fog, and Pacific waters',
    lon: -122.4783,
    lat: 37.8199,
    alt: 300,
    heading: 210,
    pitch: -8,
    icon: '🌉'
  },
  {
    id: 'london',
    name: 'London, UK',
    desc: 'Thames river, Big Ben, and London Eye',
    lon: -0.1276,
    lat: 51.5074,
    alt: 350,
    heading: 80,
    pitch: -10,
    icon: '🇬🇧'
  },
  {
    id: 'sydney',
    name: 'Sydney, Australia',
    desc: 'Harbour Bridge and Opera House over the blue bay',
    lon: 151.2153,
    lat: -33.8568,
    alt: 300,
    heading: 30,
    pitch: -8,
    icon: '🇦🇺'
  },
  {
    id: 'space',
    name: 'Low Earth Orbit (120 km)',
    desc: 'Look down upon the blue marble and atmospheric rim',
    lon: -20.0,
    lat: 10.0,
    alt: 120000,
    heading: 90,
    pitch: 0,
    icon: '🌌'
  }
];

export const SPEED_PRESETS = [
  { key: '1', label: 'Hover', kmh: 30, mach: 0.02, desc: 'Precise sightseeing & hovering' },
  { key: '2', label: 'Cruise', kmh: 250, mach: 0.20, desc: 'City gliding speed' },
  { key: '3', label: 'Subsonic', kmh: 800, mach: 0.65, desc: 'Fast continental transit' },
  { key: '4', label: 'Mach 1', kmh: 1235, mach: 1.00, desc: 'Sound Barrier & Sonic Boom' },
  { key: '5', label: 'Mach 5', kmh: 6175, mach: 5.00, desc: 'Hypersonic flight' },
  { key: '6', label: 'Mach 10', kmh: 12350, mach: 10.00, desc: 'Plasma ionization trail' },
  { key: '0', label: 'Mach 20', kmh: 24700, mach: 20.00, desc: 'Superhuman Hypersonic God-Speed' }
];

export const ATMOSPHERE_LAYERS = [
  { name: 'Troposphere', maxAlt: 12000, color: '#38bdf8' },
  { name: 'Stratosphere', maxAlt: 50000, color: '#6366f1' },
  { name: 'Mesosphere', maxAlt: 85000, color: '#a855f7' },
  { name: 'Thermosphere / Space', maxAlt: 1000000, color: '#ec4899' }
];

