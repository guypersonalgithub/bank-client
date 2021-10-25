export class Investment {

    public constructor(
        public investment_id?: number,
        public investment_name?: string,
        public required_sum?: number,
        public required_type?: string,
        public investment_duration?: number,
        public potential_growth_percentage?: number
    ){}

}