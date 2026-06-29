import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../auth";

export const getUserSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user || null;
};

export const requireRole = async (role) => {
  const user = await getUserSession();

  if (!user) {
    redirect("/authenticate/signin");
  }

  if (user?.role !== role) {
    redirect("/unauthorized");
  }

  return user;
};

export const requireAnyRole = async (roles = []) => {
  const user = await getUserSession();

  if (!user) {
    redirect("/authenticate/signin");
  }

  if (!roles.includes(user?.role)) {
    redirect("/unauthorized");
  }

  return user;
};


