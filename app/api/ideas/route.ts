import prisma from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

async function POST(req: NextRequest,res: NextResponse) { 
    const {userId,idea} = await req.json()
    const newIdea = await prisma.idea.create({
        data:{
            userId,
            idea
        }
    })

    return NextResponse.json({
        message: "Idea created successfully"
    })
    
}