import prisma from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

async function POST(req: NextRequest,res: NextResponse) {
    const {userId,post} = await req.json()
    const newPost = await prisma.post.create({
        data:{
            userId,
            post
        }
    })

    return NextResponse.json({
        message: "Post created successfully"
    })
    
}

async function GET(req: NextRequest,res: NextResponse) {
    const {userId} = await req.json()
    const newPost = await prisma.post.findMany({
        where:{
            userId
        }
    })
    return NextResponse.json(newPost)
    
}

async function DELETE(req: NextRequest,res: NextResponse) {
    const {userId,postId} = await req.json()
    const newPost = await prisma.post.delete({
        where:{
            userId,
            postId
        }
    })

    return NextResponse.json({
        message: "Post deleted successfully"
    })
}