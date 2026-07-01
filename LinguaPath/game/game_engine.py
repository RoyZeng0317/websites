import random
import math
import uuid
import json
import os
import time

ROLES = {
    'square': {'color': '#e74c3c', 'speed': 3, 'hp': 150, 'size': 25, 'attack': 1},
    'triangle': {'color': '#3498db', 'speed': 4, 'hp': 150, 'size': 28, 'attack': 1.2},
    'circle': {'color': '#2ecc71', 'speed': 2.5, 'hp': 150, 'size': 22, 'attack': 0.8},
    'rectangle': {'color': '#9b59b6', 'speed': 2, 'hp': 150, 'size': {'w': 35, 'h': 22}, 'attack': 1.5},
    'pentagon': {'color': '#e67e22', 'speed': 3.2, 'hp': 150, 'size': 24, 'attack': 1.1}
}

SPAWN_INTERVALS = {
    'square': 72,
    'triangle': 60,
    'circle': 90,
    'rectangle': 48,
    'pentagon': 65
}

class Player:
    def __init__(self, role_id, config):
        self.x = 400.0
        self.y = 300.0
        self.role = role_id
        self.color = config['color']
        self.speed = config['speed']
        self.hp = config['hp']
        self.max_hp = config['hp']
        self.size = config['size']
        self.attack_dmg = config['attack']
        self.invincible = False
        self.invincible_timer = 0
        self.last_dx = 0.0
        self.last_dy = 1.0
        self.attack_timer = 0
        self.slash_timer = 0
        self.cefr_level = 'A1'
        self.cefr_xp = 0
        self.cefr_threshold = 100
        self.skill_points = 0

class Monster:
    def __init__(self, x, y, px, py):
        types = ['circle', 'triangle', 'square']
        colors = ['#c0392b', '#8e44ad', '#d35400', '#16a085', '#2c3e50', '#7f8c8d']
        self.x = x
        self.y = y
        self.type = random.choice(types)
        self.color = random.choice(colors)
        self.max_hp = 2 + random.randint(0, 2)
        self.hp = self.max_hp
        self.speed = 0.8 + random.random() * 0.8
        self.target_x = px
        self.target_y = py

class Energy:
    def __init__(self, x, y):
        self.x = x
        self.y = y

class Boss:
    def __init__(self, x, y, weaknesses):
        self.x = x
        self.y = y
        self.max_hp = 20 + random.randint(0, 10)
        self.hp = self.max_hp
        self.speed = 0.5 + random.random() * 0.3
        self.attack_dmg = 10
        self.attack_timer = 0
        self.attack_cooldown = 120
        self.weaknesses = weaknesses[:5]
        self.target_x = x
        self.target_y = y
        self.color = '#8e44ad'
        self.size = 35

class NPC:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.dialogues = random.choice([
            ["Hello there!", "Keep up the great work!", "Here are some skill points for you."],
            ["You're learning fast!", "Practice makes perfect.", "Take these skill points!"],
            ["I've been watching you.", "Your vocabulary is growing.", "Well earned skill points!"]
        ])
        self.dialogue_index = 0
        self.skill_point_reward = 15
        self.interacted = False
        self.name = random.choice(["Sage", "Mentor", "Guide", "Scholar", "Tutor"])

SKILLS = [
    {'id': 'shield', 'name': 'Shield', 'cost': 30, 'desc': '5s invincibility'},
    {'id': 'hint', 'name': 'Word Hint', 'cost': 15, 'desc': 'Reveals first letter'},
    {'id': 'cleave', 'name': 'Area Clear', 'cost': 50, 'desc': 'Kill all monsters'},
    {'id': 'double_xp', 'name': 'Double XP', 'cost': 20, 'desc': '2x CEFR XP for 30s'},
]

LANGUAGE_NAMES = {'en': 'English', 'ja': '日本語', 'ko': '한국어'}

