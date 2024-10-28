import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems:CartItem[]=[];
  totalPrice:Subject<number>=new BehaviorSubject<number>(0);
  totalQuantity:Subject<number>=new BehaviorSubject<number>(0);

  constructor() { }

  addToCart(theCartItem:CartItem){
    let existingCartItem:CartItem|undefined=undefined;
    let alreadyExistsInCart:boolean=false;


    existingCartItem=this.cartItems.find(cartItem=>cartItem.id===theCartItem.id);
    alreadyExistsInCart=(existingCartItem!==undefined);
    if(alreadyExistsInCart){
      existingCartItem!.quantity++;
    }else{
      this.cartItems.push(theCartItem);
    }
    this.computeCartTotals();
  }

  computeCartTotals() {
    let totalPriceValue:number=0;
    let totalQuantityValue:number=0;
    for(let cartItem of this.cartItems){
      totalPriceValue+=cartItem.quantity*cartItem.unitPrice;
      totalQuantityValue+=cartItem.quantity;
    }
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
    this.logCartData(totalPriceValue,totalQuantityValue);
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log("Contents of Cart");
    for(let cartItem of this.cartItems){
      const totalPrice=cartItem.quantity*cartItem.unitPrice;
      console.log(`name :${cartItem.name}, quantity :${cartItem.quantity}, totalPrice:${totalPrice.toFixed(2)}`);
    }
    console.log(`totalPrice :${totalPriceValue.toFixed(2)}, totalQuantity :${totalQuantityValue}`);
    console.log(`----`);
  }

  decrementQuantity(cartItem: CartItem) {
    cartItem.quantity--;
    if(cartItem.quantity===0){
      this.remove(cartItem);
    }
    else{
      this.computeCartTotals();
    }
  }
  remove(cartItem:CartItem){
    const itemIndex=this.cartItems.findIndex(data=>data.id===cartItem.id);
    if(itemIndex>-1){
      this.cartItems.splice(itemIndex,1);
      this.computeCartTotals();
    }
  }
}
