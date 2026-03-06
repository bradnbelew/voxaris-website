import { notFound } from "next/navigation";
import UpgradeClient from "./UpgradeClient";

// ── Brand Registry ──

const BRANDS: Record<
  string,
  { name: string; logo: string; primaryColor: string; accentColor: string }
> = {
  usaa: {
    name: "USAA Member Travel Privileges",
    logo: "/brands/usaa-logo.svg",
    primaryColor: "#003B5C",
    accentColor: "#C5A55A",
  },
  "govt-vacation": {
    name: "Government Vacation Rewards",
    logo: "/brands/gvr-logo.svg",
    primaryColor: "#1B3A5C",
    accentColor: "#D4AF37",
  },
  default: {
    name: "Arrivia Travel Club",
    logo: "/brands/arrivia-logo.svg",
    primaryColor: "#1B2A4A",
    accentColor: "#C5A55A",
  },
};

// ── Server Component ──

interface PageProps {
  params: Promise<{ brandId: string }>;
  searchParams: Promise<{ ctx?: string }>;
}

export default async function UpgradePage({ params, searchParams }: PageProps) {
  const { brandId } = await params;
  const { ctx } = await searchParams;

  if (!ctx) {
    return notFound();
  }

  // Decode base64url context
  let memberContext: Record<string, string>;
  try {
    const decoded = Buffer.from(ctx, "base64url").toString("utf-8");
    const contextParams = new URLSearchParams(decoded);
    memberContext = Object.fromEntries(contextParams.entries());
  } catch {
    return notFound();
  }

  const memberName = memberContext.member_name;
  const upgradeLink = memberContext.upgrade_link;

  if (!memberName || !upgradeLink) {
    return notFound();
  }

  const brand = BRANDS[brandId] ?? BRANDS.default!;

  return (
    <UpgradeClient
      brandId={brandId}
      brand={brand}
      memberContext={memberContext}
    />
  );
}
