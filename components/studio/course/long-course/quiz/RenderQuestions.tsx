import React from 'react'
import MutipleChoice from './MutipleChoice'
import TrueOrFalse from './TrueOrFalse'

const RenderQuestions = ({ question, setQuestionData, questionData, index, deleteQuestion }: any) => {
  return (
    <div>
      {question.type === "trueFalse" ? (
        <TrueOrFalse
          questionNumber={question.questionNumber}
          questionText={questionData[index].questionText}
          setQuestionText={(text) =>
            setQuestionData((prev: any[]) =>
              prev.map((q, i) => (i === index ? { ...q, questionText: text } : q))
            )
          }
          correctAnswer={questionData[index].correctAnswer}
          setCorrectAnswer={(answer) =>
            setQuestionData((prev: any[]) =>
              prev.map((q: any, i: any) => (i === index ? { ...q, correctAnswer: answer } : q))
            )
          }
          allocatedPoint={questionData[index].allocatedPoint}
          setAllocatedPoint={(point) =>
            setQuestionData((prev: any[]) =>
              prev.map((q: any, i: any) => (i === index ? { ...q, allocatedPoint: point } : q))
            )
          }
          onDelete={() => deleteQuestion(index)}
        />
      ) : (
        <MutipleChoice
          questionNumber={question.questionNumber}
          questionText={questionData[index].questionText}
          setQuestionText={(text) =>
            setQuestionData((prev: any[]) =>
              prev.map((q: any, i: any) => (i === index ? { ...q, questionText: text } : q))
            )
          }
          optionValues={questionData[index].optionValues}
          setOptionValues={(values) =>
            setQuestionData((prev: any[]) =>
              prev.map((q: any, i: any) => (i === index ? { ...q, optionValues: values } : q))
            )
          }
          selectedOption={questionData[index].selectedOption}
          setSelectedOption={(option) =>
            setQuestionData((prev: any[]) =>
              prev.map((q: any, i: any) => (i === index ? { ...q, selectedOption: option } : q))
            )
          }
          allocatedPoint={questionData[index].allocatedPoint}
          setAllocatedPoint={(point) =>
            setQuestionData((prev: any[]) =>
              prev.map((q: any, i: any) => (i === index ? { ...q, allocatedPoint: point } : q))
            )
          }
          onDelete={() => deleteQuestion(index)}
        />
      )}
    </div>
  )
}

export default RenderQuestions