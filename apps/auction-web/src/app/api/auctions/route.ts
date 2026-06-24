import { NextResponse } from "next/server";
import { listLiveAuctions } from "@paddle/db/auction-repository";
import { isSupabaseServiceConfigured } from "@paddle/db/supabase-server";

export const dynamic = "force-dynamic";

function imageUrl(fileName: string) {
  return `/paddle-original/assets/lots/${fileName}`;
}

function makeDemoAuctions() {
  const now = Date.now();
  const hour = 1000 * 60 * 60;

  return [
    {
      id: "demo-watch-001",
      seller_id: "demo-seller-001",
      seller_handle: "tempus.co",
      title: "Rolex Submariner Date 126610LN",
      description: "Unworn steel dive watch with box, papers, and verified seller documents.",
      category: "Watches",
      starting_price_cents: 1100000,
      reserve_price_cents: 1350000,
      current_price_cents: 1485000,
      bid_count: 34,
      image_url: imageUrl("rolex-watch.png"),
      status: "live",
      ends_at: new Date(now + hour * 5).toISOString(),
      winner_id: null,
    },
    {
      id: "demo-art-002",
      seller_id: "demo-seller-002",
      seller_handle: "atelier.nova",
      title: "Signed Contemporary Canvas",
      description: "Large-format mixed media work with provenance certificate and studio framing.",
      category: "Fine Art",
      starting_price_cents: 320000,
      reserve_price_cents: 500000,
      current_price_cents: 575000,
      bid_count: 16,
      image_url: imageUrl("canvas-art.png"),
      status: "live",
      ends_at: new Date(now + hour * 9).toISOString(),
      winner_id: null,
    },
    {
      id: "demo-car-003",
      seller_id: "demo-seller-003",
      seller_handle: "heritage.motors",
      title: "1968 Ford Mustang Fastback",
      description: "Restored V8 classic with inspection report, clean title, and transport support.",
      category: "Collector Cars",
      starting_price_cents: 4200000,
      reserve_price_cents: 5500000,
      current_price_cents: 6125000,
      bid_count: 41,
      image_url: imageUrl("mustang-fastback.png"),
      status: "live",
      ends_at: new Date(now + hour * 14).toISOString(),
      winner_id: null,
    },
    {
      id: "demo-camera-004",
      seller_id: "demo-seller-004",
      seller_handle: "kanto.cameras",
      title: "Leica M6 Rangefinder, 1984",
      description: "Original leatherette body with bright finder, serviced meter, and cap.",
      category: "Cameras",
      starting_price_cents: 160000,
      reserve_price_cents: 200000,
      current_price_cents: 218000,
      bid_count: 27,
      image_url: imageUrl("leica-camera.png"),
      status: "live",
      ends_at: new Date(now + hour * 2).toISOString(),
      winner_id: null,
    },
    {
      id: "demo-furniture-005",
      seller_id: "demo-seller-005",
      seller_handle: "nord.studio",
      title: "Mid-Century Teak Lounge Chair",
      description: "Restored teak lounge chair with matching ottoman and new wool upholstery.",
      category: "Furniture",
      starting_price_cents: 62000,
      reserve_price_cents: 50000,
      current_price_cents: 79000,
      bid_count: 18,
      image_url: imageUrl("teak-lounge-chair.png"),
      status: "live",
      ends_at: new Date(now + hour * 7).toISOString(),
      winner_id: null,
    },
    {
      id: "demo-watch-006",
      seller_id: "demo-seller-006",
      seller_handle: "maison.lux",
      title: "Cartier Tank Solo, Stainless Steel",
      description: "Clean dial, bracelet links included, recently pressure tested.",
      category: "Jewelry",
      starting_price_cents: 240000,
      reserve_price_cents: 300000,
      current_price_cents: 326000,
      bid_count: 29,
      image_url: imageUrl("cartier-watch.png"),
      status: "live",
      ends_at: new Date(now + hour * 11).toISOString(),
      winner_id: null,
    },
    {
      id: "demo-vinyl-007",
      seller_id: "demo-seller-007",
      seller_handle: "wax.archive",
      title: "Blue Note First Press Jazz LP",
      description: "1959 mono pressing, glossy sleeve, vinyl graded NM/VG+.",
      category: "Vinyl",
      starting_price_cents: 22000,
      reserve_price_cents: null,
      current_price_cents: 31400,
      bid_count: 12,
      image_url: imageUrl("jazz-vinyl.png"),
      status: "live",
      ends_at: new Date(now + hour * 3).toISOString(),
      winner_id: null,
    },
    {
      id: "demo-sneaker-008",
      seller_id: "demo-seller-008",
      seller_handle: "grail.kicks",
      title: "Air Jordan 1 Chicago 1985 OG",
      description: "Size US 9, collector-grade pair with authenticated box and tags.",
      category: "Sneakers",
      starting_price_cents: 480000,
      reserve_price_cents: 600000,
      current_price_cents: 635000,
      bid_count: 53,
      image_url: imageUrl("jordan-sneakers.png"),
      status: "live",
      ends_at: new Date(now + hour * 6).toISOString(),
      winner_id: null,
    },
    {
      id: "demo-camera-009",
      seller_id: "demo-seller-009",
      seller_handle: "medium.format",
      title: "Hasselblad 500C/M Kit",
      description: "Medium-format body, waist-level finder, 80mm lens, and A12 back.",
      category: "Cameras",
      starting_price_cents: 120000,
      reserve_price_cents: null,
      current_price_cents: 151000,
      bid_count: 15,
      image_url: imageUrl("hasselblad-camera.png"),
      status: "live",
      ends_at: new Date(now + hour * 13).toISOString(),
      winner_id: null,
    },
    {
      id: "demo-furniture-010",
      seller_id: "demo-seller-010",
      seller_handle: "design.room",
      title: "Pair of Wegner Wishbone Chairs",
      description: "Matched CH24 pair with natural cord seats and oiled oak frames.",
      category: "Furniture",
      starting_price_cents: 76000,
      reserve_price_cents: null,
      current_price_cents: 93000,
      bid_count: 20,
      image_url: imageUrl("wishbone-chairs.png"),
      status: "live",
      ends_at: new Date(now + hour * 4).toISOString(),
      winner_id: null,
    },
  ];
}

export async function GET() {
  if (!isSupabaseServiceConfigured()) {
    return NextResponse.json({
      auctions: makeDemoAuctions(),
      mode: "demo",
    });
  }

  try {
    const auctions = await listLiveAuctions();
    return NextResponse.json({ auctions });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load auctions";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
