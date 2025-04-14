// import prisma from "../../utils/db"
import {prisma} from "@/utils/db"
import { NextRequest, NextResponse } from "next/server"

 async function POST(req: NextRequest,res: NextResponse) {
    const {email,password} = await req.json()
    const newUser = await prisma.user.create({
        data:{
            email,
            password
        }
    })
    
}

async function PUT(req: NextRequest,res: NextResponse) {
    const {email,password} = await req.json()
    const newUser = await prisma.user.update({
        where:{
            email
        },
        data:{
            password
        }
    })
    
}