import {ReleaseService} from '../../services/release.service';
import {HttpService} from '../../services/http.service';

const loadReleases = (context: any, event: any) => new Promise((resolve, reject) => {
    const releaseService = new ReleaseService();
    if (event.product_uuid) {
        return resolve(releaseService.loadReleases(event.product_uuid));
    }
    return resolve([])
});


const submitRelease = (context: any, event: any) => new Promise((resolve, reject) => {
    const releaseService = new ReleaseService();
    return resolve(releaseService.submitRelease(event.release));
})

const deleteRelease = (context: any, event: any) => new Promise((resolve, reject) => {
    const httpService = new HttpService();
    return resolve(
        httpService.deleteItem(
            `/release/${event.release_uuid}/`,
            'release'
        ).then((_) => ({release_uuid: event.release_uuid}))
    )
})


export {loadReleases, submitRelease, deleteRelease}
