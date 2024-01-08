import Geocode from 'react-geocode';
import _ from 'lodash';

export default function getLocations(carrierLocations) {
  Geocode.setApiKey(window.env.GEO_CODE_API);
  Geocode.setLanguage('en');

  const reponses = _.map(carrierLocations, (loc) => (
    Geocode.fromAddress(loc)
  ));
  const locations = _.map(reponses, (res) => {
    const { lat, lng } = res.results[0].geometry.location;
    return `${lat},${lng}`;
  });

  return locations;
}
