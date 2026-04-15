import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Target } from 'lucide-react'
import Button from '@components/ui/Button'

export default function KesesuaianJurusan() {
  const navigate = useNavigate()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})

  const questions = [
    {
      id: 1,
      question: 'Apakah Anda tertarik dengan teknologi?',
      options: ['Sangat Tertarik', 'Cukup Tertarik', 'Kurang Tertarik', 'Tidak Tertarik'],
    },
    {
      id: 2,
      question: 'Bidang mana yang paling Anda kuasai?',
      options: ['Sains', 'Matematika', 'Bahasa', 'Seni'],
    },
    {
      id: 3,
      question: 'Apakah Anda ingin bekerja dengan orang atau data?',
      options: ['Lebih suka bekerja dengan orang', 'Lebih suka bekerja dengan data', 'Dua-duanya', 'Tidak yakin'],
    },
  ]

  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: answer })
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      navigate('/kesesuaian-jurusan/hasil')
    }
  }

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-white mb-2">Tes Kesesuaian Jurusan</h1>
        <p className="text-white/60">Temukan jurusan yang paling sesuai dengan minatmu</p>
      </div>

      <div className="bg-nexa-card border border-nexa-border rounded-lg p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white text-sm font-semibold">Pertanyaan {currentQuestion + 1} dari {questions.length}</span>
            <span className="text-white/60 text-sm">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-nexa-border rounded-full overflow-hidden">
            <div className="h-full bg-nexa-primary transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        {/* Question */}
        <h2 className="text-xl font-semibold text-white mb-6">{questions[currentQuestion].question}</h2>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {questions[currentQuestion].options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(option)}
              className={`w-full p-4 border rounded-lg text-left transition-all ${
                answers[questions[currentQuestion].id] === option
                  ? 'bg-nexa-primary/20 border-nexa-primary text-white'
                  : 'border-nexa-border text-white/60 hover:border-nexa-primary hover:text-white'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3 justify-between">
          <Button variant="outline" onClick={handlePrev} disabled={currentQuestion === 0}>
            Sebelumnya
          </Button>
          <Button onClick={handleNext}>
            {currentQuestion === questions.length - 1 ? 'Lihat Hasil' : 'Berikutnya'}
          </Button>
        </div>
      </div>
    </div>
  )
}