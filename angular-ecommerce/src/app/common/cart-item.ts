import { Product } from "./product";

export class CartItem {
    id:string;
    name:string;
    imageUrl:string;
    unitPrice:number;
    quantity:number;
    constructor(product:Product){
        this.id=product.id;
        this.imageUrl=product.imageUrl;
        this.name=product.name;
        this.unitPrice=product.unitPrice;
        this.quantity=1;
    }
}
