
const $ = window.jQuery;
module.exports =  {
    find_message_in_arr_by_id: function(arr, id) {
        console.log(arr);   
        console.log(id);
        if(!arr || arr.lengh <= 0)
            return;
        var indexer = $.map(arr, function(obj, index) {
            if(obj.id === id) {
                return index;
            }
        })
        return indexer[0];
    },
    arrayClone:function(arr) {
        return $.extend(true, [], arr);
    },
    removeByKey:function (array, key){
        array.some(function(item, index) {
            if(array[index].id === key){
                // found it!
                array.splice(index, 1);
                return true; // stops the loop
            }
            return false;
        });
        return array;
    }
}
