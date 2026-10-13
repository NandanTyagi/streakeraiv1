import { proxyClerkRequest } from "@/lib/clerk-proxy";

export const dynamic = "force-dynamic";
const handler = (request: Request) => proxyClerkRequest(request);
export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE, handler as OPTIONS, handler as HEAD };
