export const MAP_API_URL =
  "https://maps.googleapis.com/maps/api/js?key=AIzaSyDOxE87ZNM_xe5X1BH1KYwUo9S4Qs1BV5w&v=3.exp&libraries=geometry,drawing,places";

export function numberWithCommas(x) {
  if (!x) return "";
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
