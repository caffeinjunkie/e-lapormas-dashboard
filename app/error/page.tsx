"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const message =
    searchParams.get("message") || "Terjadi kesalahan. Mohon coba sesaat lagi";

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="max-w-md w-full p-2">
        <CardHeader className="flex p-4 gap-2 items-center justify-center">
          <ExclamationTriangleIcon className="size-6 text-danger" />
          <p className="text-lg font-semibold">Error</p>
        </CardHeader>
        <CardBody className="flex flex-col p-4 gap-4">
          <p className="text-sm text-default-500">{message}</p>
        </CardBody>
        <CardFooter className="pt-4">
          <Button
            as={Link}
            href="/login"
            color="primary"
            variant="light"
            className="w-full"
          >
            Kembali ke halaman login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
