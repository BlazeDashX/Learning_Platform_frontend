import Link from "next/link";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* Simple Navbar */}
      <nav>
        <h2>Learning Platform</h2>
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/">Services</Link></li>
          <li><Link href="/">About us</Link></li>
          <li><Link href="/">Contact US</Link></li>
        </ul>
      </nav>


      <main>{children}</main>
      <footer>
        <p>© {new Date().getFullYear()} Learning Platform</p>
      </footer>
    </div>
  );
}
