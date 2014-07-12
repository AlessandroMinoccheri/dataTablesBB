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
           el: $("#data-tbl"),
           multiple_checkbox: true,
           element_visible: 15,
           order: 3,
           order_by: 'desc'
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
            <th class="to-order to-filter"><span>DOB</span></th>
            <th class="to-order to-filter"><span>Modality</span></th>
            <th class="to-order to-filter"><span>Body<br/> Part</span></th>
            <th class="to-order to-filter"><span>Study Date</span></th>
            <th class="to-order to-filter"><span>Image #</span></th>
            <th class="to-order to-filter"><span>Series #</span></th>
            <th class="to-order to-filter"><span>Source<br/> Hospital</span></th>
            <th>More<br/> Info</th>
        </thead>
        <tbody>
            <tr>
                <td>
                    <input type="checkbox" class="checkbox" name="check1" value="1" />
                </td>
                <td>Garry</td>
                <td>Trout</td>
                <td>04/03/1970</td>
                <td>CT</td>
                <td>Head</td>
                <td>05/21/2010</td>
                <td>####</td>
                <td>####</td>
                <td>Example</td>
                <td>
                    <span class="icon-small info"></span>
                </td>
            </tr>
            <!-- other row -->
        </tbody>
    </table>
```

First thing you should consider is: assign an id and the class ```data-table-bb``` to your table.
Inside thead you can create many columns with th and assign twho type of class:
- ```to-order```
- ```to-filter```

Class ```to-order``` means that this column can be sorted
Class ```to-filter``` means that this column can be filtered

#Advanced elements
Inside tbody you can insert your row with your data without specify something basically.
If you want to use a checkbox statement to select the entire row or more rows you can create an element like this:

```
<td>
    <input type="checkbox" class="checkbox" name="check1" value="1" />
</td>
```

It's important to use this syntax about type of the input and the class.
If you use this element automatically the app convert this checkbox into a graphic cehckbox that when is checked all the line will be selected, or more rows if you check more.

