export class Image {
  pending: boolean = false;
  status: string = 'init';
  src: string;
  constructor(src: string) { this.src = src;}
}
