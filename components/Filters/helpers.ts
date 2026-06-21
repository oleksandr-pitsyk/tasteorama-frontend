export const resetSearchAndFilters = (
  searchParams: URLSearchParams,
  router:  { replace: (url: string) => void }
) => {
  const params = new URLSearchParams(searchParams);

  params.delete('category');
  params.delete('ingredient');
  params.delete('search');

  const queryString = params.toString();

  router.replace(queryString ? `?${queryString}` : '/');
};