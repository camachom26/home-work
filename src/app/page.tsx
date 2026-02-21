import { redirect } from "next/navigation";

export default function Home() {
  // send users to landing page
  redirect("/en/landing"); // or "/landing" if you later choose localePrefix: "as-needed"
}