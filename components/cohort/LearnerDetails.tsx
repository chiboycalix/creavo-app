"use client"

import { X } from "lucide-react"

export interface QuizAttempt {
  id: number
  title: string
  score: number
  totalScore: number
  duration: number
  completedAt: string
}

export interface Learner {
  userId: number
  name: string
  email: string
  enrolledCourse: string
  demographic: string
  enrollmentDate: string
  lastActive: string
  quizAttempt: number
  quizAttempts: QuizAttempt[]
  percentageCompletion: number
  totalWatchTime: number
  lastUpdated: string
}

interface LearnerDetailsProps {
  learner: Learner | null
  onClose: () => void
  isOpen: boolean
}

export function LearnerDetails({ learner, onClose, isOpen }: LearnerDetailsProps) {
  if (!learner) return null

  return (
    <div
      className={`fixed inset-y-0  right-0 w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } z-50`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-md font-semibold">More details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="h-3 w-3" />
          </button>
        </div>

        <div className="space-y-6 text-sm">
          <div>
            <h3 className="font-medium text-blue-500">{learner.name}</h3>
            <p className="text-sm text-gray-600">Email address: {learner.email}</p>
            <p className="text-sm text-gray-600">Last active : <span className="font-semibold"> {new Date(learner.lastActive).toLocaleDateString()} </span></p>
          </div>

          <div>
            <h3 className="font-medium mb-4">Quiz</h3>
            {learner.quizAttempts && learner.quizAttempts.length > 0 ? (
              <div className="space-y-4">
                {learner.quizAttempts.map((quiz) => (
                  <div key={quiz.id} className="flex items-start gap-3">
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">{quiz.title}</h4>
                        <span
                          className={`text-sm ${
                            quiz.score / quiz.totalScore >= 0.7 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {quiz.score}/{quiz.totalScore}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">Graded assignment • {quiz.duration} mins</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">This users has not attempted any Quiz.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
