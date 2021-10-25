import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { UserLoginDetails } from '../models/UserLoginDetails';
import { SuccessfulLoginServerResponse } from '../models/SuccessfulLoginServerResponse';
import { UserSignUpDetails } from '../models/UserSignUpDetails';
import { SuccessfulSignUpServerResponse } from '../models/SuccessfulSignUpServerResponse';
import { UserDetails } from '../models/UserDetails';
import { MoneyService } from './MoneyService';
import { InvestmentService } from '../services/InvestmentsService';
import { environment } from '../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})

export class UserService {

    private userName = new BehaviorSubject("");
    public userNameObservable = this.userName.asObservable();

    private loginAnimation = new BehaviorSubject("");
    public loginAnimationObservable = this.loginAnimation.asObservable();

    private moneyService: MoneyService;
    private investmentService: InvestmentService;

    constructor(moneyService: MoneyService, investmentService: InvestmentService, private http: HttpClient) {
        this.moneyService = moneyService;
        this.investmentService = investmentService;
    }

    public login(UserLoginDetails: UserLoginDetails): Observable<SuccessfulLoginServerResponse> {

        return this.http.post<SuccessfulLoginServerResponse>(environment.url + "/api/users/login", UserLoginDetails);
    }

    public signUp(UserLoginDetails: UserLoginDetails): Observable<SuccessfulSignUpServerResponse> {
        return this.http.post<SuccessfulSignUpServerResponse>(environment.url + "/api/users/signup", UserLoginDetails);
    }

    public checkIfUserIsOnline(): Observable<UserDetails>{

        return this.http.get<UserDetails>(environment.url + "/api/users/checkifuserisonline");

    }

    public currentlyLoggedIn(): void {

        if (localStorage.getItem("token")) {

            if (this.userName.value == "") {

                const observable = this.checkIfUserIsOnline();

                observable.subscribe(succesfulServerRequestData => {

                    this.updateUsername(succesfulServerRequestData.username!);

                    let currency = {

                        dollar: succesfulServerRequestData.dollar!,
                        shekel: succesfulServerRequestData.shekel!,
                        euro: succesfulServerRequestData.euro!,
                        yen: succesfulServerRequestData.yen!,
                        pound: succesfulServerRequestData.pound!

                    }

                    this.moneyService.updateFunds(currency);

                    if (succesfulServerRequestData.investments != null) {

                        this.investmentService.updateInvestments(succesfulServerRequestData.investments);

                    }

                    this.updateLoginAnimation("disabled");

                  }, serverErrorResponse => { 

                    localStorage.removeItem("token");

                    if (this.loginAnimation.value == "disabled") {
        
                        this.updateLoginAnimation("enabled");
    
                    }
                    
                  });
          
            }
            
            else {
                
                this.updateLoginAnimation("disabled");
        
              }

        }

        else {

            if (this.loginAnimation.value == "disabled" || this.loginAnimation.value == "") {

                this.updateLoginAnimation("enabled");

            }

        }

    }

    updateUsername(username: string) {
        
        this.userName.next(username);

    }

    updateLoginAnimation(state: string) {

        this.loginAnimation.next(state);

    }

}