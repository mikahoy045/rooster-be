export class User {
    constructor(
        public id: number | null,
        public username: string,
        public password: string,
        public points: number
    ) {}
}
