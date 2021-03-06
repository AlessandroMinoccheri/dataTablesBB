var InfoModel = Backbone.Model.extend();
var InfoCollection = Backbone.Collection.extend({ 
    model: InfoModel,
    addInfo: function(elements, options) {
        return this.add(elements, options);
    },
    removeInfo: function(elements, options) {
        return this.remove(elements, options);
    }
});

var StyleModel = Backbone.Model.extend();
var StyleCollection = Backbone.Collection.extend({ 
    model: StyleModel,
    addStyle: function(elements, options) {
        return this.add(elements, options);
    },
    removeStyle: function(elements, options) {
        return this.remove(elements, options);
    }
});

var DataTipModel = Backbone.Model.extend();
var DataTipCollection = Backbone.Collection.extend({ 
    model: DataTipModel,
    addDataTip: function(elements, options) {
        return this.add(elements, options);
    },
    removeDataTip: function(elements, options) {
        return this.remove(elements, options);
    }
});

var ClassModel = Backbone.Model.extend();
var ClassCollection = Backbone.Collection.extend({ 
    model: ClassModel,
    addClass: function(elements, options) {
        return this.add(elements, options);
    },
    removeClass: function(elements, options) {
        return this.remove(elements, options);
    }
});

var DataModel = Backbone.Model.extend();
var DataCollection = Backbone.Collection.extend({ 
    model: DataModel,
    sort_key: '2', // default sort key
    sort_order: 'asc', // default sort key
    addConfiguration: function(elements, options) {
        return this.add(elements, options);
    },
    removeConfiguration: function(elements, options) {
        return this.remove(elements, options);
    },
    comparator: function (item) {
        if(!isNaN(parseFloat(item.get(this.sort_key))) && isFinite(item.get(this.sort_key))){
            if(this.sort_order.toString() === 'asc'){
                return parseFloat(item.get(this.sort_key));
            }
            else{
                return -parseFloat(item.get(this.sort_key));
            }
        }
        if(typeof item.get(this.sort_key).toString() === 'string') {
            var check = item.get(this.sort_key).split('/');
            var check2 = item.get(this.sort_key).split('-');
            if((check.length.toString() === '3') || (check2.length.toString() === '3')){
                var date = new Date(item.get(this.sort_key));
                if(this.sort_order.toString() === 'asc'){
                    return date.getTime();
                }
                else{
                    return -date.getTime();
                }
            }
            else{
                if(this.sort_order.toString() === 'desc'){
                    var alphabet = '<>-_0123456789abcdefghijklmnopqrstuvwxyz',
                        title = item.get(this.sort_key).toString().toLowerCase(),
                        inverse_title = '',
                        index;

                    for(var i=0, len=title.length; i<len; i+=1) {
                        index = alphabet.indexOf(title.charAt(i));
                     
                        if(parseInt(index) === -1) {
                            inverse_title += title.charAt(i);
                            continue;
                        }
                     
                        inverse_title += alphabet.charAt(alphabet.length - index - 1);
                    }
                     
                    return inverse_title;
                }
                else{
                    return item.get(this.sort_key).toString().toLowerCase();
                }
            }
        }
    },
    sortByField: function (fieldName, orderBy) {
        this.sort_key = fieldName;
        this.sort_order = orderBy;
        this.sort();
    }
});

