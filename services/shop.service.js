const Shop = require("../models/shop.model");
const { getOSMDistance } = require("../utils/osm");

const findNearbyShops = async (lat, lng, radius = 3000) => {
    // B1: Query MongoDB theo đường chim bay
    const shops = await Shop.find({
        gps: {
            $near: {
                $geometry: { type: "Point", coordinates: [lng, lat] },
                $maxDistance: radius
            }
        },
        status: "ACTIVE"
    }).lean();

    // B2: Gọi OSM để tính khoảng cách thật
    const shopsWithDistance = await Promise.all(
        shops.map(async (shop) => {
            const distanceData = await getOSMDistance(
                { lat, lng },
                { lat: shop.gps.coordinates[1], lng: shop.gps.coordinates[0] }
            );

            return {
                ...shop,
                distance: distanceData?.distance || null,
                duration: distanceData?.duration || null
            };
        })
    );

    // B3: Sort theo khoảng cách thực tế
    return shopsWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0));
};

module.exports = { findNearbyShops };