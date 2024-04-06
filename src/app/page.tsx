'use client'

import { useState } from "react";

import IPv6SubnettingForm from "@/components/ipv6-form/ipv6-subnetting-form";
import NavMenu from "@/components/nav-menu";
import OutputDisplay from "@/components/output/output-display";

import type { TPrefix } from "@/lib/ipv6";
import InfoContainer from "@/components/info/info-container";


export default function Home() {
  const [prefix, setPrefix] = useState<TPrefix>()

  return (
    <>
      <NavMenu />
      <main className="">
        <section className="max-sm:px-1 min-h-screen border sm:container">
          <IPv6SubnettingForm onFormSubmit={setPrefix} />
          <OutputDisplay prefix={prefix} />
        </section>
      </main>
      <section className="max-sm:px-1 min-h-screen border sm:container">
        <InfoContainer />         
      </section>
    </>
  );
}
