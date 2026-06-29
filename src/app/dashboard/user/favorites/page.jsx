import { getUserSession } from "@/lib/core/Session";
import FavoritemLists from "./FavoriteLists";

export default async function Favorites() {
  const user = await getUserSession();
  return (
    <FavoritemLists user={user} />
  );
}
