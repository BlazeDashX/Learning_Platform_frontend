import Link from "next/link";

export default function Navbar() {
  return (
    <nav>
      <h2>MyApp</h2>
      <ul>
        <li><Link href="/admin/home">Home</Link></li>
        <li><Link href="/admin/dynamic">Dynamic</Link></li>
        <li><Link href="/admin/login">Login</Link></li>
      </ul>
    </nav>
  );
}
