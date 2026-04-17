export interface Image {
  id: string;
  url: string;
  downloadUrl: string;
  thumbnailUrl: string;
  title: string;
  author: string;
  isPremium: boolean;
  width: number;
  height: number;
}

export type Category = 'All' | 'Cars' | 'Anime' | 'Nature' | 'Architecture' | 'Technology' | 'Abstract';
