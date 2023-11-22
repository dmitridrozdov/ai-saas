"use client";


import { useState } from 'react'

import { parse } from 'node-html-parser'

const woolisApi = {
    base: 'https://www.woolworths.com.au/api/v3/ui/schemaorg/product/',
}

const products = [
    {
      product: 'Guylian Chocolate Seashells 250g',
      woolisid: '231598',
      coleslink: 'https://www.coles.com.au/product/guylian-chocolate-seashells-250g-5235307',
      usualprice: '18',
    },
    {
      product: 'Lavazza Crema E Gusto Ground Coffee 1Kg',
      woolisid: '160945',
      coleslink: '',
      usualprice: '28',
    },
    {
      product: 'Cadbury Old Gold Original Dark Chocolate Block 180g',
      woolisid: '813898',
      coleslink: 'https://www.coles.com.au/product/cadbury-old-gold-original-dark-chocolate-block-180g-2350568',
      usualprice: '6',
    }
  ]



const page = () => {

    const [productsWithPrices, setProductsWithPrices]= useState<Array<{ wid: string; product: string; price: any; usualprice: string; colesprice: string; }>>([]);


    const fetchAllWoolisPrices = async () => {
      try {
        const promises = products.map(async (p) => {
          const colesprice = await fetchColesPrice(p.coleslink);
          const res = await fetch(`${woolisApi.base}${p.woolisid}`);
          const result = await res.json();
    
          return {
            wid: p.woolisid,
            product: p.product,
            price: result.offers.price,
            usualprice: p.usualprice,
            colesprice: colesprice,
          };
        });
    
        const results = await Promise.all(promises);
        setProductsWithPrices(results);
      } catch (error) {
        console.error('Error fetching prices:', error);
      }
    };
  
    const fetchColesPrice = async (coleslink: string) => {
      try {
        if(coleslink === '') return '-'
    
        const res = await fetch(coleslink, { method: 'GET', mode: 'cors' });
        // const proxyUrl = '/.netlify/functions/proxy?url=' + encodeURIComponent(coleslink);
        // const res = await fetch(proxyUrl);
        // console.log(proxyUrl)
    
        // console.log('Response Status:', res.status);
        // console.log('Response Headers:', res.headers);
    
        const html = await res.text();
        const root = parse(html);
        const selectedElement = root.querySelector('.price__value');
    
        return selectedElement ? selectedElement.textContent : '-1';
      } catch (error) {
        console.error('Error fetching Coles price:', error);
        return '-1';
      }
    };
    
    fetchAllWoolisPrices()

  return (
    <div>
    {productsWithPrices.map((product) => (
      <div key={product.wid}>
        <p>Product ID: {product.wid}</p>
        <p>Product Name: {product.product}</p>
        <p>Price: {product.price}</p>
        <p>Usual Price: {product.usualprice}</p>
        <p>Coles Price: {product.colesprice}</p>
        <hr />
      </div>
    ))}
  </div>
  )
}

export default page