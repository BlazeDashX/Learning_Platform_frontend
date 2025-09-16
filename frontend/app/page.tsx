import HomeLayout from "./components/HomeLayout";
import Link from "next/link";

export default function Home() {
  const users = [
    { role: "Admin", login: "/admin/login", register: "/admin/register" },
    { role: "Teacher", login: "/teacher/login", register: "/teacher/register" },
    { role: "Student", login: "/student/login", register: "/student/register" },
  ];

  return (
    <HomeLayout>
      <header className="text-center mt-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Welcome to Learning Platform
        </h1>
        <p className="text-gray-600 text-lg">
          Select your user type to Login or Register:
        </p>
      </header>

      <section className="flex flex-wrap justify-center gap-6 mt-10">
        {users.map((user) => (
          <div
            key={user.role}
            className="bg-white rounded-lg shadow-md p-6 w-64 text-center hover:shadow-xl transition-shadow"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              {user.role}
            </h2>
            <p className="space-x-4">
              <Link
                href={user.login}
                className="text-blue-500 hover:text-blue-700 font-medium"
              >
                Login
              </Link>
              |
              <Link
                href={user.register}
                className="text-green-500 hover:text-green-700 font-medium"
              >
                Register
              </Link>
            </p>
          </div>
        ))}
      </section>
    </HomeLayout>
  );
}
