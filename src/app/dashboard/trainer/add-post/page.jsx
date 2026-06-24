// src/app/dashboard/trainer/add-post/page.jsx
import { getUserSession } from '@/lib/core/Session';
import AddForumPostForm from './AddForumPost';

export default async function TrainerAddPost() {

  const session = await getUserSession()
  return <AddForumPostForm session={session}></AddForumPostForm>
}
