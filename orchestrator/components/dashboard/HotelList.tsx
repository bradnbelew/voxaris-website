"use client";

import { useEffect, useState } from "react";
import type { HotelConfig } from "@/db/schema";

interface HotelWithEmbed extends HotelConfig {
  embedKey?: string;
  scriptTag?: string;
}

export default function HotelList() {
  const [hotels, setHotels] = useState<HotelConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/hotels")
      .then((r) => r.json())
      .then((data) => setHotels(data.hotels ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-amber-500" />
      </div>
    );
  }

  if (hotels.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-700 bg-gray-900/50 px-8 py-12 text-center">
        <h3 className="mb-2 text-lg font-semibold text-white">No hotels configured</h3>
        <p className="text-sm text-gray-400">
          Add your first hotel to get started with Voxaris.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {hotels.map((hotel) => (
        <div
          key={hotel.id}
          className="rounded-xl border border-gray-800 bg-gray-900/60 p-5 transition-colors hover:border-amber-500/30"
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-white">{hotel.name}</h3>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                hotel.isActive
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {hotel.isActive ? "Active" : "Inactive"}
            </span>
          </div>
          <p className="mb-1 text-sm text-gray-400">{hotel.domain}</p>
          <p className="text-xs text-gray-500">{hotel.slug}</p>
          <div className="mt-4 flex gap-2">
            <div
              className="h-4 w-4 rounded-full border border-gray-600"
              style={{ backgroundColor: hotel.brandColor ?? "#d4a843" }}
              title={hotel.brandColor ?? "#d4a843"}
            />
            <span className="text-xs text-gray-500">
              Max {hotel.maxActionsPerSession} actions/session
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
