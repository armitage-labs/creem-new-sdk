import { creem } from "@/app/lib/creem";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { productId, units } = await req.json();

  const checkout = await creem.checkouts.create({
    productId,
    units,
  });

  console.log("checkout", checkout);

  return NextResponse.json(checkout);
}
