/* ─── Server-side game engine — port of game_engine.py ─── */

const crypto = require('crypto');

const ROLES = {
  square:    { color: '#e74c3c', speed: 3, hp: 150, size: 25,      attack: 1 },
  triangle:  { color: '#3498db', speed: 4, hp: 150, size: 28,      attack: 1.2 },
  circle:    { color: '#2ecc71', speed: 2.5, hp: 150, size: 22,    attack: 0.8 },
  rectangle: { color: '#9b59b6', speed: 2, hp: 150, size: { w: 35, h: 22 }, attack: 1.5 }
};
const SPAWN_INTERVALS = { square: 72, triangle: 60, circle: 90, rectangle: 48 };

class Player {
  constructor(roleId, config) {
    this.x = 400; this.y = 300;
    this.role = roleId; this.color = config.color;
    this.speed = config.speed; this.hp = config.hp; this.maxHp = config.hp;
    this.size = config.size; this.attackDmg = config.attack;
    this.invincible = false; this.invincibleTimer = 0;
    this.lastDx = 0; this.lastDy = 1;
    this.attackTimer = 0; this.slashTimer = 0;
  }
}

class Monster {
  constructor(x, y) {
    const types = ['circle', 'triangle', 'square'];
    const colors = ['#c0392b', '#8e44ad', '#d35400', '#16a085', '#2c3e50', '#7f8c8d'];
    this.x = x; this.y = y;
    this.type = types[Math.floor(Math.random() * 3)];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.maxHp = 2 + Math.floor(Math.random() * 3);
    this.hp = this.maxHp;
    this.speed = 0.8 + Math.random() * 0.8;
  }
}

class Energy {
  constructor(x, y) { this.x = x; this.y = y; }
}

class GameState {
  constructor(roleId, words) {
    const config = ROLES[roleId];
    this.id = crypto.randomUUID();
    this.player = new Player(roleId, config);
    this.monsters = []; this.energies = [];
    this.score = 0; this.running = true;
    this.spellActive = false; this.currentWord = '';
    this.tick = 0; this.lastSpawnTick = 0; this.lastEnergyTick = 0;
    this.spawnInterval = SPAWN_INTERVALS[roleId] || 60;
    this.energyInterval = 300;
    this.words = words;
    this.wordsAttempted = 0; this.wordsCorrect = 0;
    this.monstersKilled = 0; this.startTime = Date.now();
  }

  update(keys) {
    if (!this.running || this.spellActive) return;
    this.tick++;

    if (this.player.invincible) {
      this.player.invincibleTimer--;
      if (this.player.invincibleTimer <= 0) this.player.invincible = false;
    }
    if (this.player.attackTimer > 0) this.player.attackTimer--;
    if (this.player.slashTimer > 0) this.player.slashTimer--;

    let dx = 0, dy = 0;
    if (keys.w) dy = -1; if (keys.s) dy = 1;
    if (keys.a) dx = -1; if (keys.d) dx = 1;
    if (dx && dy) { dx *= 0.707; dy *= 0.707; }
    if (dx || dy) { this.player.lastDx = dx; this.player.lastDy = dy; }

    this.player.x += dx * this.player.speed;
    this.player.y += dy * this.player.speed;
    this.player.x = Math.max(25, Math.min(775, this.player.x));
    this.player.y = Math.max(25, Math.min(575, this.player.y));

    for (const m of this.monsters) {
      const a = Math.atan2(this.player.y - m.y, this.player.x - m.x);
      m.x += Math.cos(a) * m.speed; m.y += Math.sin(a) * m.speed;
    }

    this.monsters = this.monsters.filter(m => this._checkMonsterCollision(m));
    this.energies = this.energies.filter(e => this._checkEnergyCollection(e));

    if (this.tick - this.lastSpawnTick >= this.spawnInterval) {
      this._spawnMonster(); this.lastSpawnTick = this.tick;
    }
    if (this.tick - this.lastEnergyTick >= this.energyInterval) {
      this._spawnEnergy(); this.lastEnergyTick = this.tick;
    }
  }

  _checkMonsterCollision(m) {
    const dist = Math.hypot(this.player.x - m.x, this.player.y - m.y);
    if (dist < 30 && !this.player.invincible) {
      this.player.hp -= 0.5;
      if (this.player.hp <= 0) { this.running = false; return false; }
      if (this.player.hp < 50 && !this.spellActive) this.triggerSpell();
    }
    return m.hp > 0;
  }

