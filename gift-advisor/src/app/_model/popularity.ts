export class Popularity{
  id: number;
  gift_id: number;
  count: number;

  constructor(id: number, gift_id: number, count: number) {
    this.id = id;
    this.gift_id = gift_id;
    this.count = count;
  }
}