var DataTableView = Backbone.View.extend({ 
    initialize: function(options){
        this.options = options || {};
        var here = this;
        this.data_table = new DataCollection();
        this.class_table = new ClassCollection();
        this.data_tip = new DataTipCollection();
        this.style_td = new StyleCollection();
        this.info = new InfoCollection();
        this.filterColumn = [];
        this.actual_page = 1;
        this.start = 0;
        this.max_page = 0;

        if(this.options.option_filter !== undefined){
            this.option_filter = this.options.option_filter;
        }
        else{
            this.option_filter = true;
        }

        if(this.options.option_sort !== undefined){
            this.option_sort = this.options.option_sort;
        }
        else{
            this.option_sort = true;
        }

        if(this.options.option_paginate !== undefined){
            this.option_paginate = this.options.option_paginate;
        }
        else{
            this.option_paginate = true;
        }

        if(this.options.multiple_checkbox !== undefined){
            this.multiple_checkbox = this.options.multiple_checkbox;
        }
        else{
            this.multiple_checkbox = true;
        }

        if(this.options.element_visible !== undefined){
            this.max = this.options.element_visible;
        }
        else{
            this.max = 5;
        }

        if(this.options.order !== undefined){
            this.order = this.options.order;
        }
        else{
            this.order = 2;
        }

        if(this.options.order_by !== undefined){
            this.order_by = this.options.order_by;
        }
        else{
            this.order_by = 'asc';
        }

        var count = 0;
        $.when(
            $(here.el).find('tr').each(function(){
                if(($(this).closest('table').find('thead').length <= 0) || ($(this).hasClass('row-drop'))){
                    if($(this).find('td').length > 0){
                        var element = [];

                        element.html = $(this).html();

                        element.id = count;
                        element.data_id = count;

                        here.InfoModel = new InfoModel(element);
                        here.info.addInfo(here.InfoModel);
                    }
                }
                else{
                    count = count + 1;
                    if($(this).find('td').length > 0){
                        var element = [];
                        var class_arr = [];
                        var data_tip = [];
                        var style_td = [];

                        $(this).find('td').each(function(index2){
                            element[index2] = $(this).html().trim();
                            class_arr[index2] = $(this).attr('class');
                            data_tip[index2] = $(this).data('tip');
                            style_td[index2] = $(this).attr('style');
                        });

                        element.id = count;
                        element.show = '1';
                        here.DataModel = new DataModel(element);
                        here.data_table.addConfiguration(here.DataModel);

                        class_arr.data_id = count;
                        here.ClassModel = new ClassModel(class_arr);
                        here.class_table.addClass(here.ClassModel);

                        data_tip.data_id = count;
                        here.DataTipModel = new DataTipModel(data_tip);
                        here.data_tip.addDataTip(here.DataTipModel);

                        style_td.data_id = count;
                        here.StyleModel = new StyleModel(style_td);
                        here.style_td.addStyle(here.StyleModel);
                    }
                }
            })
        ).then(function() {
            here.render();
        });

        $(here.el).on('click', '.container-arrow span', function(){
            var img = $(this).closest('div').find('img[data-order^="asc-"]');
            if (img.attr('src').indexOf('disabled') > 0){
                $(this).closest('div').find('img[data-order^="asc-"]').trigger('click');
            }
            else{
                $(this).closest('div').find('img[data-order^="desc-"]').trigger('click');
            }
        });

        $(here.el).on('click', '.order-by', function(){
            var order_arr = $(this).data('order').split('-');
            here.order_by = order_arr[0];
            here.order = order_arr[1];

            $(document).find(here.el).find('.order-arrow').remove();
            $(document).find(here.el).find('tr').each(function(index){
                if(parseInt(index) === 1){
                    if($(this).find('.order-by').length <= 0){
                        $(this).find('td').each(function(index2){
                            if($(this).hasClass('to-order')){
                                var margin = -10;
                                var opacity_asc = 1;
                                var opacity_desc = 1;
                                var asc_img = 'img/sort_asc_disabled.png';
                                var desc_img = 'img/sort_desc_disabled.png';

                                if(($(this).html().indexOf('<br />') >= 0) || ($(this).html().indexOf('<br>') >= 0) || ($(this).html().indexOf('<br/>') >= 0)){
                                    margin = 0;
                                }

                                if((parseInt(here.order) === index2) && (here.order_by.toString() === 'asc')){
                                    asc_img = 'img/sort_asc.png';
                                    opacity_desc = 0;
                                }

                                if((parseInt(here.order) === index2) && (here.order_by.toString() === 'desc')){
                                    desc_img = 'img/sort_desc.png';
                                    opacity_asc = 0;
                                }

                                $(this).find('.container-arrow').append('<div style="position:absolute; top:' + margin + 'px; right: 6px; width:10px; height:10px;" class="order-arrow"><img src="' + asc_img + '" alt="" data-order="asc-' + index2 + '" class="order-by" style="opacity:' + opacity_asc + '"/><img src="' + desc_img + '" alt="" data-order="desc-' + index2 + '" class="order-by" style="margin-top: -25px; opacity:' + opacity_desc + '"/></div>');
                            }
                        });

                        $(this).find('th').each(function(index2){
                            if($(this).hasClass('to-order')){
                                var margin = -10;
                                var opacity_asc = 1;
                                var opacity_desc = 1;
                                var asc_img = 'img/sort_asc_disabled.png';
                                var desc_img = 'img/sort_desc_disabled.png';

                                if(($(this).html().indexOf('<br />') >= 0) || ($(this).html().indexOf('<br>') >= 0) || ($(this).html().indexOf('<br/>') >= 0)){
                                    margin = 0;
                                }

                                if((parseInt(here.order) === index2) && (here.order_by.toString() === 'asc')){
                                    asc_img = 'img/sort_asc.png';
                                    opacity_desc = 0;
                                }

                                if((parseInt(here.order) === index2) && (here.order_by.toString() === 'desc')){
                                    desc_img = 'img/sort_desc.png';
                                    opacity_asc = 0;
                                }

                                $(this).find('.container-arrow').append('<div style="position:absolute; top:' + margin + 'px; right: 6px; width:10px; height:10px;" class="order-arrow"><img src="' + asc_img + '" alt="" data-order="asc-' + index2 + '" class="order-by" style="opacity:' + opacity_asc + '"/><img src="' + desc_img + '" alt="" data-order="desc-' + index2 + '" class="order-by" style="margin-top: -25px; opacity:' + opacity_desc + '"/></div>');
                            }
                        });
                    }
                }
            });

            here.data_table.sortByField(here.order, here.order_by);
            here.render();
        });

        $(here.el).parent().on('keyup', '.search-text', function(){
            var searched_text = $(this).val();

            $.when(
                _.each(here.data_table.models, function(data, index_t) {
                    data.set('show', '0');
                    var to_filter = 0;
                    _.each(data.attributes, function(d, index_d) {
                        _.each(here.filterColumn, function(filter) {
                            if (filter.toString() === index_d){
                                to_filter = 1;
                            }
                        });

                        if(parseInt(to_filter) === 1){
                            if((index_t !== 'id') && (index_t !== 'show')){
                                var text = d.toString().toLowerCase();
                                
                                if(text.indexOf(searched_text.toLowerCase()) >= 0){
                                    data.set('show', '1');
                                }
                            }
                        }
                    });
                })
            ).then(function() {
                $.when(
                    _.each(here.info.models, function(data) {
                        var text = data.attributes.html.toString().toLowerCase();

                        if(text.indexOf(searched_text.toLowerCase()) >= 0){
                            _.each(here.data_table.models, function(data2) {
                                if(parseInt(data2.attributes.id) === parseInt(data.attributes.data_id)){
                                    data2.set('show', '1');
                                }
                            });
                        }
                    })
                ).then(function() {
                    here.emptyPagination();
                    here.render();
                });
            });
        });

        $(here.el).parent().on('click', '#table-request_paginate .paginate_button', function(){
            if($(this).hasClass('previous')){
                if(here.actual_page > 1){
                    var new_page = here.actual_page - 1;
                
                    here.actual_page = new_page;
                    here.render();
                }
            }
            else{
                if($(this).hasClass('next')){
                    if(here.actual_page < here.max_page){
                        var new_page_change = here.actual_page + 1;
                    
                        here.actual_page = new_page_change;
                        here.render();
                    }
                }
                else{
                    var new_page_change2 = $(this).html();
                    here.actual_page = new_page_change2;
                    here.render();
                }   
            }
        });

        $(here.el).on('click', '.checkbox', function(){
            if(here.multiple_checkbox === false){
                $(here.el).find('.checkbox').each(function(){
                    $(this).removeClass('checked');
                    $(this).closest('td').find('input').removeAttr('checked');
                    $(this).closest('tr').removeClass('selected');
                }); 
            }
            if($(this).hasClass('checked')){
                $(this).removeClass('checked');
                $(this).closest('td').find('input').removeAttr('checked');
                $(this).closest('tr').removeClass('selected');
            }
            else{
                $(this).closest('td').find('input').attr('checked', 'checked');
                $(this).addClass('checked');
                $(this).closest('tr').addClass('selected');
            }
        });

        $(here.el).on('click', '.info', function(){
            $(document).find(here.el).find('tr').removeClass('open');

            var id = $(this).closest('tr').attr('id').substr(4);
            if($(document).find(here.el).find('#row-more-' + id).is(':visible')){
                $(document).find(here.el).find('#row-more-' + id).hide();
            }
            else{
                $(document).find(here.el).find('tr[id^="row-more-"]').each(function(){
                    $(this).hide();
                });

                $(document).find(here.el).find('#row-more-' + id).show();
                $(document).find(here.el).find('#row-more-' + id).addClass('open');
                $(document).find(here.el).find('#row-more-' + id).prev().addClass('open');
            }
        });

        $(here.el).parent().on('change', '.show-element', function(){
            here.actual_page = '1';
            here.max = $(this).val();
            here.emptyPagination();
            here.render();
        });

        $(here.el).on('click', '.remove-el', function(){
            var id = $(this).closest('tr').attr('id').substr(4);
            _.each(here.data_table.models, function(data) {
                if(parseInt(data.attributes.id) === id){
                    here.data_table.removeConfiguration(data);
                    here.emptyPagination();
                    here.render();
                }
            });
        });
    },
    emptyPagination: function(){
        $(this.el).parent().find('.paginate_button').each(function(){
            if(($(this).hasClass('previous')) || ($(this).hasClass('next'))){
                console.log('not');
            }
            else{
                $(this).remove();
            }
        });
    },
    render: function(){
        var here = this;
        var option_max = '';

        here.data_table.sortByField(here.order, here.order_by);

        for (var j = 5; j<=100; j+=5){
            if(parseInt(j) === parseInt(here.max)){
                option_max += '<option value="' + j + '" selected="selected">' + j + '</option>';
            }
            else{
                option_max += '<option value="' + j + '">' + j + '</option>';
            }
        }
        
        if($(here.el).parent().find('#table-request_filter').length <= 0){
            if(here.option_filter === true){
                $(here.el).before('<div id="table-request_filter" class="data-table-wd_filter"><label>Filter List:<input class="text search-text" type="search" aria-controls="table-request"></label></div>');
            }

            if(here.option_paginate === true){
                $(here.el).before('<div id="table-request_length" class="data-table-wd_length"><label>Show<select class="show-element" name="table-request_length" aria-controls="table-request">' + option_max + '</select>entries</label></div><div class="clear"></div>');
            }
        }

        if(($(here.el).parent().find('.table-request_info').length <= 0) && (here.option_paginate === true)){
            $(here.el).after('<div class="data-table-wd_info table-request_info" id="table-request_info" role="status" aria-live="polite">Showing 1 to 4 of 4 entries</div><div class="data-table-wd_paginate paging_simple_numbers" id="table-request_paginate"><a class="paginate_button previous table-request_previous" aria-controls="table-request" data-dt-idx="0" tabindex="0" id="table-request_previous">Previous</a><a class="paginate_button next table-request_next" aria-controls="table-request" data-dt-idx="2" tabindex="0" id="table-request_next">Next</a></div>');
        }

        $(document).find(here.el).find('tr').each(function(index){
            if(index >= 1){
                $(this).remove();
            }
            else{
                $(this).find('td').each(function(index2){
                    if($(this).hasClass('to-filter')){
                        if(here.filterColumn.indexOf(index2) < 0){
                            here.filterColumn.push(index2);
                        }
                    }
                });

                $(this).find('th').each(function(index2){
                    if($(this).hasClass('to-filter')){
                        if(here.filterColumn.indexOf(index2) < 0){
                            here.filterColumn.push(index2);
                        }
                    }
                });

                if(($(this).find('.order-by').length <= 0) && (here.option_sort === true)){
                    $(this).find('td').each(function(index2){
                        if($(this).hasClass('to-order')){
                            var margin = -10;
                            var opacity_asc = 1;
                            var opacity_desc = 1;
                            var asc_img = 'img/sort_asc_disabled.png';
                            var desc_img = 'img/sort_desc_disabled.png';

                            if(($(this).html().indexOf('<br />') >= 0) || ($(this).html().indexOf('<br>') >= 0) || ($(this).html().indexOf('<br/>') >= 0)){
                                margin = 0;
                            }

                            if((parseInt(here.order) === index2) && (here.order_by.toString() === 'asc')){
                                asc_img = 'img/sort_asc.png';
                                opacity_desc = 0;
                            }

                            if((parseInt(here.order) === index2) && (here.order_by.toString() === 'desc')){
                                desc_img = 'img/sort_desc.png';
                                opacity_asc = 0;
                            }

                            if($(this).find('.container-arrow').length <= 0){
                                $(this).wrapInner('<div style="position:relative; padding-right:10px;" class="container-arrow">');
                            }

                            $(this).find('div').append('<div style="position:absolute; top:-' + margin + 'px; right: 6px; width:10px; height:10px;" class="order-arrow"><img src="' + asc_img + '" alt="" data-order="asc-' + index2 + '" class="order-by" style="opacity:' + opacity_asc + '"/><img src="' + desc_img + '" alt="" data-order="desc-' + index2 + '" class="order-by" style="margin-top: -25px; opacity:' + opacity_desc + '"/></div>');
                        }
                    });

                    $(this).find('th').each(function(index2){
                        if($(this).hasClass('to-order')){
                            var margin = -10;
                            var opacity_asc = 1;
                            var opacity_desc = 1;
                            var asc_img = 'img/sort_asc_disabled.png';
                            var desc_img = 'img/sort_desc_disabled.png';

                            if(($(this).html().indexOf('<br />') >= 0) || ($(this).html().indexOf('<br>') >= 0) || ($(this).html().indexOf('<br/>') >= 0)){
                                margin = 0;
                            }

                            if((parseInt(here.order) === index2) && (here.order_by.toString() === 'asc')){
                                asc_img = 'img/sort_asc.png';
                                opacity_desc = 0;
                            }

                            if((parseInt(here.order) === index2) && (here.order_by.toString() === 'desc')){
                                desc_img = 'img/sort_desc.png';
                                opacity_asc = 0;
                            }

                            if($(this).find('.container-arrow').length <= 0){
                                $(this).wrapInner('<div style="position:relative; padding-right:10px;" class="container-arrow">');
                            }

                            $(this).find('div').append('<div style="position:absolute; top:' + margin + 'px; right: 6px; width:10px; height:10px;" class="order-arrow"><img src="' + asc_img + '" alt="" data-order="asc-' + index2 + '" class="order-by" style="opacity:' + opacity_asc + '"/><img src="' + desc_img + '" alt="" data-order="desc-' + index2 + '" class="order-by" style="margin-top: -25px; opacity:' + opacity_desc + '"/></div>');
                        }
                    });
                }
            }
        });
        
        var count_elements = 0;
        var actual_el = -1;
        var number = parseInt(here.actual_page) -1;
        var start = number * parseInt(here.max);
        var max = here.max;
        var data_tip_send = '';
        var style_send = '';
        var class_send = '';

        $.when(
            $.get('js/dataTablesBB/template.html', function(t) {
                var template = _.template(t);
                _.each(here.data_table.models, function(t) {
                    if(t.attributes.show.toString() === '1'){
                        _.each(here.data_tip.models, function(t2) {
                            if(parseInt(t2.attributes.data_id) === parseInt(t.attributes.id)){
                                data_tip_send = t2;
                            }
                        });

                        _.each(here.style_td.models, function(t2) {
                            if(parseInt(t2.attributes.data_id) === parseInt(t.attributes.id)){
                                style_send = t2;
                            }
                        });

                        _.each(here.class_table.models, function(t2) {
                            if(parseInt(t2.attributes.data_id) === parseInt(t.attributes.id)){
                                class_send = t2;
                            }
                        });

                        count_elements += 1;
                        actual_el += 1;
                        if((actual_el < (parseInt(start) + parseInt(max))) && (actual_el >= start)){
                            $(here.el).find('tbody').append(template({ data: t, class_td: class_send, data_tip: data_tip_send, style_td: style_send }));
                        }
                    }
                });
            }, 'html')
        ).then(function() {
            $.when(
                _.each(here.info.models, function(t) {
                    $(document).find(here.el).find('#row-' + t.attributes.data_id).after('<tr class="row-drop" id="row-more-' + t.attributes.data_id + '" style="display:none;">' + t.attributes.html + '</tr>');
                })
            ).then(function() {
                if($(here.el).parent().find('.paginate_button').length <= 2){
                    var number_pages = Math.ceil(parseInt(count_elements) / parseInt(here.max));
                    here.max_page = number_pages;
                    for (var i = number_pages; i > 0; i-=1){
                        if(parseInt(here.actual_page) === i){
                            $(here.el).parent().find('.table-request_previous').after('<span><a class="paginate_button current" aria-controls="table-request" data-dt-idx="' + i + '" tabindex="0">' + i + '</a></span>');
                        }
                        else{
                            $(here.el).parent().find('.table-request_previous').after('<span><a class="paginate_button" aria-controls="table-request" data-dt-idx="' + i + '" tabindex="0">' + i + '</a></span>');
                        }
                    }
                }
                else{
                    $(here.el).parent().find('.paginate_button').each(function(index){
                        $(this).removeClass('current');

                        if(parseInt(here.actual_page) === index){
                            $(this).addClass('current');
                        }
                    });
                }
                
                var index_start = (parseInt(start) + 1);
                var index_end_page = (parseInt(start) + parseInt(max));

                if(parseInt(index_end_page) > parseInt(count_elements)){
                    index_end_page = count_elements;
                }

                if(here.option_paginate === true){
                    $(here.el).parent().find('.table-request_info').html('Showing ' + index_start + ' to ' + index_end_page + ' of ' + count_elements + ' entries');
                }
            
                $(document).find('input[type="checkbox"].checkbox').each(function(){
                    if(!$(this).hasClass('checked') && $(this).attr('checked')){
                        $(this).addClass('checked');
                    }

                    $(this).addClass('hidden').before('<span class="' + $(this).attr('class') + '" data-name="' + $(this).attr('name') + '" data-value="' + $(this).attr('value') + '"></span>');

                    if($(this).hasClass('checked') && (! $(this).attr('checked'))){
                        $(this).attr('checked', true);
                    }
                });
            });
        });
    }
});
