import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);

  const { searchParams } = url;

  const error = searchParams.get("error");
  const errorCode = searchParams.get("error_code");

  if (error || errorCode) {
    const errorParams = new URLSearchParams({
      error: error || "",
      code: errorCode || "",
    });
    return redirect(`/error?${errorParams.toString()}`);
  }

  const next = searchParams.get("next") || "/";
  return redirect(next);
}
