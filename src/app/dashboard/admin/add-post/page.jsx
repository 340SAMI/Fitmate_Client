import { getUserSession } from "@/lib/core/Session";
import AddPageForm from "./addPageForm";

export default async function AdminAddPost() {

  const user = await getUserSession()


  return <>
  
  <AddPageForm user={user}></AddPageForm>
  
  </>;
}