  _checkEnergyCollection(e) {
    const dist = Math.hypot(this.player.x - e.x, this.player.y - e.y);
    if (dist < 30 && !this.spellActive) { this.triggerSpell(); return false; }
    return true;
  }

  _spawnMonster() {
    let x, y;
    const side = Math.floor(Math.random() * 4);
    if (side === 0) { x = Math.random() * 800; y = -30; }
    else if (side === 1) { x = 830; y = Math.random() * 600; }
    else if (side === 2) { x = Math.random() * 800; y = 630; }
    else { x = -30; y = Math.random() * 600; }
    this.monsters.push(new Monster(x, y));
  }

  _spawnEnergy() {
    this.energies.push(new Energy(30 + Math.random() * 740, 30 + Math.random() * 540));
  }

  attack(mouseX, mouseY) {
    if (this.player.attackTimer > 0 || !this.running || this.spellActive) return;
    this.player.attackTimer = 15; this.player.slashTimer = 10;

    let dirX = this.player.lastDx, dirY = this.player.lastDy;
    if (mouseX !== undefined && mouseY !== undefined) {
      dirX = mouseX - this.player.x; dirY = mouseY - this.player.y;
      const d = Math.hypot(dirX, dirY);
      if (d > 0) { dirX /= d; dirY /= d; this.player.lastDx = dirX; this.player.lastDy = dirY; }
    }

    const range = 100, width = 35;
    for (const m of this.monsters) {
      const dx = m.x - this.player.x, dy = m.y - this.player.y;
      const dist = Math.hypot(dx, dy);
      if (dist > range + 15) continue;
      if (dist > 0) { const dot = (dx * dirX + dy * dirY) / dist; if (dot < 0.3) continue; }
      const perp = dist > 0 ? Math.abs(-dx * dirY + dy * dirX) / dist : 0;
      if (perp > width) continue;
      m.hp -= this.player.attackDmg;
      if (m.hp <= 0) { this.score += 10; this.monstersKilled++; }
    }
  }

  activateSuper() {
    if (!this.running || this.spellActive) return;
    for (const m of this.monsters) { this.score += 5; this.monstersKilled++; }
    this.monsters = [];
    this.player.invincible = true; this.player.invincibleTimer = 180;
  }

  triggerSpell() {
    if (!this.words.length) return;
    this.spellActive = true;
    this.currentWord = this.words[Math.floor(Math.random() * this.words.length)];
  }

  checkSpell(given) {
    const correct = given.trim().toLowerCase() === this.currentWord.toLowerCase();
    this.wordsAttempted++;
    if (correct) {
      this.wordsCorrect++;
      if (this.player.hp < 50) {
        this.monsters = this.monsters.filter(m => Math.hypot(this.player.x - m.x, this.player.y - m.y) > 30);
      }
      this.player.hp = Math.min(this.player.maxHp, this.player.hp + 50);
    }
    this.spellActive = false; this.currentWord = '';
    return correct;
  }

  toJSON() {
    const size = typeof this.player.size === 'object' ? { ...this.player.size } : this.player.size;
    return {
      id: this.id,
      player: {
        x: this.player.x, y: this.player.y, role: this.player.role,
        color: this.player.color, hp: this.player.hp, maxHp: this.player.maxHp,
        size, invincible: this.player.invincible,
        lastDx: this.player.lastDx, lastDy: this.player.lastDy,
        slashTimer: this.player.slashTimer
      },
      monsters: this.monsters.map(m => ({
        x: m.x, y: m.y, type: m.type, color: m.color, hp: m.hp, maxHp: m.maxHp
      })),
      energies: this.energies.map(e => ({ x: e.x, y: e.y })),
      score: this.score, running: this.running,
      spellActive: this.spellActive, currentWord: this.currentWord
    };
  }

  getFinalStats() {
    return {
      gameId: this.id, role: this.player.role, score: this.score,
      hpRemaining: this.player.hp, monstersKilled: this.monstersKilled,
      wordsAttempted: this.wordsAttempted, wordsCorrect: this.wordsCorrect,
      duration: Math.round((Date.now() - this.startTime) / 100) / 10
    };
  }
}

module.exports = { GameState, ROLES };
