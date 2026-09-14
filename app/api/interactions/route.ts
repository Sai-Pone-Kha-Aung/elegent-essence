import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { InteractionAction } from "@/generated/prisma/enums";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, userId, productId, action, dwellTimeMs, weight } = body;

    if (!sessionId || !productId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const actionEnum = action as InteractionAction;

    // Asynchronously record interaction
    const interaction = await prisma.productInteraction.create({
      data: {
        sessionId,
        userId: userId || null,
        productId,
        action: actionEnum,
        dwellTimeMs: dwellTimeMs ? Math.round(dwellTimeMs) : null,
        weight: typeof weight === "number" ? weight : 1.0,
      },
    });

    return NextResponse.json({ success: true, id: interaction.id });
  } catch (error) {
    console.error("API /api/interactions error:", error);
    return NextResponse.json({ error: "Failed to record interaction" }, { status: 500 });
  }
}
