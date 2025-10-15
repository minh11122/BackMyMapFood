const axios = require("axios");

// Hàm tính khoảng cách đường đi thực tế từ OpenStreetMap (OSRM)
const getOSMDistance = async (from, to) => {
  try {
    const url = `http://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=false`;

    const res = await axios.get(url);

    if (res.data && res.data.routes && res.data.routes.length > 0) {
      const route = res.data.routes[0];
      return {
        distance: route.distance, // mét
        duration: route.duration  // giây
      };
    }

    return null;
  } catch (err) {
    console.error("Error fetching OSM distance:", err.message);
    return null;
  }
};

module.exports = { getOSMDistance };