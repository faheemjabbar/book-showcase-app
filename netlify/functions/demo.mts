import type { Context, Config } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({
      message: "Hello from Netlify serverless function",
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
};

export const config: Config = {
  path: "/api/demo",
};
