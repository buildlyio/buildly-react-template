import {HttpService} from './http.service';
import {Release} from '../interfaces/release';

export class ReleaseService {
    private httpService = new HttpService();
    private beService = 'release';

    /**
     * Handle release loading
     */
    public loadReleases(product_uuid: string) {
        // throw error from product uuid is missing
        // if(!product_uuid) {
        //     throw new Error('Product uuid is required')
        // }

        // process the request
        return this.httpService.fetchData(
            `/release/?product_uuid=${product_uuid}`,
            this.beService
        ).then(
            (response) => response.data
        );
    }

    /**
     * Handle release submit
     * @param release
     */
    public submitRelease(release: Release) {
        if(!(release.name && release.product_uuid)) {
            throw new Error(
                'name and product_uuid are required to create a release'
            )
        }
        return this.httpService.postItem('/release/', release, this.beService).then(
            (response) => response.data
        );
    }
}
