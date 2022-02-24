// generate initial game state:

// use loops to create 52 card objects with: rank, suit, name, owner

// create arrays to hold cards, war pot, suits, and player decks
let cards = [], pot = [], suits = ["clubs", "spades", "hearts", "diamonds"];
let playerOneDeck = [], playerTwoDeck = [];

// make 52 cards according to suits and ranks
for(i = 0; i < suits.length; i++)
    for(j = 0; j < 13; j++)
        cards.push(makeCard(suits[i], j));

// generate cards with starting characteristics
function makeCard(suit, rank) {
    var card = {
        suit: suit,
        rank: rank
    }
    nameCard(card);
    return card;
}

// names a card according to its colloquial name
function nameCard(card) {
    let value = ["two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "jack", "queen", "king", "ace"];
    card.name = value[card.rank] + " of " + card.suit;
}

// randomly populates the deck arrays 
function populateDecks(cards) {
    for (i = 0; i < cards.length; i++) {
        if (Math.round(Math.random() + 1) === 1) {
            playerOneDeck.push(cards[i]);
        }
        else {
            playerTwoDeck.push(cards[i]);
        }
    }
}
populateDecks(cards);

// this method sometimes gives more cards to one player, so we need to balance the decks to start
// we can start by making a function to pick a random card to splice out of p1 and push to p2
function swapCard(p1, p2) {
    let randIndex = 0;
    if (p1.length > p2.length) {
        randIndex = Math.floor(Math.random() * p1.length);
        p2.push(p1.splice(randIndex, 1)[0]);
    }
    else {
        randIndex = Math.floor(Math.random() * p2.length)
        p1.push(p2.splice(randIndex, 1)[0]);
    } 
}

// calls the swapCard function until the decks have an equal number of cards
function balanceDecks(p1, p2) {
    while (p1.length !== p2.length) {
        swapCard(p1, p2);
    }
}
balanceDecks(playerOneDeck, playerTwoDeck);

// the decks are still organized in ascending rank/suit order, so we need to shuffle the cards

function shuffle(arr) {
    let currentIndex = arr.length,  randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [arr[currentIndex], arr[randomIndex]] = [
            arr[randomIndex], arr[currentIndex]];
    }
    return arr;
}
playerOneDeck = shuffle(playerOneDeck);
playerTwoDeck = shuffle(playerTwoDeck);

/*

Starting conditions are set!

 */

// plays a round of war
function playRound(p1, p2, pot) {

    // this line helps monitor game progress 
    console.log("[CARDS LEFT] P1: " + p1.length + "  |  P2: " + p2.length);
    
    // first checks to see if a player is out of cards, ends the game if true
    if (p1.length === 0) {
        console.log("Player 1 is out of cards. Player 2 wins!");
        return;
    }
    if (p2.length === 0) {
        console.log("Player 2 is out of cards. Player 1 wins!");
        return;
    }

    // draws first (zero index) card from each deck
    let p1card = p1.shift();
    let p2card = p2.shift();

    // compares cards and executes exchange for winners, or triggers a war
    if (p1card.rank > p2card.rank) {
        console.log("Player 1 plays " + p1card.name + ". Player 2 plays " + p2card.name + ". Player 1 wins!");
        p1.push(p1card, p2card);
    }
    else if (p2card.rank > p1card.rank) {
        console.log("Player 1 plays " + p1card.name + ". Player 2 plays " + p2card.name + ". Player 2 wins!");
        p2.push(p2card, p1card);
    }
    else {
        console.log("Player 1 plays " + p1card.name + ". Player 2 plays " + p2card.name + ". It's a war!");
        pot.push(p1card, p2card);
        war(p1, p2, pot);
    }
}



function war(p1, p2, pot) {

    // if either player doesn't have enough cards to complete the war, they lose the game
    if (p1.length < 4) {
        p1.splice(0, p1.length);
        return;
    }
    if (p2.length < 4) {
        p2.splice(0, p2.length);
        return;
    }

    // draw three cards from each deck into the pot
    for (i = 0; i < 3; i++) {
        pot.push(p1.shift());
        pot.push(p2.shift());
    }
    
    // pull fourth cards from each deck
    fourth1 = p1.shift();
    fourth2 = p2.shift();
    
    // if ranks are different, give all cards to winning player
    if (fourth1.rank > fourth2.rank) {
        p1.push(fourth1, fourth2);
        for (i = 0; i < pot.length; i++) {
            p1.push(pot[i]);
        }
        pot.splice(0, pot.length);
        console.log("Player 1 plays " + fourth1.name + ", beating Player 2's " + fourth2.name + ". Player 1 wins the war!");
    }
    else if (fourth2.rank > fourth1.rank) {
        p2.push(fourth1, fourth2);
        for (i = 0; i < pot.length; i++) {
            p2.push(pot[i]);
        }
        pot.splice(0, pot.length);
        console.log("Player 2 plays " + fourth2.name + ", beating Player 1's " + fourth1.name + ". Player 2 wins the war!");
    }
    else {
        console.log("Player 1 plays " + fourth1.name + ". Player 2 plays " + fourth2.name + ". It's another war!");
        pot.push(fourth1, fourth2); 
        war(p1, p2, pot);
    }

}

// runs game continuously until a player has run out of cards
function runGame(p1, p2, pot) {

    while (p1.length !== 0 && p2.length !== 0) {
        playRound(p1, p2, pot);

        if (p1.length === 0) {
            console.log("Player 1 is out of cards. Player 2 wins!");
            return;
        }
        if (p2.length === 0) {
        console.log("Player 2 is out of cards. Player 1 wins!");
            return;
        }
    }
}

runGame(playerOneDeck, playerTwoDeck, pot);
