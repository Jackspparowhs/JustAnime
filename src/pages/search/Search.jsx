import CategoryCard from '@/src/components/categorycard/CategoryCard';
import CategoryCardLoader from '@/src/components/Loader/CategoryCard.loader';
import PageSlider from '@/src/components/pageslider/PageSlider';
import getSearch from '@/src/utils/getSearch.utils';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const pageParam = searchParams.get('page');
  const page = Number.isFinite(Number(pageParam)) ? parseInt(pageParam, 10) : 1;

  const [searchData, setSearchData] = useState(null);
  const [totalPages, setTotalPages] = useState(null); // null = unknown
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // if no keyword, clear results and don't fetch
    if (!keyword) {
      setSearchData(null);
      setTotalPages(null);
      setError(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchSearch = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getSearch(keyword, page, { signal });
        // defend against unexpected shapes
        setSearchData(data?.data ?? []);
        setTotalPages(Number.isFinite(Number(data?.totalPage)) ? Number(data.totalPage) : 0);
      } catch (err) {
        if (err.name === 'AbortError') {
          // fetch was aborted — ignore
          return;
        }
        console.error('Error fetching search:', err);
        setError(err);
        setSearchData(null);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    fetchSearch();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => controller.abort();
  }, [keyword, page]);

  const handlePageChange = (newPage) => {
    // ensure we pass strings; preserve keyword
    setSearchParams({ keyword, page: String(newPage) });
  };

  const searchGridClass =
    'grid-cols-8 max-[1600px]:grid-cols-6 max-[1200px]:grid-cols-4 max-[758px]:grid-cols-3 max-[478px]:grid-cols-3 max-[478px]:gap-x-2';

  // UI: if user hasn't entered a keyword
  if (!keyword) {
    return (
      <div className="max-w-[1600px] mx-auto flex flex-col mt-[64px] max-md:mt-[50px]">
        <div className="w-full flex flex-col gap-y-8 mt-6">
          <div className="flex flex-col gap-y-4">
            <h1 className="font-bold text-2xl text-white">Search</h1>
            <p className="text-white/80">Type a keyword to search.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto flex flex-col mt-[64px] max-md:mt-[50px]">
      <div className="w-full flex flex-col gap-y-8 mt-6">
        {loading ? (
          <CategoryCardLoader className={'max-[478px]:mt-2'} gridClass={searchGridClass} />
        ) : !loading && totalPages !== null && page > totalPages && totalPages > 0 ? (
          <div className="flex flex-col gap-y-4">
            <h1 className="font-bold text-2xl text-white max-[478px]:text-[18px]">Search Results</h1>
            <p className="text-white text-lg max-[478px]:text-[16px] max-[300px]:leading-6">
              You came a long way — nothing is here. Go back.
            </p>
          </div>
        ) : searchData && searchData.length > 0 ? (
          <div className="flex flex-col gap-y-2 max-[478px]:gap-y-0">
            <h1 className="font-bold text-2xl text-white max-[478px]:text-[18px]">
              Search Results for: {keyword}
            </h1>
            <CategoryCard data={searchData} showViewMore={false} className="mt-0" gridClass={searchGridClass} />
            <div className="flex justify-center w-full mt-8">
              <PageSlider page={page} totalPages={totalPages ?? 1} handlePageChange={handlePageChange} />
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col gap-y-4">
            <h1 className="font-bold text-2xl text-white max-[478px]:text-[18px]">Search Results</h1>
            <p className="text-white text-lg max-[478px]:text-[16px]">Couldn't get search results, please try again</p>
          </div>
        ) : (
          <div className="flex flex-col gap-y-4">
            <h1 className="font-bold text-2xl text-white max-[478px]:text-[18px]">Search Results</h1>
            <p className="text-white text-lg max-[478px]:text-[16px]">No results found for: {keyword}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
