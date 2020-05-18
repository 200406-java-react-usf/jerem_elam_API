export class Principal {

    ers_user_id: number;
    username: string;
    role_name: string;

    constructor(id: number, un: string, role_name: string) {
        this.ers_user_id = id;
        this.username = un;
        this.role_name = role_name;
    }
}