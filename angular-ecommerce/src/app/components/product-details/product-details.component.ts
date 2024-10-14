import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../common/cart-item';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit{
  product!:Product;
  constructor(private productService:ProductService,private route:ActivatedRoute,private cartService:CartService) {}
  ngOnInit():void{
    this.route.paramMap.subscribe(()=>{
      this.handleProductDetails();
    })
  }
  handleProductDetails() {
    const theProductId= +this.route.snapshot.paramMap.get('id')!;
    console.log(theProductId);
    this.productService.getProduct(theProductId).subscribe(
      data=>{
        this.product=data;
      }
    );
  }
  addToCart() {
    const cartItem:CartItem=new CartItem(this.product);
    this.cartService.addToCart(cartItem);
  }
}
