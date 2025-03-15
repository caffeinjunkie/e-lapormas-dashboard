import { Button } from "@heroui/button";
import Link from "next/link";

import { Layout } from "@/components/layout";

export default function UnauthorizedPage() {
  return (
    <Layout className="h-[calc(100vh-4rem)] md:h-screen">
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-sm text-default-500">
          Anda tidak memiliki akses ke halaman ini
        </p>
        <Button as={Link} href="/" color="primary">
          Kembali ke halaman utama
        </Button>
      </div>
    </Layout>
  );
}
