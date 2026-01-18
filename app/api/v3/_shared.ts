import { NextRequest, NextResponse } from "next/server";

export async function readJson<T>(req: NextRequest): Promise<T> {
  try {
    return (await req.json()) as T;
  } catch {
    return {} as T;
  }
}

export function getQueryParam(req: NextRequest, key: string): string | undefined {
  const value = req.nextUrl.searchParams.get(key);
  return value || undefined;
}

export function requireParam(value: string | undefined, name: string): string | NextResponse {
  if (!value) {
    return NextResponse.json({ error: `${name} is required` }, { status: 400 });
  }
  return value;
}

export function okJson<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, { status });
}
