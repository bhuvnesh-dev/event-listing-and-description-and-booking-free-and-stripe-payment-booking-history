import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-event-history',
  templateUrl: './event-history.page.html',
  styleUrls: ['./event-history.page.scss'],
})
export class EventHistoryPage implements OnInit {

  newDate = Date()
  history:any=[]

  constructor(
    private storage:Storage,
    private sanatizer:DomSanitizer,
    private navCtrl: NavController,
    private router:Router) {
    storage.create()
  }

  async ngOnInit() { 
    const paymentHistory = await this.storage.get("event-payment-history");
    this.history = paymentHistory;
    console.log(paymentHistory,"paymentHistory")
  }
  setItem(item:any){
    return this.sanatizer.bypassSecurityTrustHtml(item.slice(0,100))
  }
  handleRefresh(event:any) {
    setTimeout(() => {
      this.ngOnInit();
      event.target.complete()
    }, 2000)
  }

  goBack() {
    this.navCtrl.back();
  }
  gotoDetails(item:any){
    console.log(item,"item")
    // this.backendServices.getEventData().subscribe((res:any)=>{
    //   for(let i=0; i<res.data.candidate_event.length;i++){
    //     if(res.data.candidate_event[i].id.toString()===item.event_id){
    //       this.storage.set('selectedEvent',res.data.candidate_event[i]).then((res) =>{
    //         if(res){
    //           this.router.navigate(['event-details'])
    //         }
    //       })
    //     }
    //   }
    // })
  }
}
