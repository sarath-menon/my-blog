import { MainNav } from "@/components/main-nav";
import { ModeToggle } from "@/components/mode-toggle";
import { marketingConfig } from "@/config/marketing";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-background">
      <div className="flex items-center justify-between py-2 border-b px-12">
        <MainNav items={marketingConfig.mainNav} />
        <nav>
          <ModeToggle />
        </nav>
      </div>
    </header>
  );
}
