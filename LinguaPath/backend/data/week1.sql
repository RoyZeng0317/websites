CREATE TABLE week1 (
    word VARCHAR(50) PRIMARY KEY,
    meaning TEXT,
    pos VARCHAR(20),
    synonym TEXT,
    antonym TEXT,
    derivatives TEXT,
    phrases TEXT,
    patterns TEXT,
    fav BOOLEAN
);

[
    {
        "word": "accept",
        "pos": "verb",
        "synonym": "none",
        "antonym": "reject",
        "derivatives": "acceptable",
        "phrases": "none",
        "patterns": ["Please accept this small gift to thank you for everything you have done for me."],
        "fav": false
    },
    {
        "word": "appear",
        
        "pos": "verb",
        "synonym": "none",
        "antonym": ["vanish","disappear"],
        "derivatives": "appearance",
        "patterns": ["Johnny appeared on television last night."],
        "fav": false
    },
    {
        "word": "attention",
        "pos": "noun",
        "synonym": "none",
        "antonym": "none",
        "derivatives": "none",
        "phrases": "pay attention(to sb./sth.)",
        "patterns": ["The teacher got her students' attention by clapping her hands."],
        "fav": false
    },
    {
        "word": "brilliant",
        "pos": "adjective",
        "synonym": "outstanding",
        "antonym": "none",
        "derivatives": "none",
        "phrases": "none",
        "patterns": ["The briliant scientist invented brand-new technology."],
        "fav": false
    },
    {
        "word": "common",
        普通的；常見的",
        "pos": "adjective",
        "synonym": "ordinary",
        "antonym": "none",
        "derivatives": "commonly",
        "phrases": "none",
        "patterns": ["Smartphones are common these days."],
        "fav": false
    },
    {
        "word": "creative",
        有創意的；有創造力的",
        "pos": "adjective",
        "synonym": "none",
        "antonym": "none",
        "derivatives": ["create", "creation", "creativity"],
        "phrases": "none",
        "patterns": ["The boy wrote a very creative story about a man who lived in a tree."],
        "fav": false
    },
    {
        "word": "describe",
        描述；形容",
        "pos": "verb",
        "synonym": "none",
        "antonym": "none",
        "derivatives": "description",
        "phrases": "none",
        "patterns": ["Please describe the man you saw."],
        "fav": false
    },
    {
        "word": "emotion",
        情緒；感情",
        "pos": "noun",
        "synonym": "feeling",
        "antonym": "none",
        "derivatives": ["emotional", "emotionally"],
        "phrases": "none",
        "patterns": ["My new coworker does not show his emotions very much."],
        "fav": false
    },
    {
        "word": "encourage",
        鼓勵",
        "pos": "verb",
        "synonym": "inspire",
        "antonym": "discourage",
        "derivatives": "none",
        "phrases": "none",
        "patterns": ["Teachers encourage their students to study hard."],
        "fav": false
    },
    {
        "word": "energy",
        精力；能源",
        "pos": "noun",
        "synonym": "none",
        "antonym": "none",
        "derivatives": "none",
        "phrases": "none",
        "patterns": ["Connie says that has a lot of energy in the morning, but she feels tired in the afternoon.",
                    "Wind power is a kind of clean energy."
                    ],
        "fav": false
    },
    {
        "word": "generous",
        大方的；慷慨的",
        "pos": "adjective",
        "synonym": "none",
        "antonym": "none",
        "derivatives": "none",
        "phrases": "none",
        "patterns": ["Please be more generous and share your toys with your friends."],
        "fav": false
    },
    {
        "word": "imagine",
        想像",
        "pos": "verb",
        "synonym": "none",
        "antonym": "none",
        "derivatives": "imagination",
        "phrases": "none",
        "patterns": ["Priscilla closed her eyes and imagined that she was on a ship."],
        "fav": false
    },
    {
        "word": "immediately",
        立刻",
        "pos": "adverb",
        "synonym": ["right away", "at once", "right now"],
        "antonym": "none",
        "derivatives": "none",
        "phrases": "none",
        "patterns": ["I went home immediately after work because I felt very tired."],
        "fav": false
    },
    {
        "word": "instead",
        作為替代；反而",
        "pos": "adverb",
        "synonym": "none",
        "antonym": "none",
        "derivatives": "none",
        "phrases": "instead of",
        "patterns": ["I don't want to go the zoo. Instead, let's go hiking in the mountains."],
        "fav": false
    },
    {
        "word": "introduce",
        介紹；引見",
        "pos": "verb",
        "synonym": "none",
        "antonym": "none",
        "derivatives": "introduction",
        "phrases": "none",
        "patterns": ["Nancy, let me introduce you to your new classmate, Ryan."],
        "fav": false    
    },
    {
        "word": "model",
        模範；模型；(產品、機器的)型號",
        "pos": "noun",
        "synonym": "none",
        "antonym": "none",
        "derivatives": "remodel",
        "phrases": "none",
        "patterns": ["Most people have their own role models.", "Noah often builds models of ships.", "Smartphone models that came out two or three years ago are already considered old."],
        "fav": false
    },
    {
        "word": "occasion",
        重要活動；場合；時機",
        "pos": "noun",
        "synonym": "none",
        "antonym": "none",
        "derivatives": "occasional",
        "phrases": "none",
        "patterns": ["Jean's wedding was an occasion of great happiness for her family and friends."],
        "fav": false
    },
    {
        "word": "produce",
        "meaning": ["生產；製造", "農產品(集合名詞)"],
        "pos": ["verb", "noun"],
        "synonym": "generate",
        "antonym": "none",
        "derivatives": "producer",
        "phrases": "none",
        "patterns": ["Plants are nice to have around the house because they produce oxygen.", "During summer, some farmers sell their produce on the dise of the road"],
        "fav": false
    },
    {
        "word": "product",
        產品",
        "pos": "noun",
        "synonym": "none",
        "antonym": "none",
        "derivatives": "productive",
        "phrases": "none",
        "patterns": ["You can buy this product for less money at the other store"],
        "fav": false
    },
    {
        "word": "realize",
        意識到；實現",
        "pos": "verb",
        "synonym": "achive",
        "antonym": "none",
        "derivatives": "none",
        "phrases": "none",
        "patterns": ["I just realized that stores will be closed tomorrow because of the holiday.", "Michelle is confident that she will realize her goals if she studies hard."],
        "fav": false
    },
    {
        "word": "recognize",
        辨認；表彰",
        "pos": "verb",
        "synonym": "identify",
        "antonym": "none",
        "derivatives": "recognition",
        "phrases": "none",
        "patterns": ["I hardly recognized Jimmy when I met him.", "The Academy of Motion Picture Arts and Sciences recognized he actor with a Lifetime Achievement Oscar."],
        "fav": false
    },
    {
        "word": "recovery",
        復原；痊癒",
        "pos": "noun",
        "synonym": "none",
        "antonym": "none",
        "derivatives": "recover",
        "phrases": "make a quick recovery from",
        "patterns": ["After the car accident, Ben was in recovery for three weeks."],
        "fav": false
    },
    {
        "word": "refuse",
        拒絕",
        "pos": "verb",
        "synonym": ["reject", "turn down"],
        "antonym": "accept",
        "derivatives": "none",
        "phrases": "none",
        "patterns": ["Jessica refuse to talk to me."],
        "fav": false
    },
    {
        "word": "relationship",
        關係；戀情",
        "pos": "noun",
        "synonym": "link",
        "antonym": "none",
        "derivatives": "none",
        "phrases": "develop a close relatioship",
        "patterns": ["It is important have a good relationsip with your customers."],
        "fav": false
    },
    {
        "word": "respect",
        敬重；尊敬；重視",
        "pos": ["noun", "verb"],
        "synonym": "none",
        "antonym": "none",
        "derivatives": "none",
        "phrases": "none",
        "patterns": ["Diane has a lot of respect for her teachers.", "This writer is highly respected, and I like his books a lot."],
        "fav": false
    },
    {
        "word": "surprisingly",
        出乎意外地；驚人地",
        "pos": "adverb",
        "synonym": "unexpectedly",
        "antonym": "none",
        "derivatives": ["surprising", "surprise", "surprised"],
        "phrases": "none",
        "patterns": ["Stinky tofu does not smell good, but surprisingly, it tastes great!"],
        "fav": false
    },
    {
        "word": "traditional",
        傳統的",
        "pos": "adjective",
        "synonym": "conventional",
        "antonym": ["modern", "recent", "contemporary"],
        "derivatives": "none",
        "phrases": "tradition",
        "patterns": ["We have a traditional Christmas dinner every year."],
        "fav": false
    },
    {
        "word": "unique",
        獨一無二的",
        "pos": "adjective",
        "synonym": "none",
        "antonym": ["common", "ordinary"],
        "derivatives": "none",
        "phrases": "none",
        "patterns": ["I have never seen anything like these unique dolls."],
        "fav": false
    },
    {
        "word": "valuable",
        珍貴的；有價值的",
        "pos": "adjective",
        "synonym": "precious",
        "antonym": "none",
        "derivatives": ["invaluable", "value"],
        "phrases": "none",
        "patterns": ["Bob learned some valuale lessons from his mistakes."],
        "fav": false
    },
    {
        "word": "various",
        不同的；各式各樣的",
        "pos": "adjective",
        "synonym": "none",
        "antonym": "none",
        "derivatives": ["variety", "variation"],
        "phrases": "none",
        "patterns": ["Doug plays various sports, but he likes soccer best."],
        "fav": false
    },
    {
        "word": "at the same time",
        同時；同一時間",
        "pos": "none",
        "synonym": "at once",
        "antonym": "none",
        "derivatives": "none",
        "phrases": "none",
        "patterns": ["I like bike riding, because I can exercise and have fun at the same time."],
        "fav": false
    },
    {
        "word": "come up with",
        想到；想出",
        "pos": "none",
        "synonym": ["think of", "figure out"],
        "antonym": "none",
        "derivatives": "none",
        "phrases": "none",
        "patterns": ["My boss wanted me to come up with a better project."],
        "fav": false
    },
    {
        "word": "in addition (to)",
        除了...之外",
        "pos": "none",
        "synonym": "none",
        "antonym": "none",
        "derivatives": "none",
        "phrases": "none",
        "patterns": ["The meeting with our clients starts at ten o'clock. In addition, we're having lunch with them afterwards.", "In addition, S. + V.", "In addition to + N./V-ing, S. + V."],
        "fav": false
    },
    {
        "word": "in fact",
        事實上",
        "pos": "none",
        "synonym": "actually",
        "antonym": "none",
        "derivatives": "none",
        "phrases": "none",
        "patterns": ["Jacob loves music. In fact, he can play the piano and the drums."],
        "fav": false
    },
    {
        "word": "look forward to",
        期待",
        "pos": "none",
        "synonym": "none",
        "antonym": "none",
        "derivatives": "none",
        "phrases": "none",
        "patterns": ["Frank is looking forward to the concert on Thusday.", "look forward to + N./V-ing"],
        "fav": false
    }
]