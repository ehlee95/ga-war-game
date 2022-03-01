// create arrays to hold cards, war pot, suits, and player decks
let cards = [], pot = [], suits = ["clubs", "spades", "hearts", "diamonds"];
let playerOneDeck = [], playerTwoDeck = [], roundCount = 1;

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

// populates both players decks with random cards 
function populateDecks(cards) {

    // make 52 cards according to suits and ranks
    for(i = 0; i < suits.length; i++)
        for(j = 0; j < 13; j++)
            cards.push(makeCard(suits[i], j));
    
    // shuffle all cards
    let currentIndex = cards.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [cards[currentIndex], cards[randomIndex]] = [
            cards[randomIndex], cards[currentIndex]];
    }
    
    // puts half the cards in each player's deck
    playerOneDeck = cards.splice(0, 26);
    playerTwoDeck = cards.splice(0, 26);
}

populateDecks(cards);

// plays a round of war
function playRound(p1, p2, pot) {

    let roundText = "";

    // this line helps monitor game progress 
    displayText("Round " + roundCount + " - [CARDS IN DECK] P1: " + p1.length + "  |  P2: " + p2.length);
    
    // first checks to see if a player is out of cards, ends the game if true
    if (p1.length === 0) {
        displayText("Player 1 is out of cards. Player 2 wins!");
        return;
    }
    if (p2.length === 0) {
        displayText("Player 2 is out of cards. Player 1 wins!");
        return;
    }

    // draws first (zero index) card from each deck
    let p1card = p1.shift();
    let p2card = p2.shift();

    // compares cards and executes exchange for winners, or triggers a war
    if (p1card.rank > p2card.rank) {
        displayText("Player 1 plays " + p1card.name + ". Player 2 plays " + p2card.name + ". Player 1 wins!");
        displayImages(p1card.name, p2card.name);
        p1.push(p1card, p2card);
    }
    else if (p2card.rank > p1card.rank) {
        displayText("Player 1 plays " + p1card.name + ". Player 2 plays " + p2card.name + ". Player 2 wins!");
        displayImages(p1card.name, p2card.name);
        p2.push(p2card, p1card);
    }
    else {
        displayText("Player 1 plays " + p1card.name + ". Player 2 plays " + p2card.name + ". It's a war!");
        displayImages(p1card.name, p2card.name);
        pot.push(p1card, p2card);
        war(p1, p2, pot);
    }
    roundCount++;
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
        displayText("Player 1 plays " + fourth1.name + ", beating Player 2's " + fourth2.name + ". Player 1 wins the war!");
        displayImages(fourth1.name, fourth2.name);
    }
    else if (fourth2.rank > fourth1.rank) {
        p2.push(fourth1, fourth2);
        for (i = 0; i < pot.length; i++) {
            p2.push(pot[i]);
        }
        pot.splice(0, pot.length);
        displayText("Player 2 plays " + fourth2.name + ", beating Player 1's " + fourth1.name + ". Player 2 wins the war!");
        displayImages(fourth1.name, fourth2.name);
    }
    else {
        displayText("Player 1 plays " + fourth1.name + ". Player 2 plays " + fourth2.name + ". It's another war!");
        displayImages(fourth1.name, fourth2.name);
        pot.push(fourth1, fourth2); 
        war(p1, p2, pot);
    }

}

// runs game continuously until a player has run out of cards
function runGame(p1, p2, pot) {

    while (p1.length !== 0 && p2.length !== 0) {
        playRound(p1, p2, pot);

        if (p1.length === 0) {
            displayText("Player 1 is out of cards. Player 2 wins!");
            return;
        }
        if (p2.length === 0) {
        displayText("Player 2 is out of cards. Player 1 wins!");
            return;
        }
    }
}

runGame(playerOneDeck, playerTwoDeck, pot);

/*
Basic game is complete, now going to try to make it display on the browser instead of the console
 */

function displayText(text) {

// create an "li" node:
const node = document.createElement("li");

// create a text node with the string passed into 'text' parameter
const textnode = document.createTextNode(text);

// append the text node to the "li" node:
node.appendChild(textnode);

// append the "li" node to the list:
document.getElementById("main").appendChild(node);
}

function displayImages(card1, card2) {
    const img1 = document.createElement('img');
    const img2 = document.createElement('img');
    img1.src = "./card-images/" + card1 + ".png";
    img2.src = "./card-images/" + card2 + ".png";
    img1.setAttribute("style", "margin-right: 10px; margin-top: 10px; margin-bottom: 30px; width: 156px")
    img2.setAttribute("style", "margin-top: 10px; margin-bottom: 30px; width: 156px")
    document.getElementById('main').appendChild(img1);
    document.getElementById('main').appendChild(img2);
}

