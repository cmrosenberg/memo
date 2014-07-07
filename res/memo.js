/*jslint browser: true, white: true */

(function memo() {

    "use strict";

    var IMAGE_URLS = ["res/SVG/bell.svg", "res/SVG/briefcase.svg", "res/SVG/bug.svg", "res/SVG/clubs.svg", "res/SVG/earth.svg", "res/SVG/flag.svg", "res/SVG/gift.svg", "res/SVG/smiley.svg"],
        CONCEALED_URL = "res/SVG/concealed.svg",
        DOM_TABLE = document.querySelectorAll("td");

    function random_upto(max_index){
        return Math.floor((Math.random()*1000000)) % max_index;
    }

    function remove_index(array, index){
        array.splice(array.indexOf(index), 1);
    }
    
    function pick_index(indices){
        return indices[random_upto(indices.length)];
    }
    
    function pop_index(indices){
        var index = pick_index(indices);
        remove_index(indices, index);
        return index;
    }
    
    function make_accessor_to(array, indices){
        return function insert_pair(image_url) {
            var i = pop_index(indices),
                j = pop_index(indices);
            array[i] = image_url;
            array[j] = image_url;
        };
    }
    
    function shuffle_cards(image_urls){
        var solution = new Array(16),
            indices = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
        
        image_urls.forEach(make_accessor_to(solution, indices));
        return solution;
    }
    
    function make_toggler(cell, image_url){
        var image = cell.querySelector('img');
        var original_url = image.src;
        return function toggle_image(){
            if(image.src === original_url){
                image.src = image_url;
            }
            else {
                image.src = original_url;
            }
        }
    }
    
    function associate(cell, image_url){
        var toggle = make_toggler(cell, image_url);
        cell.onclick = toggle;
    }
    
    function associate_images_with_grid(grid, images){
        var i;
        for(i = 0; i < grid.length; i += 1){
            associate(grid[i], images.pop());
        }
    }
    
    function initialize_game(){
        var shuffled_deck = shuffle_cards(IMAGE_URLS);
        associate_images_with_grid(DOM_TABLE, shuffled_deck);
    }

    initialize_game();

}());
