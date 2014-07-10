/*jslint browser: true, white: true */

(function memo() {

    "use strict";

    var MOTIVES = document.querySelectorAll("#card-images img"),
    CONCEALED_URL = document.querySelector("img").src,
    BOARD = document.querySelectorAll("td"),
    SCORE = document.querySelector("#score"),
    REMAINING = document.querySelector("#remaining"),
    opened_card_index = -1, remaining_pairs = 8, points = 0;

    function random_upto(max_index){
        return Math.floor((Math.random()*1000000)) % max_index;
    }

    function remove_index(array, index){
        array.splice(array.indexOf(index), 1);
    }

    function pick_random_index(indices){
        return indices[random_upto(indices.length)];
    }

    function pop_random_index(indices){
        var index = pick_random_index(indices);
        remove_index(indices, index);
        return index;
    }

    function shuffle_motives(motives){
        var solution = new Array(16),
        indices = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];


        Array.prototype.forEach.call(motives, function insert_pair(image) {
            var i = pop_random_index(indices),
            j = pop_random_index(indices);
            solution[i] = image;
            solution[j] = image;
        });

        return solution;
    }

    function get_motive(index){
        return BOARD[index].querySelector("img");
    }

    function open(new_motive, index){
        var current_motive = get_motive(index);
        current_motive.src = new_motive.src;
    }

    function exists_opened_card(){
        return opened_card_index !== -1;
    }

    function pairs_match(i, j){
        return get_motive(i).src === get_motive(j).src;
    }

    function reset_open_card_index(){
        opened_card_index = -1;
    }

    function remove_cards(i, j){
        BOARD[i].classList.add("solved");
        BOARD[j].classList.add("solved");
        reset_open_card_index();
    }

    function hide_cards(i, j){
        BOARD[i].querySelector("img").src = CONCEALED_URL;
        BOARD[j].querySelector("img").src = CONCEALED_URL;
        reset_open_card_index();
    }


    function reward_point(){
        points += 1;
        remaining_pairs -= 1;

        SCORE.textContent = points;
        REMAINING.textContent = remaining_pairs;
    }

    function createEventListener(motive, index){

        return function when_user_opens_card(){
            open(motive, index);

            setTimeout(function(){
            if(exists_opened_card()){

                if(opened_card_index === index){
                    return;
                }

                if(pairs_match(opened_card_index, index)){
                    reward_point();
                    remove_cards(opened_card_index, index);
                }
                else{
                    hide_cards(opened_card_index, index);
                }
            }
            else {
                opened_card_index = index;
            }
        }, 1000);
    }
    }

    function initialize_game(){
        var i, lim = BOARD.length, shuffled_motives = shuffle_motives(MOTIVES);


        for(i = 0; i < lim; i += 1){
            BOARD[i].onclick = createEventListener(shuffled_motives.pop(), i);
        }
    }

    initialize_game();

}());
