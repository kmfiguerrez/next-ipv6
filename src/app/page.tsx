'use client'

import { useState } from "react";

import IPv6SubnettingForm from "@/components/ipv6-form/ipv6-subnetting-form";
import NavMenu from "@/components/nav-menu";
import OutputDisplay from "@/components/output/output-display";

import type { TPrefix } from "@/lib/ipv6";


export default function Home() {
  const [prefix, setPrefix] = useState<TPrefix>()

  return (
    <>
      <NavMenu />
      <main className="container">
        <IPv6SubnettingForm onFormSubmit={setPrefix} />
        <OutputDisplay prefix={prefix} />
      </main>
    </>
  );
}
