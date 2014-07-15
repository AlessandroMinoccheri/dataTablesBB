dataTablesBB
============

Backbone app to convert your table into a new table with possibility to filter, paginate and sort data.

#Description
This is a backbone app to convert your table into a new table with possibility to filter, paginate and sort data.
The app take a table, parse data, delete table and redraw the same table using data get from an object created at runtime.

#Requirements
To use this app you need to have this library:
- jQuery 1.5+
- underscore (already in this repository)
- backbone (already in this repository)

#Initialize
To initialize your app you need to to include a css file and some library like this:

```
<link rel="stylesheet" type="text/css" href="css/reset.css">
<link rel="stylesheet" type="text/css" href="css/dataTablesBB.css">
<script type="text/javascript" src="js/jquery.js"></script>
<script src="js/underscore/underscore-min.js"></script>
<script src="js/backbone/backbone-min.js"></script>
<script src="js/dataTablesBB/dataTablesBB.js"></script>
```
To initialize app you need to pass the reference to your table, for example if your id has id ```data-tbl``` and assign class ```data-table-bb``` to your table, you can write this


```
<script>
   $(document).ready(function(){
       var data = new DataTableView({ 
            el: $("#data-tbl")
       });
   });
</script>
```

Automatically the app parse data and redraw your table

#Usage

To be secure to use this app well your table should be something like this:

```
	<table id="data-tbl" class="data-table-bb">
        <thead>
            <th>Select</th>
            <th class="to-order to-filter"><span>First Name</span></th>
            <th class="to-order to-filter"><span>Last Name</span></th>
        </thead>
        <tbody>
            <tr>
                <td>Garry</td>
                <td>Trout</td>
            </tr>
            <!-- other row -->
        </tbody>
    </table>
```

First thing you should consider is: assign an id and the class ```data-table-bb``` to your table.
Inside thead you can create many columns with th and assign twho type of class:
- ```to-order```
- ```to-filter```

Class ```to-order``` means that this column can be sorted.

Class ```to-filter``` means that this column can be filtered.

#Options
When you load app you can set some options for example this initalize:

```
var data = new DataTableView({ 
    el: $("#data-tbl"),
    multiple_checkbox: true,
    element_visible: 15,
    order: 3,
    order_by: 'desc',
    option_filter: true,
    option_sort: true,
    option_paginate: true
});
```

- ```el``` is the table that you want to convert into an interactive table with this app
- ```multiple_checkbox``` when you use the functionality of checkbox (explained in the next paragraph) you can set that users can select only one row(value = false) or more rows(value = true). Default value is: ```true```.
- ```element_visible``` is the number of elements visible when ou load the page. Value that you can insert are multiple of 5: 5, 10, 15, 20, 25, 30, 35, 40, 45... Default value is: ```5```.
- ```order``` the order base of your table, the value is the index of the column that you want to sorted when the page is loaded. Default value is: ```2```.
- ```order_by``` the order type base of your table, the value can be asc or desc. Is the type of order of the column that you want to sorted by when the page is loaded. Default value is: ```asc```.
- ```option_filter``` if is set to true filter function is actived. Default value is: ```true```.
- ```option_sort``` if is set to true sorting function is actived. Default value is: ```true```.
- ```option_paginate``` if is set to true pagination function is actived. Default value is: ```true```.

#Advanced elements
Inside ```tbody``` you can insert your row with your data without specify something basically.
If you want to use a checkbox statement to select the entire row or more rows you can create an element like this:

```
<td>
    <input type="checkbox" class="checkbox" name="check1" value="1" />
</td>
```

It's important to use this syntax about type of the input and the class.
If you use this element, automatically the app convert this checkbox into a graphic checkbox that when is checked all the line will be selected, or more rows if you check more.


Another useful element to use is

```
<td>
    <span class="icon-small info"></span>
</td>
```
If you have include all images of this repository with this code app generate an icon of information.
This icon can be used to view an hidden row under the row selected.

Example of usage:

```
<tr>
    <td >
        <input type="checkbox" class="checkbox" name="check1" value="1" />
    </td>
    <td>Garry</td>
    <td>Trout</td>
    <td class="align-center">
        <span class="icon-small info"></span>
    </td>
</tr>
<tr class="row-drop">
    <td colspan="4">
        <div>
            <table>
                <tr>
                    <td>
                        <p>Info:</p>
                        <p><span class="rtl-label">Pt.Name:</span> John, Doe</p>
                        <p><span class="rtl-label">DOB:</span> 2/16/1946</p>
                        <p><span class="rtl-label">Age:</span> 68</p>
                        <p><span class="rtl-label">Gender:</span> Male</p>
                        <p><span class="rtl-label">MRN:</span> 899665</p>
                        <p><span class="rtl-label">MVH MRN:</span> 54879665</p>
                    </td>
                    <td>
                        <p>Info:</p>
                        <p><span class="rtl-label">Modality:</span> CT</p>
                        <p><span class="rtl-label">Body Part:</span> CT Had W/WWO Cont...</p>
                        <p><span class="rtl-label">Study Date:</span> 9/29/2013</p>
                        <p><span class="rtl-label">Images#:</span> 879</p>
                        <p><span class="rtl-label">Series#:</span> 12</p>
                        <p><span class="rtl-label">Origin:</span> St. Joseph Hospital</p>
                        <p><span class="rtl-label">Accession#:</span> 12584968</p>
                        <p><span class="rtl-label">MVH Accession#:</span> 170896542</p>
                    </td>
                    <td>
                        <p>History:</p>
                        <p><span class="rtl-label">Send to PACS:</span> 3/13/2014 - 9:20AM</p>
                        <p class="margin-bottom-10"><span class="rtl-label"></span> Scott James</p>
                        <p><span class="rtl-label">Shared With:</span> 3/13/2014 - 9:18AM</p>
                        <p class="margin-bottom-10"><span class="rtl-label"></span> Scott James</p>
                        <p><span class="rtl-label">Imported in</span> 3/13/2014 - 9:15AM</p>
                        <p class="margin-bottom-10">Scott James</p>
                    </td>
                </tr>
            </table>
        </div>
    </td>
</tr>
```

In this case all ```row-drop ``` is hidden when you load the page but whn you click on icon info, this line will be appear.

It can be useful to see more data only when the user want to see it.

## License

The MIT License (MIT)

Copyright (c) 2014 Alessandro Minoccheri

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.