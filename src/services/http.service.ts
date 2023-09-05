import http from '../common/http';

export class HttpService {
    /**
     * Load data from the API
     */
    public fetchData(url: string, service = '') {
        return http({service}).get<any>(url)
    }

    /**
     * create an item
     */
    public postItem(url: string, data: any, service='') {
        return http({service}).post<any>(url, data)
    }

    /**
     * edit an item
     */
    public updateItem(url: string, data: any, service='') {
        return http({service}).put<any>(url, data)
    }

    /**
     * patch update an item
     */
    public patchItem(url: string, data: any, service='') {
        return http({service}).patch<any>(url, data)
    }

    /**
     * retrieve single item from the server
     */
    public retrieveItem(url: string, service='') {
        return http({service}).get<any>(url)
    }

    /**
     * retrieve single item from the server
     */
    public deleteItem(url: string, service='') {
        return http({service}).delete<any>(url)
    }
}
