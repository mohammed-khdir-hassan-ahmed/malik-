import { NextRequest, NextResponse } from "next/server";

import { endSession } from "@/lib/session";

export async function GET(request: NextRequest): Promise<Response> {
  // کۆتاییهێنانی دانیشتن: cookies().delete() لە Route Handler کاردەکات
  // و Set-Cookie دەڕوات بە ڕێگای HTTP بۆ وێبگەڕ — نەک لە ڕێگای RSC.
  await endSession();

  return NextResponse.redirect(new URL("/", request.url), {
    status: 302,
  });
}
