import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Investment } from '../models/Investment';
import { ActiveInvestment } from '../models/ActiveInvestment';
import { environment } from '../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})

export class InvestmentService {

    private investments = new BehaviorSubject<Investment[]>([]);
    public investmentsObservable = this.investments.asObservable();

    public activeInvestments = [];

    constructor(private http: HttpClient) {}

    public getAllInvestments(): Observable<any[]> {

        return this.http.get<any[]>(environment.url + "/api/investments/getinvestments");

    }

    updateInvestments(investments: Investment[]) {

        this.investments.next(investments);

    }

    public newInvestment(investment: Investment): Observable<ActiveInvestment> {

        return this.http.post<Investment>(environment.url + "/api/investments/newinvestment", investment);

    }

    public completeInvestment(investment: any) {

        return this.http.patch(environment.url + "/api/investments/completeinvestment", investment);
    }

}