class GameState:
    def __init__(self, role_id, language='en'):
        config = ROLES[role_id]
        self.id = str(uuid.uuid4())
        self.language = language
        self.player = Player(role_id, config)
        self.monsters = []
        self.energies = []
        self.score = 0
        self.running = True
        self.spell_active = False
        self.current_word = ''
        self.tick = 0
        self.last_spawn_tick = 0
        self.last_energy_tick = 0
        self.spawn_interval = SPAWN_INTERVALS.get(role_id, 60)
        self.energy_interval = 300
        self.words = []
        self.words_attempted = 0
        self.words_correct = 0
        self.monsters_killed = 0
        self.boss = None
        self.npcs = []
        self.near_npc = None
        self.boss_spawn_threshold = 5
        self.npc_spawn_interval = 600
        self.last_npc_tick = 0
        self.unlocked_skills = []
        self.shop_open = False
        self.double_xp_active = False
        self.double_xp_timer = 0
        self.start_time = time.time()
        self.set_words_for_level(self.player.cefr_level)

    def set_words_for_level(self, level):
        levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
        idx = levels.index(level) if level in levels else 0
        active = levels[max(0, idx - 1):min(6, idx + 2)]
        pool = WORD_POOLS.get(self.language, WORD_POOLS['en'])
        words = []
        for lvl in active:
            words.extend(pool.get(lvl, []))
        self.words = words[:100] if words else ["apple", "brave", "crane", "dance", "eagle"]

    def update(self, keys):
        if not self.running or self.spell_active:
            return
        self.tick += 1

        if self.player.invincible:
            self.player.invincible_timer -= 1
            if self.player.invincible_timer <= 0:
                self.player.invincible = False

        if self.double_xp_active:
            self.double_xp_timer -= 1
            if self.double_xp_timer <= 0:
                self.double_xp_active = False

        if self.player.attack_timer > 0:
            self.player.attack_timer -= 1
        if self.player.slash_timer > 0:
            self.player.slash_timer -= 1

        dx, dy = 0.0, 0.0
        if keys.get('w'): dy = -1
        if keys.get('s'): dy = 1
        if keys.get('a'): dx = -1
        if keys.get('d'): dx = 1

        if dx != 0 and dy != 0:
            dx *= 0.707
            dy *= 0.707

        if dx != 0 or dy != 0:
            self.player.last_dx = dx
            self.player.last_dy = dy

        self.player.x += dx * self.player.speed
        self.player.y += dy * self.player.speed
        self.player.x = max(25, min(775, self.player.x))
        self.player.y = max(25, min(575, self.player.y))

        for m in self.monsters:
            angle = math.atan2(self.player.y - m.y, self.player.x - m.x)
            m.target_x = self.player.x
            m.target_y = self.player.y
            m.x += math.cos(angle) * m.speed
            m.y += math.sin(angle) * m.speed

        self.monsters = [m for m in self.monsters if self._check_monster_collision(m)]
        self.energies = [e for e in self.energies if self._check_energy_collection(e)]

        if self.tick - self.last_spawn_tick >= self.spawn_interval:
            self._spawn_monster()
            self.last_spawn_tick = self.tick

        if self.tick - self.last_energy_tick >= self.energy_interval:
            self._spawn_energy()
            self.last_energy_tick = self.tick

        if self.monsters_killed >= self.boss_spawn_threshold and not self.boss and not self.spell_active:
            self._spawn_boss()

        if self.boss:
            angle = math.atan2(self.player.y - self.boss.y, self.player.x - self.boss.x)
            self.boss.target_x = self.player.x
            self.boss.target_y = self.player.y
            self.boss.x += math.cos(angle) * self.boss.speed
            self.boss.y += math.sin(angle) * self.boss.speed
            self.boss.attack_timer += 1
            if self.boss.attack_timer >= self.boss.attack_cooldown:
                dist = math.hypot(self.player.x - self.boss.x, self.player.y - self.boss.y)
                if dist < 60:
                    self.player.hp -= self.boss.attack_dmg
                    if self.player.hp <= 0:
                        self.running = False
                self.boss.attack_timer = 0

        self._check_npc_proximity()
        if self.tick - self.last_npc_tick >= self.npc_spawn_interval and len(self.npcs) < 3:
            self._spawn_npc()
            self.last_npc_tick = self.tick

    def _check_monster_collision(self, m):
        dist = math.hypot(self.player.x - m.x, self.player.y - m.y)
        if dist < 30 and not self.player.invincible:
            self.player.hp -= 0.5
            if self.player.hp <= 0:
                self.running = False
                return False
            if self.player.hp < 50 and not self.spell_active:
                self.trigger_spell()
        return m.hp > 0

    def _check_energy_collection(self, e):
        dist = math.hypot(self.player.x - e.x, self.player.y - e.y)
        if dist < 30 and not self.spell_active:
            self.trigger_spell()
            return False
        return True

    def _spawn_monster(self):
        side = random.randint(0, 3)
        if side == 0:
            x = random.random() * 800
            y = -30
        elif side == 1:
            x = 830
            y = random.random() * 600
        elif side == 2:
            x = random.random() * 800
            y = 630
        else:
            x = -30
            y = random.random() * 600
        self.monsters.append(Monster(x, y, self.player.x, self.player.y))

    def _spawn_energy(self):
        x = 30 + random.random() * 740
        y = 30 + random.random() * 540
        self.energies.append(Energy(x, y))

    def _spawn_boss(self):
        side = random.randint(0, 3)
        if side == 0: x, y = random.random() * 800, -40
        elif side == 1: x, y = 840, random.random() * 600
        elif side == 2: x, y = random.random() * 800, 640
        else: x, y = -40, random.random() * 600
        level_idx = ['A1','A2','B1','B2','C1','C2'].index(self.player.cefr_level)
        pool = WORD_POOLS.get(self.language, WORD_POOLS['en'])
        pool_keys = list(pool.keys())
        weaknesses = []
        for lvl in pool_keys[max(0, level_idx-1):min(6, level_idx+2)]:
            weaknesses.extend(pool.get(lvl, []))
        random.shuffle(weaknesses)
        self.boss = Boss(x, y, weaknesses)
        self.boss_spawn_threshold = self.monsters_killed + 10 + random.randint(0, 5)

    def _spawn_npc(self):
        x = 30 + random.random() * 740
        y = 30 + random.random() * 540
        self.npcs.append(NPC(x, y))

    def _check_npc_proximity(self):
        self.near_npc = None
        for npc in self.npcs:
            dist = math.hypot(self.player.x - npc.x, self.player.y - npc.y)
            if dist < 45 and not npc.interacted:
                self.near_npc = npc
                break

    def attack(self, mouse_x=None, mouse_y=None):
        if self.player.attack_timer > 0 or not self.running or self.spell_active:
            return
        self.player.attack_timer = 15
        self.player.slash_timer = 10

        if mouse_x is not None and mouse_y is not None:
            dir_x = mouse_x - self.player.x
            dir_y = mouse_y - self.player.y
            d = math.hypot(dir_x, dir_y)
            if d > 0:
                dir_x /= d
                dir_y /= d
                self.player.last_dx = dir_x
                self.player.last_dy = dir_y
        else:
            dir_x = self.player.last_dx
            dir_y = self.player.last_dy

        atk_range = 100
        atk_width = 35

        for m in self.monsters[:]:
            dx = m.x - self.player.x
            dy = m.y - self.player.y
            dist = math.hypot(dx, dy)
            if dist > atk_range + 15:
                continue

            if dist > 0:
                dot = (dx * dir_x + dy * dir_y) / dist
                if dot < 0.3:
                    continue

            perp = abs(-dx * dir_y + dy * dir_x) / dist if dist > 0 else 0
            if perp > atk_width:
                continue

            m.hp -= self.player.attack_dmg
            if m.hp <= 0:
                self.score += 10
                self.monsters_killed += 1

    def activate_super(self):
        if not self.running or self.spell_active:
            return
        for m in self.monsters:
            self.score += 5
            self.monsters_killed += 1
        self.monsters.clear()
        self.player.invincible = True
        self.player.invincible_timer = 180

    def trigger_spell(self):
        if not self.words:
            return
        self.spell_active = True
        if self.boss and self.boss.hp > 0:
            dist = math.hypot(self.player.x - self.boss.x, self.player.y - self.boss.y)
            if dist < 200 and self.boss.weaknesses:
                self.current_word = random.choice(self.boss.weaknesses)
            else:
                self.current_word = random.choice(self.words)
        else:
            self.current_word = random.choice(self.words)

    def check_spell(self, given):
        correct = given.strip().lower() == self.current_word.lower()
        self.words_attempted += 1
        if correct:
            self.words_correct += 1
            hp_before = self.player.hp
            if hp_before < 50:
                    self.monsters = [m for m in self.monsters if math.hypot(self.player.x - m.x, self.player.y - m.y) > 30]
            self.player.hp = min(self.player.max_hp, self.player.hp + 30)
            xp_gain = 20 if self.double_xp_active else 10
            self.player.cefr_xp += xp_gain
            if self.player.cefr_xp >= self.player.cefr_threshold:
                self._advance_cefr()
            if self.boss and self.boss.hp > 0:
                if given.strip().lower() in [w.lower() for w in self.boss.weaknesses]:
                    self.boss.hp -= 10
                    if self.boss.hp <= 0:
                        self.score += 50
                        self.boss = None
        else:
            if self.boss and self.boss.hp > 0:
                if given.strip().lower() in [w.lower() for w in self.boss.weaknesses]:
                    self.player.hp = max(0, self.player.hp - 5)
                    if self.player.hp <= 0:
                        self.running = False
        self.spell_active = False
        self.current_word = ''
        return correct

    def _advance_cefr(self):
        levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
        idx = levels.index(self.player.cefr_level)
        if idx >= len(levels) - 1:
            return
        self.player.cefr_level = levels[idx + 1]
        self.player.cefr_xp = 0
        self.player.cefr_threshold = int(self.player.cefr_threshold * 1.5)
        self.player.max_hp += 25
        self.player.hp = self.player.max_hp
        self.set_words_for_level(self.player.cefr_level)

    def use_skill(self, skill_id):
        skill = next((s for s in SKILLS if s['id'] == skill_id), None)
        if not skill or skill_id not in self.unlocked_skills:
            return False
        if skill_id == 'shield':
            self.player.invincible = True
            self.player.invincible_timer = 150
        elif skill_id == 'hint':
            if self.current_word and len(self.current_word) > 0:
                return 'hint:' + self.current_word[0]
        elif skill_id == 'cleave':
            for m in self.monsters:
                self.score += 5
                self.monsters_killed += 1
            self.monsters.clear()
        elif skill_id == 'double_xp':
            self.double_xp_active = True
            self.double_xp_timer = 900
        return True

    def interact_npc(self):
        if not self.near_npc:
            return None
        npc = self.near_npc
        if npc.dialogue_index < len(npc.dialogues):
            line = npc.dialogues[npc.dialogue_index]
            npc.dialogue_index += 1
            return {'name': npc.name, 'line': line, 'done': False}
        if not npc.interacted:
            npc.interacted = True
            self.player.skill_points += npc.skill_point_reward
            self.near_npc = None
            return {'name': npc.name, 'line': '+' + str(npc.skill_point_reward) + ' skill points!', 'done': True}
        return None

    def get_final_stats(self):
        elapsed = round(time.time() - self.start_time, 1)
        return {
            'game_id': self.id,
            'role': self.player.role,
            'score': self.score,
            'hp_remaining': self.player.hp,
            'monsters_killed': self.monsters_killed,
            'words_attempted': self.words_attempted,
            'words_correct': self.words_correct,
            'duration': elapsed,
            'created_at': time.time(),
            'cefr_level': self.player.cefr_level,
            'cefr_xp': self.player.cefr_xp,
            'cefr_threshold': self.player.cefr_threshold,
            'skill_points': self.player.skill_points
        }

    def to_dict(self):
        size = self.player.size
        if isinstance(size, dict):
            size = dict(size)
        return {
            'player': {
                'x': self.player.x,
                'y': self.player.y,
                'role': self.player.role,
                'color': self.player.color,
                'hp': self.player.hp,
                'maxHp': self.player.max_hp,
                'size': size,
                'invincible': self.player.invincible,
                'lastDx': self.player.last_dx,
                'lastDy': self.player.last_dy,
                'slashTimer': self.player.slash_timer,
                'cefrLevel': self.player.cefr_level,
                'cefrXp': self.player.cefr_xp,
                'cefrThreshold': self.player.cefr_threshold,
                'skillPoints': self.player.skill_points
            },
            'monsters': [{
                'x': m.x, 'y': m.y, 'type': m.type,
                'color': m.color, 'hp': m.hp, 'maxHp': m.max_hp
            } for m in self.monsters],
            'energies': [{'x': e.x, 'y': e.y} for e in self.energies],
            'boss': ({
                'x': self.boss.x, 'y': self.boss.y, 'hp': self.boss.hp,
                'maxHp': self.boss.max_hp, 'color': self.boss.color,
                'size': self.boss.size, 'attackTimer': self.boss.attack_timer,
                'attackCooldown': self.boss.attack_cooldown
            } if self.boss else None),
            'npcs': [{
                'x': n.x, 'y': n.y, 'name': n.name,
                'interacted': n.interacted, 'dialogueIndex': n.dialogue_index,
                'dialogues': n.dialogues
            } for n in self.npcs],
            'nearNpc': ({
                'name': self.near_npc.name, 'line': self.near_npc.dialogues[0] if self.near_npc.dialogues else '',
                'interacted': self.near_npc.interacted
            } if self.near_npc else None),
            'unlockedSkills': self.unlocked_skills,
            'availableSkills': SKILLS,
            'language': self.language,
            'score': self.score,
            'running': self.running,
            'spellActive': self.spell_active,
            'currentWord': self.current_word,
            'doubleXpActive': self.double_xp_active
        }


