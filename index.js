const express = require('express')

const app = express()

app.listen(4002, () => console.log('Express API listening on port 4002'))

let csvToJson = require('convert-csv-to-json');

const mapping = csvToJson.getJsonFromCsv("./data/mappings.csv");
const array = csvToJson.getJsonFromCsv("./data/pricat.csv");

const brands = [] //list of all brands
const catalog = {} //final catalog

//function to change the structure of the input

const toCatalog = (input) => {

const variant = {
  ean: input.ean,
  color: input.color,
  size: input.size,
  size_name: input.size_name,
  price_buy_gross: input.price_buy_gross,
  price_buy_net: input.price_buy_net,
  discount_rate: input.discount_rate,
  price_sell: input.price_sell,
  material: input.material,
  article_structure: input.article_structure,
  article_number_2: input.article_number_2,
  article_number_3: input.article_number_3
}

  const article = {
    supplier: input.supplier,
    catalog_code: input.catalog_code,
    collection: input.collection,
    season: input.season,
    currency: input.currency,
    target_area: input.target_area,
    [input.ean]: variant
  }

  const brand = {
    brand: input.brand,
    [input.article_number]: article
  }

  if(!brands.includes(input.brand)){
    catalog[input.brand]= brand
    brands.push(input.brand)
  }

  else {
    if(catalog[input.brand][input.article_number])
    catalog[input.brand][input.article_number][input.ean] = variant
  else {
    catalog[input.brand][input.article_number] = article
  }
}
}


// function to map properties
const mapProp = (input) => {

//change a mapping file for easier values access
    const newMap = {}
    mapping.forEach(function(element){
      const field = element.source_type
      const value = element.source
      if(!newMap[field]){
        newMap[field] = {}
      }
      newMap[field][value] = element
    })

    let oddKeys = [] //array with input's keys to apply different rules
    let oddSource //holder for data to apply

//find rules to combine input's properties
    Object.keys(newMap).forEach(function(element){
      if(element.includes("|")) {
        oddKeys = element.split("|")
        oddSource = element
      }
    })

//find and change properties from the input
const newArray = input

newArray.map(x => {
    Object.keys(x).forEach(function(key){
      if(newMap[key]){
        const oldValue = x[key]
        const newKey = newMap[key][oldValue].destination_type
        const newValue = newMap[key][oldValue].destination
        x[newKey] = newValue
        if(!(newKey === key)){
          delete x[key]
        }
      }
//find and change properties (combined)
      if(oddKeys.includes(key)) {
        const first = x[oddKeys[0]]
        const second = x[oddKeys[1]]

        Object.keys(newMap[oddSource]).forEach(function(element){
            if (element.includes(first) && element.includes(second)){
            const finall = newMap[oddSource][element]
            x[finall.destination_type] = finall.destination
            delete x[oddKeys[0]]
            delete x[oddKeys[1]]
          }
          })
        }
      })
    })
return newArray
}

// map the input
const mapped = mapProp(array)

// change the structure of the input
mapped.forEach(function(element){
  toCatalog(element)
})

app.get('/catalog', (request, response) => {
  response.send(catalog)
})
