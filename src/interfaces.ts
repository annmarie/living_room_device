export interface HubData {
  name: string;
  components: Collection[];
  artwork: {
    'detail.horizontal.hero': Artwork;
  };
}

export interface Collection {
  id: string;
  name: string;
  items: Item[];
}

export interface Artwork {
  path: string;
  accent: {
    hue: number;
  };
}

export interface Item {
  id: string;
  name: string;
  entity_metadata: {
    genre_names: string[];
  };
  visuals: {
    headline: string;
    subtitle: string;
    body: string;
    action_text: string;
    artwork: {
      horizontal_tile: {
        image: { path: string, text: string };
      };
      vertical_tile: {
        image: { path: string, text: string };
      };
    };
  };
}
