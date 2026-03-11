import { Component, } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import moment from 'moment';
@Component({
  selector: 'ngx-order-history',
  templateUrl: 'order-history.html',
  styleUrls: ['order-history.scss'],
})
export class OrderHistoryComponent {
  historyData: Array<any>;
  moment: any = moment;
  constructor(protected ref: NbDialogRef<OrderHistoryComponent>) {
    // console.log(this.historyData)
  }

  cancel() {
    this.ref.close();
  }

  submit(name) {
    this.ref.close(name);
  }
}
