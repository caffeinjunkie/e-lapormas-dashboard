import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { button as buttonStyles } from "@heroui/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";

export default function HomePage() {
  return (
    <section className="flex flex-col sm:ml-72 items-center justify-center gap-4 py-8 md:py-10"></section>
  );
}

HomePage.displayName = "HomePage";
