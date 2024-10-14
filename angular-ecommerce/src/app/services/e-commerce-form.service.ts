import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class ECommerceFormService {
  private countryUrl='http://localhost:8080/api/countries';
  private stateUrl="http://localhost:8080/api/states";
  constructor(private httpClient:HttpClient) { }
  getCountries():Observable<Country[]>{
    return this.httpClient.get<GetResponseCountries>(this.countryUrl).pipe(
      map(response=>response._embedded.countries)
    );
  }
  getStates(theCountryCode:String):Observable<State[]>{
    const searchStatesUrl=`${this.stateUrl}/search/findByCountryCode?code=${theCountryCode}`;
    return this.httpClient.get<GetResponseStates>(searchStatesUrl).pipe(
      map(response=>response._embedded.states)
    );
  }
  getCreditCardMonths(theMonth:number):Observable<number[]>{
    let nums:number[]=[];
    for(;theMonth<=12;theMonth++){
      nums.push(theMonth);
    }
    return of(nums);
  }
  getCreditCardYears():Observable<number[]>{
    let nums:number[]=[];
    let startYear:number=new Date().getFullYear();
    const endYear:number=startYear+10;
    for(;startYear<=endYear;startYear++){
      nums.push(startYear);
    }
    return of(nums);
  }
}
interface GetResponseCountries{
  _embedded:{
    countries:Country[];
  }
}
interface GetResponseStates{
  _embedded:{
    states:State[];
  }
}