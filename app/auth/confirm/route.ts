import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);

  const { searchParams } = url;

  // Check for error parameters in both search params and hash
  const error = searchParams.get("error");
  const errorCode = searchParams.get("error_code");
  const errorDescription = searchParams.get("error_description");
  console.log(searchParams, "tess");

  // If there's an error, redirect to error page with the error details
  if (error || errorCode || errorDescription) {
    const errorParams = new URLSearchParams({
      error: error || "",
      code: errorCode || "",
      message: errorDescription
        ? decodeURIComponent(errorDescription).replace(/\+/g, " ")
        : "",
    });
    return redirect(`/error?${errorParams.toString()}`);
  }

  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      return redirect(next);
    }
  }

  // redirect the user to an error page with some instructions
  return redirect(
    "/error?message=Link verifikasi tidak valid atau telah kadaluarsa",
  );
}
