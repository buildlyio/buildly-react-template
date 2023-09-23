import {ProductService} from '../../services/product.service';

export const loadProducts = (context: any, event: any) => new Promise((resolve, reject) => {
    const productService = new ProductService()
    return resolve(productService.getProducts(context.organization_uuid).then((products) => products),)
})


