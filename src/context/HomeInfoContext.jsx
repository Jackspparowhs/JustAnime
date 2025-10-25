import { createContext, useContext, useState, useEffect } from "react";

const HomeInfoContext = createContext();

export const HomeInfoProvider = ({ children }) => {
  const [homeInfo, setHomeInfo] = useState(null);
  const [homeInfoLoading, setHomeInfoLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeInfo = async () => {
      try {
        // 1. Fetch all anime
        const res = await fetch("https://justanime-backend.vercel.app/api/anime");
        const data = await res.json();
        if (!data.success) throw new Error("Failed to fetch anime list");

        const allAnime = data.results;

        // 2. Fetch latest episode for each anime
        const latestEpisodes = await Promise.all(
          allAnime.map(async (anime) => {
            try {
              const epRes = await fetch(`https://justanime-backend.vercel.app/api/episodes/${anime.slug}`);
              const epData = await epRes.json();
              const latestEp = epData.success && epData.results.episodes.length > 0
                ? epData.results.episodes.slice(-1)[0]
                : null;

              return {
                ...anime,
                latest_episode: latestEp,
              };
            } catch {
              return { ...anime, latest_episode: null };
            }
          })
        );

        // 3. Organize sections for template
        const homeData = {
          spotlights: allAnime.slice(0, 5), // first 5 for spotlight
          genres: [...new Set(allAnime.map(a => a.genres).flat())], // unique genres
          latest_episode: latestEpisodes.slice(-12), // last 12 for latest episodes
          top_airing: allAnime.slice(0, 10), // first 10 for top airing
          most_favorite: allAnime.slice(0, 10), // first 10 as most favorite
          latest_completed: allAnime.slice(-10), // last 10 completed
          trending: allAnime.slice(0, 12), // first 12 trending
          topten: allAnime.slice(0, 10), // first 10 top ten
        };

        setHomeInfo(homeData);
      } catch (err) {
        setError(err);
      } finally {
        setHomeInfoLoading(false);
      }
    };

    fetchHomeInfo();
  }, []);

  return (
    <HomeInfoContext.Provider value={{ homeInfo, homeInfoLoading, error }}>
      {children}
    </HomeInfoContext.Provider>
  );
};

export const useHomeInfo = () => useContext(HomeInfoContext);
