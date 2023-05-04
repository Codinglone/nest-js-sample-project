import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
// import { User, Bookmark } from "@prisma/client"
import * as argon from "argon2"
@Injectable()

export class AuthService {
    constructor(private prisma: PrismaService) {
        
    }
    async signup(dto: AuthDto){
        // generate the password hash using argon
        const hash = await argon.hash(dto.password)
        // save the new user in the db
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                hash,
            },
            // Returning only specific fields
            // select: {
            //     id: true,
            //     email: true,
            //     createdAt: true,
            // }

        })
        // The easiest way to remove a specific field from a response
        delete user.hash 
        // return the saved user
        return user
    }

    signin(){
        return { message: "I have signed in" }
    }   
}