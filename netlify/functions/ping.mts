import type { Context, Config } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  const ping = Netlify.env.get("PING_MESSAGE") ?? "ping";
  
  return new Response(JSON.stringify({ message: ping }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};

export const config: Config = {
  path: "/api/ping"
};
