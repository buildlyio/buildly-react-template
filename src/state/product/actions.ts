import {ProductService} from '../../services/product.service';

export const loadProducts = (context: any, event: any) => new Promise((resolve, reject) => {
    const productService = new ProductService()
    return resolve(productService.getProducts(context.organization_uuid).then((products) => {
        if (products?.length) {
            return products.map((product: any) => {
                return {
                    label: product.name,
                    value: product.product_uuid,
                };

                // return selectOptions.sort((a: any, b: any) =>
                //   a.label > b.label ? 1 : -1
                // );
            });
        }
        return [];
    }),)
})


