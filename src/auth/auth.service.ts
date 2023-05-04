import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
// import { User, Bookmark } from "@prisma/client"
import * as argon from "argon2"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
@Injectable()

export class AuthService {
    constructor(private prisma: PrismaService) {
        
    }
    async signup(dto: AuthDto){
        // generate the password hash using argon
        const hash = await argon.hash(dto.password)
        // save the new user in the db
        try {
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
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError){
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credentials taken')
                }
            }
            throw error
        }
        
    }

    async signin(dto: AuthDto){
        // Find the user by email
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            }
        })
        // If user does not exist throw exception
        if(!user) throw new ForbiddenException('Invalid Credentials!')
        // compare password
        const pwMatches: boolean = await argon.verify(user.hash, dto.password)
        // if password is incorrect throw exception
        if(!pwMatches) throw new ForbiddenException('Invalid password')
        // send back the user
        return { message: "I have signed in" }
    }   
}