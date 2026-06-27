import { getUserSession } from '@/lib/core/Session';
import React from 'react';
import AdminStats from './adminStats';

const page = async () => {
  const user = await getUserSession()
  return (
   <AdminStats user={user}></AdminStats>
  );
};

export default page;
