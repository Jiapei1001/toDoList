const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const lodash = require('lodash')

// import date.js as a modeule, and name this module as date
// date.getDate() and date.getDay() to call the two functions
const date = require(__dirname + '/date.js')

const app = express()
// use bodyParser
app.use(bodyParser.urlencoded({ extended: true }))

// to let the server find files in the public folder
app.use(express.static('public'))

// from ejs doc, init ejs template
app.set('view engine', 'ejs')

// from v1, changed the arrays to mongodb
mongoose.connect('mongodb://localhost:27017/todolistDB', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})

// mongoose schema
const itemsSchema = {
    name: String,
}

const Item = mongoose.model('Item', itemsSchema)

const item1 = new Item({
    name: 'Welcome!',
})
const item2 = new Item({
    name: "This is today's todolist!",
})
const item3 = new Item({
    name: 'Have fun!',
})

const defaultItems = [item1, item2, item3]

const listSchema = {
    name: String,
    items: [itemsSchema],
}

const List = mongoose.model('List', listSchema)

app.get('/', (req, res) => {
    Item.find({}, (err, foundItems) => {
        if (foundItems.length === 0) {
            // took so long time to find, below lack the 'err' as the input argument
            Item.insertMany(defaultItems, (err) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log('Successfully saved defaultItems to database!')
                }
            })
            // after insertion, redirect back to the route to show the items
            res.redirect('/')
        } else {
            res.render('list', {
                listTitle: 'Today',
                newListItems: foundItems,
            })
        }
    })
})

app.post('/', (req, res) => {
    // after getting the post request after submitting form html page
    const newItemName = req.body.newItem
    const listName = req.body.list
    const newItem = new Item({
        name: newItemName,
    })

    if (listName === 'Today') {
        // insert the item into the mongodb database
        newItem.save()
        res.redirect('/')
    } else {
        List.findOne({ name: listName }, (err, foundList) => {
            foundList.items.push(newItem)
            foundList.save()
            res.redirect('/' + listName)
        })
    }
})

app.post('/delete', (req, res) => {
    const checkedItemId = req.body.checkbox
    const listName = req.body.listName

    if (listName === 'Today') {
        Item.findByIdAndRemove(checkedItemId, (err) => {
            if (err) {
                console.log(err)
            } else {
                console.log('Successfully deleted checkedItem from database!')
                res.redirect('/')
            }
        })
    } else {
        List.findOne({ name: listName }, (err, foundList) => {
            if (!err) {
                foundList.items.pull({ _id: checkedItemId })
                foundList.save()
                res.redirect('/' + listName)
            } else {
                console.log(err)
            }
        })
    }
})

app.get('/:customListName', (req, res) => {
    const customListName = lodash.capitalize(req.params.customListName)

    List.findOne({ name: customListName }, (err, foundList) => {
        if (!err) {
            if (!foundList) {
                // create a new List
                const list = new List({
                    name: customListName,
                    items: defaultItems,
                })
                list.save()
                res.redirect('/' + customListName)
            } else {
                // show existing list
                res.render('list', {
                    listTitle: foundList.name,
                    newListItems: foundList.items,
                })
            }
        }
    })
})

app.post('/work', (req, res) => {
    console.log(req.body)
    // still as newItem, as the post submit button's name is newItem
    let newItem = req.body.newItem
    newWorkItems.push(newItem)
    res.redirect('/work')
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})
