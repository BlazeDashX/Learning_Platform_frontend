import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* Admin Navbar */}
      <nav>
        <h2>Admin Dashboard</h2>
        <ul>
          <li><Link href="/admin/home">Home</Link></li>
          <li><Link href="/admin/dynamic">Dynamic</Link></li>
          <li><Link href="/admin/login">Logout</Link></li>
        </ul>
      </nav>

      {/* Admin Page Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer>
        <p>© {new Date().getFullYear()} Admin Panel</p>
      </footer>
    </div>
  );
}

