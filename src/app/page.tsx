import { redirect } from "next/navigation";

export default function Home() {
  // send users to landing page
  redirect("/en/examples/landing"); // or "/examples/landing" if you later choose localePrefix: "as-needed"
}