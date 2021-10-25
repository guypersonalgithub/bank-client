export class ActiveInvestment {

    public constructor(
        public investment_id?: number,
        public investment_name?: string,
        public amount_gained?: number,
        public currency_type?: string,
        public time_remaining?: number,
        public minutes_seconds_remaining?: any
    ){}

}