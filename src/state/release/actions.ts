import {ReleaseService} from '../../services/release.service';

const loadReleases = (context: any, event: any) => new Promise((resolve, reject) => {
    const releaseService = new ReleaseService();
    if(event.product_uuid) {
        return resolve(releaseService.loadReleases(event.product_uuid));
    }
    return resolve([])
});


const submitRelease = (context: any, event: any) => new Promise((resolve, reject) => {
    const releaseService = new ReleaseService();
    return resolve(releaseService.submitRelease(event.payload));
})


export {loadReleases, submitRelease}
