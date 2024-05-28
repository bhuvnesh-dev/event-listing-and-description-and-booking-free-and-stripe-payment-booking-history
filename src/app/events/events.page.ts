import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { IonModal } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import * as jsonData from '../../jsonData/eventData.json';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {

  events: any = []
  showData: boolean = false
  constructor(public modal: IonModal, 
    private router: Router, 
    private storage: Storage, 
    private sharing: SocialSharing, 
    private sanatizer: DomSanitizer
    ) {
    storage.create()
  }
  gotoHistory() {
    this.router.navigate(['event-history'])
  }
  gotoDetail(index: any) {
    this.storage.set('selectedEvent', this.events[index]).then(() => {
      this.router.navigate(['/event-details'])
    })
  }
  ngOnInit() {
    this.showData = false
    const jsonDataNew = JSON.stringify(jsonData);
    const eventData = JSON.parse(jsonDataNew);
    this.events = eventData.data.candidate_event;
    setTimeout(() => {
      this.showData = true;
    }, 3000);
  }
  handleRefresh(event:any) {
    setTimeout(() => {
      this.ngOnInit();
      event.target.complete()
    }, 2000)
  }
  shareEvent(item: any) {
    var options = {
      subject: item.title,
      message: `Share the Event '${item.title}' with your friends and families`,
      files: `https://pollcity.projectsofar.info/storage/candidate-events/${item.image}`,
      url: `https://pollcity.projectsofar.info/event/${item.id}`,
      chooserTitle: item.title,
    };
    console.log(options)
    this.sharing.shareWithOptions(options).then((response:any) => {
    })
  }
  setItems(item:any) {
    return this.sanatizer.bypassSecurityTrustHtml(item.slice(0, 200))
  }

}
