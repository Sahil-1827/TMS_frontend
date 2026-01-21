import ClientLayout from "./ClientLayout";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <ClientLayout>
      <Outlet />
    </ClientLayout>
  );
}