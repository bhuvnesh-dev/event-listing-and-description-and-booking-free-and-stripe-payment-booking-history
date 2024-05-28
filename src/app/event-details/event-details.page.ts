import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import * as jsonData from '../../jsonData/eventData.json';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.page.html',
  styleUrls: ['./event-details.page.scss'],
})
export class EventDetailsPage implements OnInit {

  enableBackdropDismiss = false;
  eventPaymentForm= new FormGroup({
    name: new FormControl('',[ Validators.required, Validators.minLength(2)]),
    email: new FormControl('',[ Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$'), Validators.email]),
    amount: new FormControl('',[Validators.required, Validators.pattern('^[0-9]+$')]),
    number: new FormControl('',[Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(10)]),
    card_expiry: new FormControl('',[Validators.required]),
    cvc: new FormControl('',[Validators.required, Validators.minLength(3),Validators.pattern('^[0-9]+$')])});
  publish_key: string = 'pk_test_51Mw6DRLTx6WwymGQKQpF2GbMfECbCCDRqBcib3udlEWtQjEm4Ms6kWf5FvEQar8Xr6eWczIDmZwg3ZPL5ptNrkTF00UXCGUaFQ';
  selectItems: boolean = false;
  paymentModal: boolean = false;
  toastIsOpen: boolean = true;
  spinner: boolean = false;
  message: any = '';
  color: any = '';
  quantity: any = 1;
  totalQuantity: any = 0;
  data: any = {}
  user: any = {
    name: 'Peter',
    time: '1 week ago',
    comment: '',
    image: "../../assets/icon/news/peter.png",
    liked: true,
  }
  comments: any = {}
  presentingElement = undefined;
  commentsModal: boolean = false;
  showLoginPopup: boolean = false;
  commentsForm = new FormGroup({
    comment: new FormControl(''),
    name: new FormControl('Peter'),
    time: new FormControl('1 week ago'),
    image: new FormControl("../../assets/icon/news/peter.png"),
    liked: new FormControl(false)
  });
  constructor(
    private navCtrl: NavController,
    private storage: Storage,
    private formBuilder: FormBuilder,
    private platform: Platform,
    private sanatizer: DomSanitizer,
    private alertController: AlertController,
    private router: Router,
  ) {
    storage.create()
  }
  setLikePost(value: any, index: number) {
  }
  meals: any = [];
  chooseMeals: any = []
  ngOnInit() {
    if (this.paymentModal) {
      this.platform.backButton.subscribeWithPriority(10, () => {
        document.addEventListener('backbutton', () => { }, false);
      })
    }
    if (this.selectItems) {
      this.platform.backButton.subscribeWithPriority(10, () => {
        document.addEventListener('backbutton', () => { }, false);
      })
    }
    this.storage.get('selectedEvent').then((response:any) => {
      response.event_date = response.event_date.slice(0, 10)
      this.data = response;
      this.comments = response.comments;
      const meal = response.event_meal.split(",")
      for (let i = 0; i < meal.length; i++) {
        if(meal[i] !=="Null"){

          let data = { meal: meal[i], quantity: 0 };
          this.meals.push(data)
        }
      }
      console.log(response)
    })
    this.storage.get('selectedEventId').then((id:any) => {
    })

    const content = document.querySelector('#content')
    let data = null;
    this.eventPaymentForm.get('name')?.setValue(`User Name`);
    this.eventPaymentForm.get('email')?.setValue("User Email")
    this.eventPaymentForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      amount: ['', [Validators.required]],
      number: ['', [Validators.required]],
      card_expiry: ['', [Validators.required]],
      cvc: ['', [Validators.required]],
    })

  }
  setHtml(html: any) {
    return this.sanatizer.bypassSecurityTrustHtml(html)
  }
  onComment() {
    this.comments = [...this.comments, this.commentsForm.value];
  }
  goBack() {
    this.navCtrl.back();
  }
  handleCommentLike(value: any, index: number) {
    this.comments[index].liked = value;
  }
  closeModal() {
    this.commentsModal = false;
    this.paymentModal = false;
  }
  closeCheckout() {
    this.selectItems = false;
    this.platform.backButton.subscribeWithPriority(10, () => {
      document.addEventListener('backbutton', () => { }, true);
    })
  }
  openModal() {
    this.commentsModal = true;
  }
  handleLike(value: boolean) {
    this.data.liked = !value;
    this.storage.set('currentNews', this.data).then(() => {
      this.ngOnInit();
    })
  }
  handleTicket(type: string) {
    if (type === 'add' && this.quantity != 10) {
      this.quantity = this.quantity + 1
    }
    if (type === 'sub' && this.quantity != 1) {
      this.quantity = this.quantity - 1
    }
  }
  decreaseQuantity(index:any) {
    if (this.totalQuantity >= 0) {
      if (this.meals[index].quantity != 0) {
        this.totalQuantity = this.totalQuantity - 1
        this.meals[index].quantity = this.meals[index].quantity - 1
        this.chooseMeals.length = this.meals[index].quantity
      }
    }
  }
  increaseQuantity(index:any) {
    if (this.totalQuantity < this.quantity) {
      if (this.meals[index].quantity != 10) {
        this.totalQuantity = this.totalQuantity + 1
        this.meals[index].quantity = this.meals[index].quantity + 1
        this.chooseMeals.length = this.meals[index].quantity
      }
    }
  }
  async submitDonation() {
    this.spinner = true;
    this.toastIsOpen = false;
    if (this.eventPaymentForm.invalid) {
      this.message = "Please fill the correct card details"
      this.color = "danger"
      setTimeout(() => {
        this.toastIsOpen = true;
        this.spinner = false
      }, 1000)
    } else {
      const data = {
        user_id: 123,
        name: this.eventPaymentForm.value.name,
        amount: this.eventPaymentForm.value.amount,
        number: this.eventPaymentForm.value.number,
        exp_month: this.eventPaymentForm.value.card_expiry?.slice(5, 7),
        exp_year: this.eventPaymentForm.value.card_expiry?.slice(0, 4),
        cvc: this.eventPaymentForm.value.cvc,
        description: "Event Payment.",
        event_meal: this.meals,
        ticket_num: this.quantity,
        event_id: this.data.id,
        event_date: this.data.event_date,
        email: this.eventPaymentForm.value.email,
        event_description: this.data.description,
        event_time: this.data.event_reception_time,
        event_title: this.data.event_title,
        payment_status: "succeeded",
        created_at: new Date(),
      }
      console.log(data,"data")
      const checkPaymentHistory = await this.storage.get("event-payment-history");
      if(!checkPaymentHistory){
        await this.storage.set("event-payment-history",[data]);
      } else {
        await this.storage.set("event-payment-history",[...checkPaymentHistory,data]);
      }
      
      this.message = "Payment Successfull!";
      this.color = 'success';
      setTimeout(() => {
        this.spinner = false
        this.toastIsOpen = true
        this.paymentModal = false;
        this.selectItems = false;
        this.eventPaymentForm.reset()
      }, 2000)
      }
    this.platform.backButton.subscribeWithPriority(10, () => {
      document.addEventListener('backbutton', () => { }, true);
    })
  }
  async showAlert() {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Select a valid option',
      message: 'You need to select a valid field for this pole!',
      buttons: ['OK'],
    });
    alert.present()
  }
  selectMeals() {
    this.selectItems = true
    this.platform.backButton.subscribeWithPriority(10, () => {
      document.addEventListener('backbutton', () => { }, false);
    })
  }
  checkout() {
    this.handleDonation()
  }
  handleDonation() {
    const value = this.quantity * this.data.event_amount;
    this.eventPaymentForm.get('amount')?.setValue(`${value}`)
    this.paymentModal = true
    
  }
}
