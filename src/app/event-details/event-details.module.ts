import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventDetailsPageRoutingModule } from './event-details-routing.module';

import { EventDetailsPage } from './event-details.page';
import { Storage } from '@ionic/storage-angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventDetailsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EventDetailsPage],
  providers: [Storage]
})
export class EventDetailsPageModule {}
