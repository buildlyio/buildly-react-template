import axios from 'axios';
import { oauthService } from '@modules/oauth/oauth.service';

// eslint-disable-next-line import/no-anonymous-default-export
export default function (options = {} as any) {
    const service = options['service'];
    let baseURL = '';
    const token = oauthService.getAccessToken();
    if (service === 'release') {
        baseURL = `${window.env.API_URL}release/`;
    } else if (service === 'product'){
        baseURL = `${window.env.API_URL}product/`
    } else {
        baseURL = `${window.env.API_URL}`
    }
    return axios.create(
        {
            baseURL: baseURL,
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
    )
};
