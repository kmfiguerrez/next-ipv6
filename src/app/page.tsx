import Ipv6SubnettingForm from "@/components/ipv6-form/ipv6-subnetting-form";
import NavMenu from "@/components/nav-menu";
import OutputDisplay from "@/components/output-display";

export default function Home() {
  return (
    <>
      <NavMenu />
      <main className="container">
        <Ipv6SubnettingForm />
        <br />
        <OutputDisplay />
      </main>
    </>
  );
}
