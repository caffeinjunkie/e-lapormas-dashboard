import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

import { updateAdminByEmail } from "@/api/admin";

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

  const email = searchParams.get("email");
  const next = searchParams.get("next") || "/";
  let redirectPath = next;

  try {
    await updateAdminByEmail({
      email: email as string,
      is_verified: true,
    });
  } catch (error: any) {
    redirectPath = "/error?errorCode=default";
  } finally {
    if (redirectPath) {
      return redirect(redirectPath);
    }
  }
}
