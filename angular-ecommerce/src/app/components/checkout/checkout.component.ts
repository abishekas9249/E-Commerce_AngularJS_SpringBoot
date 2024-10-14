import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ECommerceFormService } from '../../services/e-commerce-form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit{
  checkoutFormGroup!:FormGroup;
  totalPrice:number=0;
  totalQuantity:number=0;
  creditCardYears!:number[];
  creditCardMonths!:number[];
  countries:Country[]=[];
  shippingAddressStates:State[]=[];
  billingAddressStates:State[]=[];
  constructor(private formBuilder:FormBuilder,private eCommerceForm:ECommerceFormService){}

  ngOnInit(){

    this.checkoutFormGroup=this.formBuilder.group({
      customer:this.formBuilder.group({
        firstName:[''],
        lastName:[''],
        email:['']
      }),
      shippingAddress:this.formBuilder.group({
        street:[''],
        city:[''],
        state:[''],
        country:[''],
        zipCode:['']
      }),
      billingAddress:this.formBuilder.group({
        street:[''],
        city:[''],
        state:[''],
        country:[''],
        zipCode:['']
      }),
      creditCard:this.formBuilder.group({
        cardType:[''],
        nameOnCard:[''],
        cardNumber:[''],
        securityCode:[''],
        expirationMonth:[''],
        expirationYear:['']
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
    console.log(this.checkoutFormGroup.controls['billingAddress'].get('country')?.value);
    console.log(this.checkoutFormGroup.controls['billingAddress'].get('state')?.value);
    console.log(this.checkoutFormGroup.controls['shippingAddress'].get('country')?.value);
    console.log(this.checkoutFormGroup.controls['shippingAddress'].get('state')?.value);
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
