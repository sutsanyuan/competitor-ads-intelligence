import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function useAds() {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function loadAds() {
            try {
                // Read in batches so the API's row limit does not truncate the library.
                const records = [];
                const pageSize = 1000;
                for (let start = 0; ; start += pageSize) {
                    const { data, error: queryError } = await supabase
                        .from("ads")
                        .select("*")
                        .order("id")
                        .range(start, start + pageSize - 1);
                    if (cancelled) return;
                    if (queryError) throw queryError;
                    if (!Array.isArray(data)) throw new Error("No ads data returned");
                    records.push(...data);
                    if (data.length < pageSize) break;
                }

                const mappedAds = records.map((ad) => ({
                    id: ad.id,
                    competitor: ad.competitor ?? "",
                    platform: ad.platform ?? "",
                    headline: ad.headline ?? "",
                    copy: ad.copy ?? "",
                    image: ad.image_url ?? "",
                    angle: ad.angle ?? null,
                    date: ad.started_at ?? "",
                    sourceUrl: ad.source_url ?? "",
                    sourceId: ad.source_id ?? "",
                    isReal: ad.is_real === true,
                    saved: false,
                }));
                if (!cancelled) setAds(mappedAds);
            } catch {
                if (!cancelled)
                    setError("Unable to load ads from Supabase. Please refresh to try again.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadAds();
        return () => {
            cancelled = true;
        };
    }, []);

    return { ads, loading, error };
}
