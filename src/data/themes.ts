export interface Theme {
  id: string;
  name: string;
  category: string;
  description?: string;
}

export const themes: Theme[] = [
  // Extensions IEEE 802.11
  { id: '802.11a',  name: '802.11a — WifiS',                              category: 'Extensions IEEE 802.11' },
  { id: '802.11b',  name: '802.11b — Wifi',                               category: 'Extensions IEEE 802.11' },
  { id: '802.11c',  name: '802.11c — Pontage 802.11 vers 802.1d',        category: 'Extensions IEEE 802.11' },
  { id: '802.11d',  name: '802.11d — Internationalisation',               category: 'Extensions IEEE 802.11' },
  { id: '802.11e',  name: '802.11e — Amélioration de la qualité de service', category: 'Extensions IEEE 802.11' },
  { id: '802.11f',  name: '802.11f — Itinérance (roaming)',               category: 'Extensions IEEE 802.11' },
  { id: '802.11g',  name: '802.11g',                                       category: 'Extensions IEEE 802.11' },
  { id: '802.11h',  name: '802.11h',                                       category: 'Extensions IEEE 802.11' },
  { id: '802.11i',  name: '802.11i',                                       category: 'Extensions IEEE 802.11' },
  { id: '802.11Ir', name: '802.11Ir',                                      category: 'Extensions IEEE 802.11' },
  { id: '802.11j',  name: '802.11j',                                       category: 'Extensions IEEE 802.11' },
];

export const categories = [
  'Extensions IEEE 802.11',
];
