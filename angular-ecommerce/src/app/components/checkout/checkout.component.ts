import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ECommerceFormService } from '../../services/e-commerce-form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { ValidatorsForm } from '../../validators/validators-form';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { Router } from '@angular/router';
import { Order } from '../../common/order';
import { OrderItem } from '../../common/order-item';
import { Purchase } from '../../common/purchase';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit{
  checkoutFormGroup!:FormGroup;
  totalPrice:number=0.00;
  totalQuantity:number=0;
  creditCardYears!:number[];
  creditCardMonths!:number[];
  countries:Country[]=[];
  shippingAddressStates:State[]=[];
  billingAddressStates:State[]=[];
  constructor(private formBuilder:FormBuilder,private eCommerceForm:ECommerceFormService,private cartService:CartService,private checkoutService:CheckoutService,private router:Router){}

  ngOnInit(){

    this.checkoutFormGroup=this.formBuilder.group({
      customer:this.formBuilder.group({
        firstName:new FormControl('',[Validators.required,Validators.minLength(2),ValidatorsForm.notOnlyWhitespace]),
        lastName:new FormControl('',[Validators.required,Validators.minLength(2),ValidatorsForm.notOnlyWhitespace]),
        email:new FormControl('',[Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),ValidatorsForm.notOnlyWhitespace])
      }),
      shippingAddress:this.formBuilder.group({
        street:new FormControl('',[Validators.required,Validators.minLength(2),ValidatorsForm.notOnlyWhitespace]),
        city:new FormControl('',[Validators.required,Validators.minLength(2),ValidatorsForm.notOnlyWhitespace]),
        state:new FormControl('',[Validators.required]),
        country:new FormControl('',[Validators.required]),
        zipCode:new FormControl('',[Validators.required,Validators.pattern('[0-9]{6}'),ValidatorsForm.notOnlyWhitespace])
      }),
      billingAddress:this.formBuilder.group({
        street:new FormControl('',[Validators.required,Validators.minLength(2),ValidatorsForm.notOnlyWhitespace]),
        city:new FormControl('',[Validators.required,Validators.minLength(2),ValidatorsForm.notOnlyWhitespace]),
        state:new FormControl('',[Validators.required]),
        country:new FormControl('',[Validators.required]),
        zipCode:new FormControl('',[Validators.required,Validators.pattern('[0-9]{6}'),ValidatorsForm.notOnlyWhitespace])
      }),
      creditCard:this.formBuilder.group({
        cardType:new FormControl('',[Validators.required]),
        nameOnCard:new FormControl('',[Validators.required,Validators.minLength(5),ValidatorsForm.notOnlyWhitespace]),
        cardNumber:new FormControl('',[Validators.required,Validators.pattern('[0-9]{16}'),ValidatorsForm.notOnlyWhitespace]),
        securityCode:new FormControl('',[Validators.required,Validators.pattern('[0-9]{3}'),ValidatorsForm.notOnlyWhitespace]),
        expirationMonth:new FormControl('',[Validators.required,Validators.maxLength(2),Validators.minLength(1)]),
        expirationYear:new FormControl('',[Validators.required,Validators.maxLength(4),Validators.minLength(4)])
      })
    });
    this.eCommerceForm.getCreditCardMonths(new Date().getMonth()+1).subscribe(
      data=>{
        console.log("Retrieved Credit Card Months : "+JSON.stringify(data));
        this.creditCardMonths=data;
      }
    );

    this.eCommerceForm.getCreditCardYears().subscribe(
      data=>{
        console.log("Retrieved Credit Card Years : "+JSON.stringify(data));
        this.creditCardYears=data;
      }
    );

    this.eCommerceForm.getCountries().subscribe(
      data=>this.countries=data
    );
    this.reviewCartDetails();
  }
  reviewCartDetails(){
    this.cartService.totalPrice.subscribe(data=>this.totalPrice=data);
    console.log(this.totalPrice);
    this.cartService.totalQuantity.subscribe(data=>this.totalQuantity=data);
  }
  getStates(address:string){
    const country:Country=this.checkoutFormGroup.controls[address].get('country')?.value;
    this.eCommerceForm.getStates(country.code).subscribe(data=>{
      if(address==='shippingAddress'){
        this.shippingAddressStates=data;
      }else{
        this.billingAddressStates=data;
      }
    });
  }
  onSubmit(){
    console.log("Handling the submit button");
    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    //set up order
    let order=new Order();
    order.totalPrice=this.totalPrice;
    order.totalQuantity=this.totalQuantity;
    //get cart items
    const cartItems=this.cartService.cartItems;
    //create orderItems from cartItems
    let orderItems:OrderItem[]=cartItems.map(tempCartItem=>new OrderItem(tempCartItem));
    //set up purchase
    let purchase=new Purchase();
    //populate purchase - customer
    purchase.customer=this.checkoutFormGroup.controls['customer'].value;
    //populate purchase - shipping address
    purchase.shippingAddress=this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState:State=JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry:Country=JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state=shippingState.name;
    purchase.shippingAddress.country=shippingCountry.name;
    //populate purchase - billing address
    purchase.billingAddress=this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState:State=JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry:Country=JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state=billingState.name;
    purchase.billingAddress.country=billingCountry.name;
    //populate purchase -  order and orderItems
    purchase.order=order;
    purchase.orderItems=orderItems;
    //call Rest API via the CheckoutService
    this.checkoutService.placeOrder(purchase).subscribe(
      {
        next: response=>{
          alert(`Your Order has been received.\n Order tracking number: ${response.orderTrackingNumber}`);

          //reset cart
          this.resetCart();
        },
        error: err=>{
          alert(`There was an error: ${err.message}`);
        }
      }
    )
  }
  resetCart(){
    //reset cart data
    this.cartService.cartItems=[];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    //reset the form
    this.checkoutFormGroup.reset();

    //navigate back to the products page
    this.router.navigateByUrl("/products");
  }
  copyShippingAddressToBillingAddress(event:any) {
    if(event.target.checked){
      this.checkoutFormGroup.controls['billingAddress'].patchValue(this.checkoutFormGroup.controls['shippingAddress'].value);
      this.billingAddressStates=this.shippingAddressStates;
    }
    else{
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddressStates=[];
    }
  }

  get firstName(){
    return this.checkoutFormGroup.get('customer.firstName');
  }

  get lastName(){
    return this.checkoutFormGroup.get('customer.lastName');
  }

  get email(){
    return this.checkoutFormGroup.get('customer.email');
  }
  get shippingAddressCountry(){
    return this.checkoutFormGroup.get('shippingAddress.country');
  }
  get shippingAddressStreet(){
    return this.checkoutFormGroup.get('shippingAddress.street');
  }
  get shippingAddressCity(){
    return this.checkoutFormGroup.get('shippingAddress.city');
  }
  get shippingAddressState(){
    return this.checkoutFormGroup.get('shippingAddress.state');
  }
  get shippingAddressZipCode(){
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }
  get billingAddressCountry(){
    return this.checkoutFormGroup.get('billingAddress.country');
  }
  get billingAddressStreet(){
    return this.checkoutFormGroup.get('billingAddress.street');
  }
  get billingAddressCity(){
    return this.checkoutFormGroup.get('billingAddress.city');
  }
  get billingAddressState(){
    return this.checkoutFormGroup.get('billingAddress.state');
  }
  get billingAddressZipCode(){
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }
  get cardType(){
    return this.checkoutFormGroup.get('creditCard.cardType');
  }
  get nameOnCard(){
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }
  get cardNumber(){
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }
  get securityCode(){
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }
  get expirationMonth(){
    return this.checkoutFormGroup.get('creditCard.expirationMonth');
  }
  get expirationYear(){
    return this.checkoutFormGroup.get('creditCard.expirationYear');
  }
  handleMonthsAndYears(){
    const selectedFormGroup=this.checkoutFormGroup.get('creditCard');
    const currentYear:number=new Date().getFullYear();
    const selectedYear:number=Number(selectedFormGroup?.value.expirationYear);
    let startMonth:number=1;
    if(selectedYear===currentYear){
      startMonth+=new Date().getMonth();
    }
    this.eCommerceForm.getCreditCardMonths(startMonth).subscribe(
      data=>{
        this.creditCardMonths=data;
      }
    );
  }
}
