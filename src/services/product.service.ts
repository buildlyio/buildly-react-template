import {HttpService} from './http.service';

export class ProductService {
    private beService = 'product';
    private httpService = new HttpService();

    /**
     * load products
     * @param organizationUuid
     */
    public getProducts(organizationUuid:string){
        return this.httpService.fetchData(
            `/product/?organization_uuid=${organizationUuid}`,
            this.beService
        ).then((response) => response.data)
    }
}
