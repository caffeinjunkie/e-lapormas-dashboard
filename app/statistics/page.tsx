import { title } from "@/components/primitives";

import { Layout } from "@/components/layout";

export default function StatisticsPage() {
  return (
    <Layout>
      <h1 className={title()}>Statistics</h1>
    </Layout>
  );
}

StatisticsPage.displayName = "StatisticsPage";
