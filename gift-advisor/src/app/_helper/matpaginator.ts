import { MatPaginator, MatPaginatorIntl } from '@angular/material';

export class CustomPaginator extends MatPaginatorIntl {
  constructor() {
    super();
    this.nextPageLabel = 'Gifts';
    this.previousPageLabel = 'Previous';
    this.itemsPerPageLabel = 'Gift';
  }

}
