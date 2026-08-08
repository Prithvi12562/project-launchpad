import { useLocation } from "react-router-dom";
import Seo from "./Seo";

const ROUTE_META: Record<string, { title: string; description: string; noindex?: boolean }> = {
  "/": {
    title: "Royal Plaza Hotels Dhanaura | Barara Ambala Hotel",
    description:
      "Royal Plaza Hotels Dhanaura — luxury AC rooms, banquet hall, swimming pool & restaurant on Sadhaura Road, Barara, Ambala, Haryana. Book direct: +91 8288808857.",
  },
  "/login": {
    title: "Sign In | Royal Plaza Hotels Dhanaura",
    description: "Sign in to your Royal Plaza Hotels Dhanaura account to manage bookings and website content.",
    noindex: true,
  },
  "/register": {
    title: "Create an Account | Royal Plaza Hotels Dhanaura",
    description: "Create a Royal Plaza Hotels Dhanaura account to manage your bookings and hotel website.",
    noindex: true,
  },
  "/forgot-password": {
    title: "Reset Your Password | Royal Plaza Hotels Dhanaura",
    description: "Request a password reset link for your Royal Plaza Hotels Dhanaura account.",
    noindex: true,
  },
  "/reset-password": {
    title: "Set a New Password | Royal Plaza Hotels Dhanaura",
    description: "Choose a new password for your Royal Plaza Hotels Dhanaura account.",
    noindex: true,
  },
  "/dashboard": {
    title: "Dashboard | Royal Plaza Hotels Dhanaura",
    description: "Manage hotel websites, bookings and content for Royal Plaza Hotels Dhanaura.",
    noindex: true,
  },
  "/create-website": {
    title: "Create Website | Royal Plaza Hotels Dhanaura",
    description: "Create a new hotel website for Royal Plaza Hotels Dhanaura.",
    noindex: true,
  },
  "/preview": {
    title: "Website Preview | Royal Plaza Hotels Dhanaura",
    description: "Preview the generated hotel website before publishing.",
    noindex: true,
  },
  "/editor": {
    title: "Website Editor | Royal Plaza Hotels Dhanaura",
    description: "Edit hotel website content, rooms, amenities and contact details.",
    noindex: true,
  },
};

const RouteSeo = () => {
  const { pathname } = useLocation();
  const meta =
    ROUTE_META[pathname] ?? {
      title: "Page Not Found | Royal Plaza Hotels Dhanaura",
      description: "The page you are looking for does not exist at Royal Plaza Hotels Dhanaura.",
      noindex: true,
    };

  return <Seo title={meta.title} description={meta.description} path={pathname} noindex={meta.noindex} />;
};

export default RouteSeo;
