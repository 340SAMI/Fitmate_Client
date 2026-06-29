import { getUserSession } from "@/lib/core/Session";
import BookedClassTable from "./BookedClassTable";

export default async function BookedClasses() {
  
  const user = await getUserSession()
  
  return <>

  <BookedClassTable user={user}></BookedClassTable>
  </>;
}
