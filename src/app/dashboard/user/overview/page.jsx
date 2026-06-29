import { getUserSession } from "@/lib/core/Session";
import OverViewStats from "./overViewStats";


export default async function UserOverview() {

  const user = await getUserSession()
    console.log(user.id, "check user")
  return <>
  <OverViewStats user={user}></OverViewStats>
  </>;
}
