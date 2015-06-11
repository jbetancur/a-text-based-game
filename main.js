process.stdin.setEncoding('utf8');
let VERBOSE = true;
let player1Template = {name: 'John', hp: 20, ac: 5, thac0: 16, dmgNum: 1, dmgSize: 4, dmgMod: 0};
let player2Template = {name: 'Maya', hp: 22, ac: 6, thac0: 15, dmgNum: 1, dmgSize: 4, dmgMod: 0};
let player1;
let player2;
let player1Wins = 0;
let player2Wins = 0;

function display(s) {
  if (VERBOSE) {
    console.log(s);
  }
}

function random(min, max) {
  return Math.floor((Math.random() * max) + min);
}

function delaySync(milliseconds) {
  var start = new Date().getTime();
  for (let i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function attack(attacker, defender) {
  if (random(1, 20) >= attacker.thac0 - defender.ac) {
    let damage = 0;
    for (let i = 0; i < attacker.dmgNum; i++) {
      damage += random(1, attacker.dmgSize);
    }
    damage += attacker.dmgMod;
    display(`${attacker.name} (${attacker.hp} hp) hits ${defender.name} (${defender.hp} hp) for ${damage} points of damage. ${defender.name} is reduced to ${defender.hp - damage} hp`);
    process.stdout.write('\x07');
    delaySync(1000);
    return damage;
  } else {
    display(`${attacker.name} misses ${defender.name}!`);
    delaySync(1000);
    return 0;
  }
}

function play(player1, player2) {
  display(`Starting Combat. You Killed My Father... Prepare to Die!`);
  delaySync(2000);
  while (player1.hp > 0 || player2.hp > 0) {
    // Player 1
    if (player1.hp <= 0) {
      break;
    }
    let player1Damage = attack(player1, player2);
    player2.hp =  player2.hp - player1Damage;

    //Player 2
    if (player2.hp <= 0) {
      break;
    }
    let player2Damage = attack(player2, player1);
    player1.hp = player1.hp - player2Damage;
  }

  if (player1.hp <= 0) {
    display(`${player1.name} has died!`);
    display(`${player2.name} Wins!`);
    player2Wins += 1;
  }

  if (player2.hp <= 0) {
    display(`${player2.name} has died!`);
    display(`${player1.name} Wins!`);
    player1Wins += 1;
  }
  display(`${player1.name} Wins: ${player1Wins}, ${player2.name} Wins: ${player2Wins}`);
}

function initGame() {
  //Hacky way to copy object
  player1 = JSON.parse(JSON.stringify(player1Template));
  player2 = JSON.parse(JSON.stringify(player2Template));;

  play(player1, player2);
  process.stdout.write('Would You Like to Fight Again? (y/n) ');
}

//MAIN
process.stdin.on('data', function (chunk) {
  chunk.indexOf('y') > -1 || chunk.indexOf('Y') > -1 ? initGame() : process.exit(0);
});

process.stdout.write('Ready to for a Fight? (y/n) ');
