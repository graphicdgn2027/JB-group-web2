import React from "react";
import { Navigate, useLocation } from "react-router";
import { useSection } from "../content/ContentProvider";
import NotFoundPage from "./NotFoundPage";

const normalise = (path: string) => (path.replace(/\/+$/, "") || "/").toLowerCase();

/**
 * Catch-all route. Old addresses listed under SEO → Links in the dashboard are
 * sent on to their new page; anything else is a 404.
 *
 * This is a client-side redirect: visitors and Google follow it, but it is not
 * a server 301. For a permanent server redirect, add a rule to .htaccess.
 */
const RedirectOrNotFound: React.FC = () => {
  const { pathname, search, hash } = useLocation();
  const { redirects } = useSection("seo");
  const match = redirects.find((r) => r.from && r.to && normalise(r.from) === normalise(pathname));

  if (match && normalise(match.to) !== normalise(pathname)) {
    if (/^https?:\/\//i.test(match.to)) {
      window.location.replace(match.to);
      return null;
    }
    return <Navigate to={`${match.to}${search}${hash}`} replace />;
  }
  return <NotFoundPage />;
};

export default RedirectOrNotFound;
