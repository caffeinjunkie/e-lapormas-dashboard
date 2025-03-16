import { title } from "@/components/primitives";

import { Layout } from "@/components/layout";

export default function ReportsPage() {
  return (
    <Layout>
      <h1 className={title()}>Reports</h1>
    </Layout>
  );
}

ReportsPage.displayName = "ReportsPage";
