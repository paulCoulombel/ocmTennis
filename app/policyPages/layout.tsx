import TRPCProvider from "@/components/TRPCProvider";

export default function PolicyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <TRPCProvider>{children}</TRPCProvider>;
}
