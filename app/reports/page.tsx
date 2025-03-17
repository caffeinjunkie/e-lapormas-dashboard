import { Layout } from "@/components/layout";
import { title } from "@/components/primitives";

export default function ReportsPage() {
  return (
    <Layout>
      <h1 className={title()}>Reports</h1>
    </Layout>
  );
}

ReportsPage.displayName = "ReportsPage";
