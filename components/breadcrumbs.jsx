"use client";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { capitalizeString } from "@/lib/utils";
import { Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

export function Breadcrumbs() {
  const pathname = usePathname();
  const pathnames = pathname.split("/");

  //   const pathnames = [
  //     "sef",
  //     "sefw",
  //     "sef",
  //     "sef",
  //     "sef",
  //     "sef",
  //     "grgerg",
  //     "sef",
  //   ];

  const firstPathname = pathnames[0];
  const lastPathname = pathnames[pathnames.length - 1];
  const middlepathnames = pathnames.slice(1, -1);

  //   alert(pathname.trim().split("/")[1]);
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">
            <Home size={14} color="blue" />
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        {middlepathnames.length > 4 && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  <BreadcrumbEllipsis className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {pathnames.map((item, index) => {
                    return (
                      <BreadcrumbLink href={item} key={index}>
                        {" "}
                        <DropdownMenuItem>
                          {capitalizeString(item)}
                        </DropdownMenuItem>
                      </BreadcrumbLink>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
          </>
        )}

        {middlepathnames.map((item, index) => {
          const fullpathname = middlepathnames.slice(0, index + 1).join("/");
          return (
            <Fragment key={index}>
              <BreadcrumbItem key={index}>
                <Link href={`/${fullpathname}`} passHref legacyBehavior>
                  <BreadcrumbLink>{capitalizeString(item)}</BreadcrumbLink>
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </Fragment>
          );
        })}

        {lastPathname && (
          <BreadcrumbItem>
            <BreadcrumbLink href={lastPathname}>
              {capitalizeString(lastPathname)}
            </BreadcrumbLink>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
