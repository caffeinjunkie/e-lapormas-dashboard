import { Button } from "@heroui/button";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col h-screen inset-0 items-center justify-center gap-4">
      <p className="text-sm text-default-500">
        Anda tidak memiliki akses ke halaman ini
      </p>
      <Button as={Link} href="/" color="primary" className="w-full">
        Kembali ke halaman utama
      </Button>
    </div>
  );
}
