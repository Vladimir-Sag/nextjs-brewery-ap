import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Brewery {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  brewery_type: string;
  phone?: string;
  website_url?: string;
  address_1?: string;
}

export default function DetailsPage() {
  const router = useRouter();
  const { id } = router.query;

  const [brewery, setBrewery] = useState<Brewery | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;

    async function loadBrewery() {
      try {
        const response = await fetch(
          `https://api.openbrewerydb.org/v1/breweries/${id}`
        );
        const data = await response.json();
        setBrewery(data);
      } catch (err) {
        console.error("Loading error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadBrewery();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-700 text-lg">Loading parts...</p>
        </div>
      </div>
    );
  }

  if (!brewery) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Brewery not found
          </h2>
          <Link
            href="/"
            className="text-blue-600 hover:underline text-lg"
          >
            ← Go back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 p-6">
      <div className="max-w-2xl mx-auto bg-indigo-100 shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🍺 {brewery.name}
        </h1>

        <p className="inline-block px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm font-semibold mb-6">
          Type: {brewery.brewery_type}
        </p>

        <div className="space-y-3 text-gray-700 text-lg">
          <p>
            <span className="font-semibold">📍 Address:</span>{" "}
            {brewery.address_1 || "—"}
          </p>
          <p>
            <span className="font-semibold">🏙 City:</span> {brewery.city}
          </p>
          <p>
            <span className="font-semibold">🌍 State:</span> {brewery.state}
          </p>
          <p>
            <span className="font-semibold">🇺🇸 Country:</span>{" "}
            {brewery.country}
          </p>

          {brewery.phone && (
            <p>
              <span className="font-semibold">📞 Phone:</span>{" "}
              {brewery.phone}
            </p>
          )}

          {brewery.website_url && (
            <p>
              <span className="font-semibold">🔗 Website:</span>{" "}
              <a
                href={brewery.website_url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                Go →
              </a>
            </p>
          )}
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-300 hover:bg-blue-400 text-gray-900 rounded-lg transition"
          >
            ← Back
          </button>

        </div>
      </div>
    </div>
  );
}
