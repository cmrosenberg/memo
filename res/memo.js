/*jslint browser: true, white: true */

(function memo() {

    "use strict";

    var MOTIVES = document.querySelectorAll("#card-images img"),
    UNOPENED_TEXT = "An unopened card",
    UNOPENED_CLASS = "unopened",
    SOLVED_CLASS = "solved",
    BOARD = document.querySelectorAll("td"),
    SCORE = document.querySelector("#score"),
    NEW_GAME = document.querySelector("button"),
    REMAINING = document.querySelector("#remaining"),
    TRIES = document.querySelector("#tries"),
    SUCCESS = document.querySelector("#success"),
    WAIT_MILLISEC = 1000, opened_card_index = -1, nopened = 0,
    remaining_pairs = 8, points = 0, tries = 0;


    // FUNCTIONS RELATED TO SHUFFLING THE CARDS

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

    // GAME MECHANICS

    function exists_opened_card(){
        return opened_card_index !== -1;
    }

    function illegal_move(index){
        var clicking_on_same_card = exists_opened_card() && (index === opened_card_index),
        already_two_cards_opened = (nopened === 2);
        return clicking_on_same_card || already_two_cards_opened;
    }

    function pairs_match(i, j){
        return BOARD[i].textContent === BOARD[j].textContent;
    }

    function reset_open_card_index(){
        opened_card_index = -1;
    }

    function reset_nopened(){
        nopened = 0;
    }

    function reset_tries(){
        tries = 0;
    }

    function update_tries(){
        tries += 1;
        TRIES.textContent = tries;
    }


    // DOM MANIPULATION FUNCTIONS


    function remove_class(elem, classname){
        if(elem.classList.contains(classname)){
        elem.classList.remove(classname);
        }
    }

    function add_class(elem, classname){
        if(!elem.classList.contains(classname)){
        elem.classList.add(classname);
        }
    }

    function set_motive(tablecell, motive){
        remove_class(tablecell, UNOPENED_CLASS);
        tablecell.style.backgroundImage = "url("+motive.src+")";
    }

    function remove_card(tablecell){
        tablecell.style.backgroundImage = "";
        tablecell.textContent = "";
    }

    function finished_game(){
        SUCCESS.hidden = false;
    }

    function remove_cards(i, j){

        add_class(BOARD[i], SOLVED_CLASS);
        add_class(BOARD[j], SOLVED_CLASS);

        remove_card(BOARD[i]);
        remove_card(BOARD[j]);

        reset_open_card_index();
        reset_nopened();

        if(remaining_pairs === 0){
            finished_game();
        }
    }

    function hide(tablecell){
        tablecell.textContent = UNOPENED_TEXT;
        tablecell.style.backgroundImage = "";
        add_class(tablecell, UNOPENED_CLASS);
    }

    function hide_cards(i, j){
        hide(BOARD[i]);
        hide(BOARD[j]);
        reset_open_card_index();
        reset_nopened();
    }

    function reward_point(){
        points += 1;
        remaining_pairs -= 1;

        SCORE.textContent = points;
        REMAINING.textContent = remaining_pairs;
    }

    function reset_board(){
        Array.prototype.forEach.call(BOARD, function(cell) {
            cell.textContent = UNOPENED_TEXT;
            remove_class(cell, SOLVED_CLASS);
            add_class(cell, UNOPENED_CLASS);
        });
    }

    function reset_DOM(){
        SUCCESS.hidden = true;
        SCORE.textContent = 0;
        REMAINING.textContent = 8;
        TRIES.textContent = 0;

        reset_board();
        reset_open_card_index();
        reset_nopened();
        reset_tries();
    }

    function open(new_motive, index){
        BOARD[index].textContent = new_motive.alt;
        nopened += 1;


        set_motive(BOARD[index], new_motive);

        // We need the following test so that the opened_card_index
        // is not reset before the callback in when_user_opens_card()
        // is executed. This could happen if the user clicks on distinct
        // cards in "rapid" (< WAIT_MILLISEC) succession.
        if(!exists_opened_card()){
            opened_card_index = index;
        }
    }

    // INITIALIZATION FUNCTIONS

    function createEventListener(motive, index){

        return function when_user_opens_card(){

            if(illegal_move(index)){
                return;
            }

            open(motive, index);

            setTimeout(function(){

                // We need this test in the callback function to avoid
                // checking an index against itself, which could otherwise happen
                // if the user "click-spams" the same card. We could avoid this
                // if-test by making our predicates less naïve (ie. always checking
                // that the provided indexes are distinct), but I felt this was
                //  a better solution for now.

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

                update_tries();

            }, WAIT_MILLISEC);
        };
    }

    function initialize_game(){
        var i, lim = BOARD.length, shuffled_motives = shuffle_motives(MOTIVES);

        for(i = 0; i < lim; i += 1){
            BOARD[i].onclick = createEventListener(shuffled_motives.pop(), i);
        }
    }

    function new_game(){
        reset_DOM();
        initialize_game();
    }

    NEW_GAME.onclick = new_game;
    initialize_game();

}());
