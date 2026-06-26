
import ForumDetailPage from '@/component/Forum/ForumDetailPage';
import { getForumById } from '@/lib/api/forums';
import { getUserSession } from '@/lib/core/Session';
import React from 'react';

const page = async ({params}) => {
       const { id } = await params;

       console.log("Page ID:", id);
    
       const post = await getForumById(id);
       console.log("post exist", post)
       const user = await getUserSession();
       const userId = user?.id ?? null;
    return (
        <div>
            <ForumDetailPage post={post} user={user}></ForumDetailPage>
        </div>
    );
};

export default page;