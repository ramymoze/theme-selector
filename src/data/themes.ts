export interface Theme {
  id: string;
  name: string;
  category: string;
  description?: string;
}

export const themes: Theme[] = [
  // Gestion
  { id: 'gestion-0101', name: '0101 - Probe response (réponse d\'enquête)', category: 'Gestion' },
  { id: 'gestion-1000', name: '1000 - Beacon (balise)', category: 'Gestion' },

  // Contrôle
  { id: 'controle-1010', name: '1010 - Power Save (PS)-Poll (économie d\'énergie)', category: 'Contrôle' },
  { id: 'controle-1101', name: '1101 - ACK', category: 'Contrôle' },
  { id: 'controle-1110', name: '1110 - Contention Free (CF)-end', category: 'Contrôle' },
  { id: 'controle-1111', name: '1111 - CF-end + CF-ACK', category: 'Contrôle' },

  // Données
  { id: 'donnees-0000', name: '0000 - Data (données)', category: 'Données' },
  { id: 'donnees-0001', name: '0001 - Data (données) + CF-Ack', category: 'Données' },
  { id: 'donnees-0010', name: '0010 - Data (données) + CF-Poll', category: 'Données' },
  { id: 'donnees-0011', name: '0011 - Data (données) + CF-Ack+CF-Poll', category: 'Données' },
  { id: 'donnees-0100', name: '0100 - Null function (no Data (données))', category: 'Données' },
  { id: 'donnees-0101', name: '0101 - CF-Ack', category: 'Données' },
  { id: 'donnees-0110', name: '0110 - CF-Poll', category: 'Données' },
];

export const categories = [
  'Gestion',
  'Contrôle',
  'Données',
];
