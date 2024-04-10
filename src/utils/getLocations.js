import Geocode from 'react-geocode';
import _ from 'lodash';

const getLocations = async (carrierLocations) => {
  Geocode.setApiKey(window.env.GEO_CODE_API);
  Geocode.setLanguage('en');

  const reponses = await Promise.all(_.map(carrierLocations, async (loc) => (
    // eslint-disable-next-line no-return-await
    await Geocode.fromAddress(loc)
  )));
  const locations = _.map(reponses, (res) => {
    const { lat, lng } = res.results[0].geometry.location;
    return `${lat},${lng}`;
  });

  return locations;
};

export default getLocations;
