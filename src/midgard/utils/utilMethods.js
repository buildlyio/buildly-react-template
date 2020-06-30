export const MAP_API_URL =
  "https://maps.googleapis.com/maps/api/js?key=AIzaSyBcFCjQsHImeUy8jJQLW37ucWUKKmJwLd0&v=3.exp&libraries=geometry,drawing,places";

export function numberWithCommas(x) {
  if (!x) return "";
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
