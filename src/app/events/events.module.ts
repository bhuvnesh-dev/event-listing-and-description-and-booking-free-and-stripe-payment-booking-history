import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonModal, IonicModule } from '@ionic/angular';

import { EventsPageRoutingModule } from './events-routing.module';

import { EventsPage } from './events.page';
import { SocialSharing } from '@ionic-native/social-sharing';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventsPageRoutingModule,
  ],
  declarations: [EventsPage],
  providers: [IonModal, SocialSharing],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EventsPageModule {}
