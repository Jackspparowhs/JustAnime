import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import getCategoryInfo from "@/src/utils/getCategoryInfo.utils";
import CategoryCard from "@/src/components/categorycard/CategoryCard";
import CategoryCardLoader from "@/src/components/Loader/CategoryCard.loader";
import PageSlider from "@/src/components/pageslider/PageSlider";

function Category({ path, label }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  const page = parseInt(searchParams.get("page"), 10) || 1;
  const navigate = useNavigate();

  // derive title safely
  const categoryTitle = label?.split("/").pop()?.replace(/-/g, " ") || "Category";

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchCategoryInfo = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getCategoryInfo(path, page, { signal: controller.signal });
        if (!isMounted) return;

        setCategoryInfo(data?.data ?? []);
        setTotalPages(Number(data?.totalPages) || 1);
      } catch (err) {
        if (err.name === "AbortError") return; // ignore rapid page changes
        console.error("Error fetching category info:", err);
        setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCategoryInfo();
    window.scrollTo({ top: 0, behavior: "smooth" });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [path, page]);

  const handlePageChange = (newPage) => {
    setSearchParams({ page: String(newPage) });
  };

  const categoryGridClass =
    "grid-cols-8 max-[1600px]:grid-cols-6 max-[1200px]:grid-cols-4 max-[758px]:grid-cols-3 max-[478px]:grid-cols-3 max-[478px]:gap-x-2";

  return (
    <div className="max-w-[1600px] mx-auto flex flex-col mt-[64px] max-md:mt-[50px] px-3">
      <div className="w-full flex flex-col gap-y-8 mt-6">
        {loading ? (
          <CategoryCardLoader
            className="max-[478px]:mt-2"
            gridClass={categoryGridClass}
          />
        ) : error ? (
          <div className="flex flex-col gap-y-4">
            <h1 className="font-bold text-2xl text-white capitalize">
              {categoryTitle}
            </h1>
            <p className="text-white text-lg max-[478px]:text-[16px]">
              Couldn't get {categoryTitle} results. Please try again later.
            </p>
          </div>
        ) : !categoryInfo?.length ? (
          <div className="flex flex-col gap-y-4">
            <h1 className="font-bold text-2xl text-white capitalize">
              {categoryTitle}
            </h1>
            <p className="text-white text-lg max-[478px]:text-[16px]">
              No results found for: {categoryTitle}
            </p>
          </div>
        ) : page > totalPages ? (
          <div className="flex flex-col gap-y-4">
            <h1 className="font-bold text-2xl text-white capitalize">
              {categoryTitle}
            </h1>
            <p className="text-white text-lg max-[478px]:text-[16px] max-[300px]:leading-6">
              You came a long way — nothing is here. Go back.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-y-2 max-[478px]:gap-y-0">
            <h1 className="font-bold text-2xl text-white capitalize">
              {categoryTitle}
            </h1>
            <CategoryCard
              data={categoryInfo}
              showViewMore={false}
              className="mt-0"
              gridClass={categoryGridClass}
              categoryPage={true}
              path={path}
            />
            <div className="flex justify-center w-full mt-8">
              <PageSlider
                page={page}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Category;
