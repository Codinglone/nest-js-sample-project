import { Injectable } from "@nestjs/common";

@Injectable()

export class AuthService {
    signup(){
        return { message: "I have signed up" }
    }

    signin(){
        return { message: "I have signed in" }
    }   
}