# voice clone
# pip install SpeechRecognition
import speeh_recognition as sr
recongizer = sr.Recognizer()
# pip install pyaudio
# pip install openai-whisper
import whisper
model = whisper.load_model("base")

button.clicked.connect(lambda: record_and_transcribe())