class GameManager:
    def __init__(self):
        self.games = {}

    def create_game(self, role_id, profile=None):
        lang = (profile.get('language', 'en') if profile else 'en')
        gs = GameState(role_id, lang)
        if profile:
            p = profile
            gs.player.cefr_level = p.get('cefrLevel', 'A1')
            gs.player.cefr_xp = p.get('cefrXp', 0)
            gs.player.cefr_threshold = p.get('cefrThreshold', 100)
            gs.player.skill_points = p.get('skillPoints', 0)
            lvl_xp_bonus = (['A1','A2','B1','B2','C1','C2'].index(gs.player.cefr_level)
                            if gs.player.cefr_level in ['A1','A2','B1','B2','C1','C2'] else 0)
            gs.player.max_hp = ROLES[role_id]['hp'] + lvl_xp_bonus * 25
            gs.player.hp = gs.player.max_hp
            gs.set_words_for_level(gs.player.cefr_level)
            gs.score = p.get('totalScore', 0)
        self.games[gs.id] = gs
        return gs.id

    def get_game(self, game_id):
        return self.games.get(game_id)

    def remove_game(self, game_id):
        self.games.pop(game_id, None)


_GAME_DIR = os.path.dirname(os.path.abspath(__file__))
_VOCAB_PATH = os.path.join(_GAME_DIR, '..', 'frontend', 'vocab.json')
_LISTENING_PATH = os.path.join(_GAME_DIR, '..', 'frontend', 'listening.json')

