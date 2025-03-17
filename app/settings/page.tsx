import { Layout } from "@/components/layout";
import { title } from "@/components/primitives";

export default function SettingsPage() {
  return (
    <Layout>
      <h1 className={title()}>Settings</h1>
    </Layout>
  );
}

SettingsPage.displayName = "SettingsPage";
