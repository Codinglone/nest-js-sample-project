import { Injectable } from "@nestjs/common";
// import { User, Bookmark } from "@prisma/client"
@Injectable()

export class AuthService {
    signup(){
        return { message: "I have signed up" }
    }

    signin(){
        return { message: "I have signed in" }
    }   
}