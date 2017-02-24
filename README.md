# Vue Data Grid

> An example that complex table interaction in Vue.js, which is rebounded the design by [Virgil Pana](https://dribbble.com/shots/1903644-Data-Grid)

## Build Setup

``` bash
# install dependencies
yarn

# serve with hot reload at localhost:8080
yarn run dev

# build for production with minification
yarn run build

# build for production and view the bundle analyzer report
yarn run build --report

# deploy to gh-pages
yarn run deploy
```

## Feature

- Load data from [json](https://github.com/LucienLee/vue-data-grid/blob/master/src/data.json) and import table interaction [configuration](https://github.com/LucienLee/vue-data-grid/blob/master/src/tableSettings.js), which is flexible and scalable ([data source](https://docs.google.com/spreadsheets/d/1PFbZIAipjNIG90BXIzpFwRu7omXYMhh3e1-tldrAv-I/edit?usp=sharing) used in demo).
- Group data by month and year automatically
- Long contents in cells are trimmed automatically, which are expandable by clicking the columns
- The length of expanding columns are calculated by data automatically
- Cells have more menus or details, such as adding google map query links automatically
- Sort data by ascending or descending and filter data by range (filter is under constructing)
- Select columns to show by opening context menu with right click on header
