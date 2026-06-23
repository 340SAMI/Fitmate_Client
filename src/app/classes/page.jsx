import ClassListingContainer from "@/component/classes/ClassListingContainer";
import { getClasses } from "@/lib/api/classes";

export default async function ClassesPage({ searchParams }) {
  const filters = await searchParams;
  const search = filters.search ?? "";
  const category = filters.category ?? "all";


  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (category !== "all") params.set("category", category);

  const response = await getClasses(params.toString())


  const { classes, total } =  response;
  return (
    <ClassListingContainer
      initialClasses={classes ?? []}
      initialTotal={total ?? 0}
      search={search}
      category={category}
    />
  );
}