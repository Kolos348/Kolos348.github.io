const monsters = {
  Skeleton: {
    health: 80,
    maxHealth: 80,
    mana: 60,
    maxMana: 60,
    attackPower: 15
  },
  Goblin: {
    health: 70,
    maxHealth: 70,
    mana: 40,
    maxMana: 40,
    attackPower: 10
  },
  Orc: {
    health: 100,
    maxHealth: 100,
    mana: 30,
    maxMana: 30,
    attackPower: 20
  },
  Troll: {
    health: 120,
    maxHealth: 120,
    mana: 20,
    maxMana: 20,
    attackPower: 25
  },
  Vampire: {
    health: 90,
    maxHealth: 90,
    mana: 80,
    maxMana: 80,
    attackPower: 18
  },
  Werewolf: {
    health: 110,
    maxHealth: 110,
    mana: 50,
    maxMana: 50,
    attackPower: 22
  },
  ['Dark Mage']: {
    health: 60,
    maxHealth: 60,
    mana: 100,
    maxMana: 100,
    attackPower: 10
  }
};


function GenerateMonster(instance){
  const monsterNames = Object.keys(monsters);
  const randomName = monsterNames[Math.floor(Math.random() * monsterNames.length)];
  const selectedMonsterStats = monsters[randomName];
  if(instance.monster){
    instance.monster.health = selectedMonsterStats.health;
    instance.monster.maxHealth = selectedMonsterStats.health;
    instance.monster.mana = selectedMonsterStats.mana;
    instance.monster.maxMana = selectedMonsterStats.mana;
    instance.monster.attackPower = selectedMonsterStats.attackPower;
    instance.monsterName.textContent = randomName
    return instance.monster;
  }else{
    instance.monsterName.textContent = randomName
    return new Character(randomName, selectedMonsterStats.health, selectedMonsterStats.maxHealth, selectedMonsterStats.mana, selectedMonsterStats.maxMana, selectedMonsterStats.attackPower);
  }
}

class Character {
  constructor(name, health, maxHealth, mana, maxMana, attackPower) {
    this.name = name;
    this.health = health;
    this.maxHealth = maxHealth;
    this.mana = mana;
    this.maxMana = maxMana;
    this.attackPower = attackPower;
  }

  attack(user,target) {
    const damage = user.attackPower;
    target.takeDamage(damage);
    return `${user.name} attacks ${target.name} for ${damage} damage!`;
  }

  takeDamage(amount) {
    this.health = Math.max(this.health - amount, 0);
  }

  heal(user, target) {
    const manaCost = 20;
    const healAmount = 20;
    if (user.mana >= manaCost) {
      user.mana -= manaCost;
      user.health = Math.min(user.health + healAmount, 100);
      return `${user.name} heals for ${healAmount} HP! (-${manaCost} Mana)`;
    } else {
      return user.attack(user, target); // fallback to attack
    }
  }

  rest() {
    const regenAmount = 30; // Fixed mana regeneration
    this.mana = Math.min(this.mana + regenAmount, 100);
    return `${this.name} rests and regenerates ${regenAmount} Mana!`;
  }

  special(user,target) {
    if(user.mana >= 50){
      user.mana -= 50;
      const damage = user.attackPower*2.5;
      target.takeDamage(damage);
      return `${user.name} uses SPECIAL on ${target.name} for ${damage} damage!`;
    }
    else{
      return user.attack(user,target)
    }
  }
}

class Game {
  constructor() {
    this.log = document.getElementById('log');
    this.monsterName = document.getElementById('monsterName')
    this.heroHealth = document.getElementById('heroHealth');
    this.monsterHealth = document.getElementById('monsterHealth');
    this.heroMana = document.getElementById('heroMana');
    this.monsterMana = document.getElementById('monsterMana');
    this.restartBtn = document.getElementById('restartBtn');

    this.hero = new Character('Hero', 100, 100, 100, 100, 20);
    this.monster = GenerateMonster(this);
    this.updateHealth();
    this.updateMana();

    document.getElementById('attackBtn').addEventListener('click', () => this.playTurn('attack'));
    document.getElementById('healBtn').addEventListener('click', () => this.playTurn('heal'));
    document.getElementById('restBtn').addEventListener('click', () => this.playTurn('rest'));
    document.getElementById('specialBtn').addEventListener('click', () => this.playTurn('special'));
    this.restartBtn.addEventListener('click', () => this.restart());
  }

  playTurn(action) {
    let heroAction;
    if (action === 'attack') heroAction = this.hero.attack(this.hero,this.monster);
    else if (action === 'heal') heroAction = this.hero.heal(this.hero,this.monster);
    else if (action === 'rest') heroAction = this.hero.rest();
    else if (action === 'special') heroAction = this.hero.special(this.hero,this.monster);

   let monsterAction;
    if (this.monster.health <= 40 && this.monster.mana >= 20) {
      monsterAction = this.monster.heal(this.monster, this.hero);
    } else {
      const choice = Math.floor(Math.random() * 3);
      if (choice === 0 && this.monster.mana <= 70) {
        monsterAction = this.monster.rest();
      } else if (choice === 1 && this.monster.mana >= 50) {
        monsterAction = this.monster.special(this.monster, this.hero);
      } else {
        monsterAction = this.monster.attack(this.monster, this.hero);
      }
    }
    this.updateHealth();
    this.updateMana();
    this.log.textContent = `${heroAction} | ${monsterAction}`;

    if (this.hero.health <= 0 || this.monster.health <= 0) {
      this.endGame();
    }
  }

  updateHealth() {
    this.heroHealth.textContent = `Health: ${this.hero.health}`;
    this.heroHealth.style.width = `${100*(this.hero.health/this.hero.maxHealth)}%`
    this.monsterHealth.textContent = `Health: ${this.monster.health}`;
    this.monsterHealth.style.width = `${100*(this.monster.health/this.monster.maxHealth)}%`
  }

   updateMana() {
    this.heroMana.textContent = `Health: ${this.hero.mana}`;
    this.heroMana.style.width = `${100*(this.hero.mana/this.hero.maxMana)}%`
    this.monsterMana.textContent = `Health: ${this.monster.mana}`;
    this.monsterMana.style.width = `${100*(this.monster.mana/this.monster.maxMana)}%`
  }

  endGame() {
    const winner = this.hero.health > 0 ? 'Hero' : 'Monster';
    this.log.textContent += ` 🏆 ${winner} wins!`;
    document.querySelectorAll('button').forEach(btn => btn.disabled = true);
    this.restartBtn.classList.remove('d-none');
    this.restartBtn.disabled = false;
  }

  restart() {
    this.hero.health = 100;
    this.hero.mana = 100;
    this.monster = GenerateMonster(this)
    this.updateHealth();
    this.updateMana();
    this.log.textContent = '';
    document.querySelectorAll('button').forEach(btn => btn.disabled = false);
    this.restartBtn.classList.add('d-none');
  }
}

new Game();
