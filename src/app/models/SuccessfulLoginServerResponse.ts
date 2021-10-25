export class SuccessfulLoginServerResponse {

    public constructor(
        public token?:string,
        public username?:string,
        public dollar?:number,
        public shekel?:number,
        public euro?: number,
        public yen?: number,
        public pound?: number
    ){}

}