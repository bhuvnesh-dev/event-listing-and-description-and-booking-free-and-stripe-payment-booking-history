import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventHistoryPage } from './event-history.page';

const routes: Routes = [
  {
    path: '',
    component: EventHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventHistoryPageRoutingModule {}
