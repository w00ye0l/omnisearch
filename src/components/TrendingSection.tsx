"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { App } from "@/lib/types/app.types";

interface TrendingSectionProps {
  title: string;
  apps: App[];
  badgeVariant: "appstore" | "playstore" | "secondary";
  badgeText: string;
  hoverColor: string;
}

export default function TrendingSection({
  title,
  apps,
  badgeVariant,
  badgeText,
  hoverColor,
}: TrendingSectionProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm md:text-lg font-semibold text-gray-900 px-2 md:px-0 flex items-center gap-2">
        {title}{" "}
        <Badge variant={badgeVariant} className="text-[10px] md:text-xs">
          {badgeText}
        </Badge>
      </h3>
      <div className="bg-white rounded-xl md:rounded-2xl border border-gray-200 p-2 md:p-6">
        <div className="space-y-1 md:space-y-2">
          {apps.slice(0, 10).map((app, index) => (
            <Link
              key={`${app.store}-${app.id}`}
              href={`/app/${app.store}/${app.id}`}
              onClick={() =>
                sessionStorage.setItem(
                  `app-${app.store}-${app.id}`,
                  JSON.stringify(app)
                )
              }
              className="flex items-start gap-2 md:gap-3 p-1.5 md:p-2 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <span className="text-[10px] md:text-sm font-semibold text-gray-400 w-3 md:w-6 flex-shrink-0 pt-0.5">
                {index + 1}
              </span>
              <Image
                src={app.icon}
                alt={app.title}
                width={40}
                height={40}
                className="rounded-lg flex-shrink-0 md:w-10 md:h-10"
                unoptimized
              />
              <div className="flex-1 min-w-0">
                <p
                  className={`text-xs md:text-base font-medium text-gray-900 line-clamp-2 md:truncate ${hoverColor} transition-colors leading-tight`}
                >
                  {app.title}
                </p>
                <p className="text-[9px] md:text-xs text-gray-500 truncate hidden md:block">
                  {app.developer}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
