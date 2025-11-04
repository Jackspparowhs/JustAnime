import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import getCategoryInfo from "@/src/utils/getCategoryInfo.utils";
import CategoryCard from "@/src/components/categorycard/CategoryCard";
import Loader from "@/src/components/Loader/Loader";
import Error from "@/src/components/error/Error";
import PageSlider from "@/src/components/pageslider/PageSlider";

function AtoZ({ path = "" }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categoryInfo, setCategoryInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  const page = Number.isFinite(Number(searchParams.get("page"))) ? parseInt(searchParams.get("page"), 10) : 1;
  const currentLetter = String(path).split("/").pop()?.toLowerCase() || "";

  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;

    const fetchAtoZInfo = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getCategoryInfo(path, page, { signal: controller.signal });
        if (!mounted) return;
        setCategoryInfo(data?.data ?? []);
        setTotalPages(Number.isFinite(Number(data?.totalPages)) ? Number(data.totalPages) : 1);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Error fetching category info:", err);
        if (mounted) setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAtoZInfo();
    window.scrollTo({ top: 0, behavior: "smooth" });

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [path, page]);

  const handlePageChange = (newPage) => {
    setSearchParams({ page: String(newPage) });
  };

  // letter options
  const letters = ["All", "#", "0-9", ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))];

  if (loading) return <Loader type="AtoZ" />;
  if (error) return <Error />;

  return (
    <div className="max-w-[1600px] mx-auto flex flex-col mt-[64px] max-md:mt-[50px]">
      <div className="flex flex-col gap-y-2 max-[478px]:gap-y-0 mt-6">
        <h1 className="font-bold text-2xl text-white max-[478px]:text-[18px]">Sort By Letters</h1>
        <div className="flex gap-x-[7px] flex-wrap justify-start gap-y-2 max-md:justify-start">
          {letters.map((item, index) => {
            const linkPath =
              item.toLowerCase() === "all" ? "" : item === "#" ? "other" : item.toLowerCase();
            const isActive =
              (currentLetter === "az-list" && item.toLowerCase() === "all") ||
              (currentLetter === "other" && item === "#") ||
              currentLetter === item.toLowerCase();

            return (
              <Link
                to={`/az-list/${linkPath}`}
                key={index}
                className={`text-md bg-[#373646] py-1 px-4 rounded-md font-bold hover:text-black hover:bg-white hover:cursor-pointer transition-all ease-out ${
                  isActive ? "text-black bg-white" : ""
                }`}
              >
                {item}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="w-full flex flex-col gap-y-8">
        <div>
          {categoryInfo && categoryInfo.length > 0 ? (
            <>
              <CategoryCard
                data={categoryInfo}
                limit={categoryInfo.length}
                showViewMore={false}
                className="mt-8"
                cardStyle="grid-cols-8 max-[1600px]:grid-cols-6 max-[1200px]:grid-cols-4 max-[758px]:grid-cols-3 max-[478px]:grid-cols-3 max-[478px]:gap-x-2"
              />
              <div className="flex justify-center w-full mt-8">
                <PageSlider page={page} totalPages={totalPages} handlePageChange={handlePageChange} />
              </div>
            </>
          ) : (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-white">No results</h2>
              <p className="text-white/70">No items found for this letter. Try another one.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AtoZ;
