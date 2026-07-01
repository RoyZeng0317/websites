import random
import os
import time
from flask import Flask, jsonify, request, render_template, session
from game_engine import GameManager, ROLES, SKILLS

app = Flask(__name__)
app.secret_key = "game-secret-key-change-in-production"

manager = GameManager()

# ── Firebase Admin ─────────────────────────────────────────────────────────────
firestore_client = None
try:
    import firebase_admin
    from firebase_admin import credentials, firestore
    sa_path = os.path.join(os.path.dirname(__file__), '..', 'admin', 'serviceAccount.json')
    project_id = os.environ.get('FIREBASE_PROJECT_ID', 'linugapath')
    if os.path.exists(sa_path):
        cred = credentials.Certificate(sa_path)
        firebase_admin.initialize_app(cred, {'projectId': project_id})
    else:
        firebase_admin.initialize_app({'projectId': project_id})
    firestore_client = firestore.client()
    print('Firebase Admin initialised')
except Exception as e:
    print(f'Firebase Admin not available: {e}')

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/roles")
def get_roles():
    return jsonify([
        {"id": "square", "name": "Square", "color": "#e74c3c", "desc": "Balanced fighter"},
        {"id": "triangle", "name": "Triangle", "color": "#3498db", "desc": "Swift attacker"},
        {"id": "circle", "name": "Circle", "color": "#2ecc71", "desc": "Tough defender"},
        {"id": "rectangle", "name": "Rectangle", "color": "#9b59b6", "desc": "Powerful striker"},
        {"id": "pentagon", "name": "Pentagon", "color": "#e67e22", "desc": "Versatile all-rounder"}
    ])

@app.route("/api/game/start", methods=["POST"])
def start_game():
    data = request.get_json()
    role_id = data.get("role", "square")
    profile = data.get("profile")
    game_id = manager.create_game(role_id, profile)
    session["game_id"] = game_id
    gs = manager.get_game(game_id)
    return jsonify({"gameId": game_id, "state": gs.to_dict()})

@app.route("/api/game/state")
def get_state():
    game_id = session.get("game_id")
    if not game_id:
        return jsonify({"error": "No game"}), 400
    gs = manager.get_game(game_id)
    if not gs:
        return jsonify({"error": "Game not found"}), 404
    return jsonify(gs.to_dict())

@app.route("/api/game/update", methods=["POST"])
def update_game():
    game_id = session.get("game_id")
    if not game_id:
        return jsonify({"error": "No game"}), 400
    gs = manager.get_game(game_id)
    if not gs:
        return jsonify({"error": "Game not found"}), 404

    data = request.get_json()
    keys = data.get("keys", {})
    gs.update(keys)
    return jsonify(gs.to_dict())

@app.route("/api/game/action", methods=["POST"])
def game_action():
    game_id = session.get("game_id")
    if not game_id:
        return jsonify({"error": "No game"}), 400
    gs = manager.get_game(game_id)
    if not gs:
        return jsonify({"error": "Game not found"}), 404

    data = request.get_json()
    action = data.get("action", "")

    if action == "attack":
        gs.attack(mouse_x=data.get("mouseX"), mouse_y=data.get("mouseY"))
    elif action == "super":
        gs.activate_super()
    elif action == "interact_npc":
        result = gs.interact_npc()
        return jsonify({"result": result, "state": gs.to_dict()})

    return jsonify(gs.to_dict())

@app.route("/api/game/spell", methods=["POST"])
def check_spell():
    game_id = session.get("game_id")
    if not game_id:
        return jsonify({"error": "No game"}), 400
    gs = manager.get_game(game_id)
    if not gs:
        return jsonify({"error": "Game not found"}), 404

    data = request.get_json()
    given = data.get("word", "")
    result = gs.check_spell(given)

    return jsonify({"correct": result, "state": gs.to_dict()})

@app.route("/api/game/save", methods=["POST"])
def save_game():
    game_id = session.get("game_id")
    if not game_id:
        return jsonify({"error": "No game"}), 400
    gs = manager.get_game(game_id)
    if not gs:
        return jsonify({"error": "Game not found"}), 404
    if firestore_client is None:
        return jsonify({"error": "Firebase not available"}), 503

    stats = gs.get_final_stats()
    try:
        firestore_client.collection('game_scores').document(game_id).set(stats)
        return jsonify({"saved": True, "stats": stats})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/game/history", methods=["GET"])
def game_history():
    if firestore_client is None:
        return jsonify({"error": "Firebase not available"}), 503
    try:
        docs = firestore_client.collection('game_scores').order_by('created_at', direction=firestore.Query.DESCENDING).limit(20).stream()
        results = [d.to_dict() for d in docs]
        return jsonify({"history": results})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/profile/save", methods=["POST"])
def save_profile():
    if firestore_client is None:
        return jsonify({"error": "Firebase not available"}), 503
    data = request.get_json()
    player_id = data.get("playerId")
    if not player_id:
        return jsonify({"error": "Missing playerId"}), 400
    profile = {
        'playerId': player_id,
        'cefrLevel': data.get('cefrLevel', 'A1'),
        'cefrXp': data.get('cefrXp', 0),
        'cefrThreshold': data.get('cefrThreshold', 100),
        'skillPoints': data.get('skillPoints', 0),
        'totalScore': data.get('totalScore', 0),
        'gamesPlayed': data.get('gamesPlayed', 0),
        'language': data.get('language', 'en'),
        'updatedAt': time.time()
    }
    try:
        firestore_client.collection('player_profiles').document(player_id).set(profile)
        return jsonify({"saved": True, "profile": profile})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/profile/load", methods=["GET"])
def load_profile():
    if firestore_client is None:
        return jsonify({"error": "Firebase not available"}), 503
    player_id = request.args.get("playerId")
    if not player_id:
        return jsonify({"error": "Missing playerId"}), 400
    try:
        doc = firestore_client.collection('player_profiles').document(player_id).get()
        if doc.exists:
            return jsonify({"profile": doc.to_dict()})
        return jsonify({"profile": None})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/game/shop/buy", methods=["POST"])
def buy_skill():
    game_id = session.get("game_id")
    if not game_id:
        return jsonify({"error": "No game"}), 400
    gs = manager.get_game(game_id)
    if not gs:
        return jsonify({"error": "Game not found"}), 404

    data = request.get_json()
    skill_id = data.get("skillId", "")
    skill = next((s for s in SKILLS if s['id'] == skill_id), None)
    if not skill:
        return jsonify({"error": "Skill not found"}), 400
    if skill_id in gs.unlocked_skills:
        return jsonify({"error": "Already owned"}), 400
    if gs.player.skill_points < skill['cost']:
        return jsonify({"error": "Not enough skill points"}), 400

    gs.player.skill_points -= skill['cost']
    gs.unlocked_skills.append(skill_id)
    return jsonify({"bought": True, "state": gs.to_dict()})

@app.route("/api/game/skill/use", methods=["POST"])
def use_skill():
    game_id = session.get("game_id")
    if not game_id:
        return jsonify({"error": "No game"}), 400
    gs = manager.get_game(game_id)
    if not gs:
        return jsonify({"error": "Game not found"}), 404

    data = request.get_json()
    skill_id = data.get("skillId", "")
    result = gs.use_skill(skill_id)
    if result is False:
        return jsonify({"error": "Skill not available"}), 400

    return jsonify({"result": result, "state": gs.to_dict()})

@app.route("/api/game/word")
def get_word():
    return jsonify({"word": random.choice(manager.games[next(iter(manager.games))].words) if manager.games else "apple"})

if __name__ == "__main__":
    app.run(debug=True)
