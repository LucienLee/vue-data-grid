# Vue Data Grid

> An example([live demo](https://lucienlee.github.io/vue-data-grid/)) that complex table interaction in Vue.js, which is rebounded the design by [Virgil Pana](https://dribbble.com/shots/1903644-Data-Grid)

![demo](http://i.imgur.com/GqZSw4u.gif)

See full interaction [video](https://vimeo.com/208192639)

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

# deploy bundled files to gh-pages
yarn run deploy
```

## Feature

- Load data from [json](https://github.com/LucienLee/vue-data-grid/blob/master/src/data.json) and import table interaction [configuration](https://github.com/LucienLee/vue-data-grid/blob/master/src/tableSettings.js), which is flexible and scalable ([data source](https://docs.google.com/spreadsheets/d/1PFbZIAipjNIG90BXIzpFwRu7omXYMhh3e1-tldrAv-I/edit?usp=sharing) used in demo).
- Present data in real `table` tag, which keep html semantic
- Load icons via svg sprite, which is resuable and pixel perfact
- Group data by month and year automatically
- Long contents in cells are trimmed automatically, which are expandable by clicking the columns
- The length of expanding columns are calculated by data automatically
- Cells have more menus or details, such as adding google map query links automatically
- Sort data by ascending or descending and filter data by range, whose bounds are calculated by data automatically
- Select columns to show by opening context menu with right click on header

## Acknowledgement
- [Virgil Pana](https://dribbble.com/virgilpana), who designed the interaction first.
- The song played in crafting, 那我懂你意思了 - [沒有人在乎你在乎的事](https://www.youtube.com/watch?v=UX2uQyHaCUk)
