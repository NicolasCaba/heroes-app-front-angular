export interface Heroe {
  _id?: string;
  id?: string;
  superhero: string;
  publisher: Publisher;
  alter_ego: string;
  first_appearance: string;
  characters: string;
  image_id: string;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
  image: Image;
}

export interface Image {
  _id?: string;
  url: string;
  filename: string;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

export enum Publisher {
  DCComics = "DC Comics",
  MarvelComics = "Marvel Comics",
}