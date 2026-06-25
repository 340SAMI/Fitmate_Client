

import DetailsPage from '@/component/classes/DetailsPage';
import { getClassesById } from '@/lib/api/classes';
import { getUserSession } from '@/lib/core/Session';
import React from 'react';

const page = async ({ params }) => {
   const { id } = await params;

   const classes = await getClassesById(id);
   const user = await getUserSession();
   const userId = user?.id ?? null;

   return <>

   <DetailsPage classes={classes} userId={userId}></DetailsPage>
   </>
};

export default page;