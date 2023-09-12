import React from 'react';
import Select from '../../components/Select'
import Button from "../../components/Button";
import './release-manager.css';

export const ReleaseManager = () => {
    const products= [
        {description:'Product 1', value:'one'},
        {description:'Product 2', value:'two'},
        {description:'Product 3', value:'three'},
        {description:'Product 4', value:'four'},
    ]
    return <div>
        <section className="header">
            <Select className="col-3" label="Product" options={products}/>
            <Button className="col-1" />
        </section>
    </div>
}

export default ReleaseManager;
