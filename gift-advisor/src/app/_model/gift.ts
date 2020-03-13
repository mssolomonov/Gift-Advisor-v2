import {User} from "./user";
import {Tag} from "./tag";

export class Gift {
  id: number;
  name: string;
  description: string;
  id_user: User;
  image_url: string;
  tags: Tag[];
  price: number;
  count: number;


  constructor(id: number, name: string, description: string, user: User, image: string, tags: Tag[], price: number) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.id_user = user;
    this.image_url = image;
    this.tags = tags;
    this.price = price;
  }
}
