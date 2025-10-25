useEffect(() => {
  const fetchHomeInfo = async () => {
    try {
      const res = await fetch("https://justanime-backend.vercel.app/api/anime");
      const data = await res.json();
      if (!data.success) throw new Error("Failed to fetch");

      // Transform the API data to match your Home.jsx props
      const allAnime = data.results;

      const homeData = {
        spotlights: allAnime.slice(0, 5), // first 5 for spotlight
        genres: [...new Set(allAnime.map(a => a.genres).flat())], // unique genres
        latest_episode: allAnime.slice(-12), // last 12 for latest episodes
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
