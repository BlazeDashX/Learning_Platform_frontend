import AdminLayout from "../../components/AdminLayout";

export default function AdminDetail({ params }: { params: { id: string } }) {
  return (
    <AdminLayout>
      <h1>Admin Details for ID: {params.id}</h1>
    </AdminLayout>
  );
}
