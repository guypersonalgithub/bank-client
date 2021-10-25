export class UserDetails {

    public constructor(
        public username?:string,
        public dollar?:number,
        public shekel?:number,
        public euro?: number,
        public yen?: number,
        public pound?: number,
        public investments?: any[]
    ){}

}