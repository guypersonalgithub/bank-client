import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ExchangeCurrency } from '../models/ExchangeCurrency';
import { environment } from '../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})

export class MoneyService {

    [key: string]: any;

    private funds = new BehaviorSubject({
        dollar: 0,
        shekel: 0,
        euro: 0,
        yen: 0,
        pound: 0
    });
    public fundsObservable = this.funds.asObservable();

    public Dollar = {

        Type: "Rate",
        Shekel: 3.26,
        Euro: 0.82,
        Yen: 108.93,
        Pound: 0.71
    
      }
    
      public Shekel = {
    
        Type: "Rate",
        Dollar: 0.31,
        Euro: 0.25,
        Yen: 33.47,
        Pound: 0.22
    
      }
    
      public Euro = {
    
        Type: "Rate",
        Dollar: 1.22,
        Shekel: 3.97,
        Yen: 132.73,
        Pound: 0.86
    
      }
    
      public Yen = {
    
        Type: "Rate",
        Dollar: 0.0092,
        Shekel: 0.030,
        Euro: 0.0075,
        Pound: 0.0065
    
      }
    
      public Pound = {
    
        Type: "Rate",
        Dollar: 1.42,
        Shekel: 4.61,
        Euro: 1.16,
        Yen: 154.21
    
      }
    

    constructor(private http: HttpClient) {}

    public exchangeCurrency(exchangeCurrency: ExchangeCurrency) {

        return this.http.patch(environment.url + "/api/users/exchangecurrency", exchangeCurrency);

    }

    updateFunds(funds: any) {

        this.funds.next(funds);

    }

}