export const MAP_API_URL =
  "https://maps.googleapis.com/maps/api/js?key=AIzaSyBcFCjQsHImeUy8jJQLW37ucWUKKmJwLd0&v=3.exp&libraries=geometry,drawing,places";

export function numberWithCommas(x) {
  if (!x) return "";
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const compareSort = (propName) => {
  return function (a, b) {
    if (isNaN(parseFloat(a[propName]))) {
      if (a[propName].toUpperCase() < b[propName].toUpperCase()) return -1;
      if (a[propName].toUpperCase() > b[propName].toUpperCase()) return 1;
      return 0;
    } else {
      if (parseFloat(a[propName]) < parseFloat(b[propName])) return -1;
      if (parseFloat(a[propName]) > parseFloat(b[propName])) return 1;
      return 0;
    }
  };
};