_JA_A1 = ["ringo", "hon", "neko", "inu", "sora", "mizu", "hi", "yama", "kawa", "hana",
          "tori", "sakana", "ushi", "uma", "ki", "tsuki", "hoshi", "umi", "kaze", "yuki"]
_JA_A2 = ["tabemono", "nomimono", "kimono", "kuruma", "ie", "machi", "shigoto", "gakko",
          "sensei", "seito", "tomodachi", "kazoku", "denwa", "tegami", "honbako"]

_KO_A1 = ["sarang", "bada", "haneul", "dal", "bit", "mul", "bul", "san", "gang", "kkot",
          "sae", "gogi", "namu", "byeol", "baram", "nun", "bada", "uri", "jip", "gil"]
_KO_A2 = ["yori", "eumsing", "kkeh", "cha", "hakgyo", "seon", "yeon", "jeonhwa",
          "pyeonji", "jinji", "il", "nong", "mulgeon", "sinmun", "nora"]

def _load_words_by_level():
    pool = {lvl: [] for lvl in ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']}
    try:
        with open(_VOCAB_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
        for entry in data:
            if entry.get('word') and entry.get('cefr_level'):
                lvl = entry['cefr_level'].upper()
                if lvl in pool:
                    pool[lvl].append(entry['word'])
    except (FileNotFoundError, json.JSONDecodeError):
        pass
    try:
        with open(_LISTENING_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
        for entry in data:
            if entry.get('title'):
                pool['B1'].append(entry['title'])
    except (FileNotFoundError, json.JSONDecodeError):
        pass
    if not any(pool.values()):
        pool['A1'] = ["apple", "brave", "crane", "dance", "eagle"]
        pool['A2'] = ["balance", "clever", "danger", "example", "future"]
    return pool

_en_pool = _load_words_by_level()

WORD_POOLS = {
    'en': _en_pool,
    'ja': {
        'A1': _JA_A1,
        'A2': _JA_A2,
        'B1': _JA_A2 + _en_pool['A1'][:10],
        'B2': _en_pool['A1'],
        'C1': _en_pool['A2'][:20],
        'C2': _en_pool['A2'][:10]
    },
    'ko': {
        'A1': _KO_A1,
        'A2': _KO_A2,
        'B1': _KO_A2 + _en_pool['A1'][:10],
        'B2': _en_pool['A1'],
        'C1': _en_pool['A2'][:20],
        'C2': _en_pool['A2'][:10]
    }
}
