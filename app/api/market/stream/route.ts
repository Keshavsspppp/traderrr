import { connectDB } from "@/lib/mongodb";
import { requireUser } from "@/lib/api-auth";
import { applyPriceJitter } from "@/lib/market-tick";
import { processPendingOrders } from "@/services/order.service";
import Stock from "@/models/Stock";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  await connectDB();
  await requireUser();

  const encoder = new TextEncoder();
  let interval: ReturnType<typeof setInterval> | undefined;

  const stream = new ReadableStream({
    start(controller) {
      const push = async () => {
        try {
          const stocks = await Stock.find().select(
            "symbol currentPrice changePercent"
          );
          const ticks = stocks.map((s) => ({
            symbol: s.symbol,
            price: applyPriceJitter(s.currentPrice, s.symbol),
            changePercent: s.changePercent,
          }));
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ ticks, at: Date.now() })}\n\n`)
          );
          await processPendingOrders();
        } catch {
          /* stream continues */
        }
      };

      push();
      interval = setInterval(push, 3000);

      req.signal.addEventListener("abort", () => {
        if (interval) clearInterval(interval);
        controller.close();
      });
    },
    cancel() {
      if (interval) clearInterval(interval);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
