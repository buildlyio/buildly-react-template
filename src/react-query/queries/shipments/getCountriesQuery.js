import { httpService } from '@modules/http/http.service';
import _ from 'lodash';

export const getCountriesQuery = async (displayAlert) => {
  try {
    const response = await httpService.makeRequest(
      'get',
      'https://countriesnow.space/api/v0.1/countries/states',
    );
    if (response && response.data && response.data.data) {
      let countries = [];
      _.forEach(response.data.data, (country) => {
        if (
          !_.includes(
            ['cuba', 'iran', 'north korea', 'russia', 'syria', 'venezuela'],
            _.toLower(country.name),
          )
        ) {
          countries = [
            ...countries,
            {
              country: country.name,
              iso3: country.iso3,
              states: _.sortBy(_.without(_.uniq(country.states), [''])),
            },
          ];
        }
      });
      countries = _.uniqBy(countries, 'country');
      return countries;
    }
    return [];
  } catch (error) {
    displayAlert('error', "Couldn't load countries and related states due to some error!");
    return [];
  }
};
