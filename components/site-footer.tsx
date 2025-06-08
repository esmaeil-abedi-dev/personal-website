import Link from "next/link";
import { Github, Linkedin, Mail, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";

export function SiteFooter() {
  // The Sanity Studio URL - typically this would be your-project-name.sanity.studio
  // or a custom domain if you've set one up
  const sanityStudioUrl =
    process.env.NEXT_PUBLIC_SANITY_STUDIO_URL ||
    "https://your-project.sanity.studio";

  return (
    <footer className="w-full border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Esmaeil Abedi. All rights
            reserved.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href={sanityStudioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">CMS</span>
            </Button>
          </Link>
          <Link
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="ghost" size="icon">
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Button>
          </Link>
          <Link
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="ghost" size="icon">
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">LinkedIn</span>
            </Button>
          </Link>
          <Link href="mailto:contact@example.com">
            <Button variant="ghost" size="icon">
              <Mail className="h-4 w-4" />
              <span className="sr-only">Email</span>
            </Button>
          </Link>
        </div>
      </div>
    </footer>
  );
}
