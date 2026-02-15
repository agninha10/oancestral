import { NextResponse } from "next/server";
import { successResponse } from "@/lib/api/response";

export async function GET() {
    return NextResponse.json(
        successResponse({
            status: "healthy",
            version: "1.0.0",
            timestamp: new Date().toISOString(),
        })
    );
}
