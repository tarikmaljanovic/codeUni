'use client';
import '../styles/quiz.scss'
import { Button } from '@mui/joy'
import { useState, useEffect, useCallback } from 'react';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import axios, { all } from 'axios'

export default function Quiz(props) {
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [showResult, setShowResult] = useState(false)
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
    const [token, setToken] = useState(JSON.parse(localStorage.getItem('token')))
    const [courseId, setCourseId] = useState(localStorage.getItem('course'))
    const [quizId, setQuizId] = useState()
    const [newQuiz, setNewQuiz] = useState([
        {
            question: '',
            answers: [''],
            correctIndex: 0,
            chosenIndex: null,
        }
    ])
    const [quiz, setQuiz] = useState([])

    useEffect(() => {
        axios.get(process.env.API_HOST + `quizzes/byLessonId/${props.id}`).then(res => {
            setQuiz(JSON.parse(res.data.quiz_content))
            setQuizId(res.data.id)
        }).catch(err => {
            console.log(err)
        })
    }, [])

    useEffect(() => {
        if(quiz.length) {
            setNewQuiz(quiz)
        } 
    }, [quiz])

    const handleSaveQuiz = () => {
        axios.put(process.env.API_HOST + `quizzes/updateQuiz/${quizId}`, {
            token: token, 
            quiz_content: JSON.stringify(newQuiz)
        }).then(res => {
                console.log(res)
        }).catch(err => {
            console.log(err)
        })
    }

    const handleFinishQuiz = () => {

        axios.put(process.env.API_HOST + `courses/updateProgress`, {
            course_id: courseId,
            user_id: user.id,
            lesson_id: props.id,
            type: "lesson"
        }).then(res => {
            console.log(res)
            axios.post(process.env.API_HOST + `badges/smartCookieBadge`, {
                user_id: user.id
            }).then(res => {
                console.log(res)
            }).catch(err => {
                console.log(err)
            })
            axios.post(process.env.API_HOST + `badges/assignBadge`, {
                user_id: user.id
            }).then(res => {
                console.log(res)
            }).catch(err => {
                console.log(err)
            })
        }).catch(err => {
            console.log(err)
        })
        

        return (<p className='result-text'>Congratulations! You got all the answers right!</p>)
    }
    

    if(user.admin) {
        return (
            <>
                <div className='quiz-container'>
                    {
                        user?.admin ? (
                            <>
                                {
                                    newQuiz.map((question, index) => {
                                        return (
                                            <div key={index} className='new-question'>
                                                <FormControl>
                                                    <FormLabel>Question {index+1}</FormLabel>
                                                    <Input value={question.question} onChange={e => {
                                                        setNewQuiz(newQuiz.map((q, i) => {
                                                            if (i == index) {
                                                                return {...q, question: e.target.value}
                                                            } else {
                                                                return q
                                                            }
                                                        }))
                                                    }}/>
                                                </FormControl>
                                                {
                                                    question.answers.map((answer, i) => {
                                                        return (
                                                            <FormControl key={i}>
                                                                <FormLabel>Answer {i+1}</FormLabel>
                                                                <Input value={answer} onChange={e => {
                                                                    setNewQuiz(newQuiz.map((q, j) => {
                                                                        if (j == index) {
                                                                            return {...q, answers: q.answers.map((a, k) => {
                                                                                if (k == i) {
                                                                                    return e.target.value
                                                                                } else {
                                                                                    return a
                                                                                }
                                                                            })}
                                                                        } else {
                                                                            return q
                                                                        }
                                                                    }))
                                                                }}/>
                                                            </FormControl>
                                                        )
                                                    })
                                                }
                                                <FormControl>
                                                    <FormLabel>Correct Answer</FormLabel>
                                                    <Input type='number' value={question.correctIndex} onChange={e => {
                                                        setNewQuiz(newQuiz.map((q, i) => {
                                                            if (i == index) {
                                                                return {...q, correctIndex: e.target.value}
                                                            } else {
                                                                return q
                                                            }
                                                        }))
                                                    }}/>
                                                </FormControl>
                                                <Button style={{marginTop: '20px', marginRight: '10px', marginBottom: '20px'}} onClick={() => {
                                                    setNewQuiz(newQuiz.map((q, j) => {
                                                        if (j == index) {
                                                            return {...q, answers: [...q.answers, '']}
                                                        } else {
                                                            return q
                                                        }
                                                    }))
                                                }} className='bttn'>Add Answer</Button>
                                                <Button onClick={() => {
                                                    setNewQuiz(newQuiz.map((q, j) => {
                                                        if (j == index) {
                                                            return {...q, answers: q.answers.slice(0, q.answers.length-1)}
                                                        } else {
                                                            return q
                                                        }
                                                    }))
                                                }} className='bttn'>Delete Answer</Button>
                                                <Button style={{marginLeft: '20px'}} onClick={() => {
                                                    setNewQuiz(newQuiz.filter((q, j) => j != index))
                                                }} className='bttn'>Delete Question</Button>
                                            </div>
                                        )
                                    })
                                }
                                <Button style={{marginRight: '10px'}} onClick={() => {
                                    setNewQuiz([...newQuiz, {
                                        question: '',
                                        answers: [''],
                                        correctIndex: 0
                                    }])
                                }} className='bttn'>Add Question</Button>
                                <Button style={{marginTop: '20px'}} onClick={handleSaveQuiz} className='bttn'>Save Quiz</Button>
                            </>
                        ) : null
                    }
                </div>
            </>
        )
    } else {
        return (
            <>
                <div className='quiz-container'>
                    {
                        showResult ? (
                            <>
                                {
                                    quiz.map((question, index) => {
                                        return (
                                            <div className='result' key={index}>
                                                <p className='question'>{question.question}</p>
                                                <p className={`answer ${question.chosenIndex ==question.correctIndex ? 'correct' : 'wrong'}`}>Your answer: {question.answers[question.chosenIndex]}</p>
                                                <p className='correct'>Correct answer: {question.answers[question.correctIndex]}</p>
                                            </div>
                                        )
                                    })
                                }
                                {
                                    quiz.filter(question => question.chosenIndex == question.correctIndex).length == quiz.length ? handleFinishQuiz() : (
                                        <p className='result-text'>You got {quiz.filter(question => question.chosenIndex == question.correctIndex).length} out of {quiz.length} questions right!</p>
                                    )
                                
                                }
                                {
                                    showResult ? (
                                        <Button onClick={() => {
                                            setQuiz(quiz.map(question => {
                                                return {...question, chosenIndex: null}
                                            }))
                                            setCurrentQuestion(0)
                                            setShowResult(false)
                                        }} className='bttn'>Retry</Button>
                                    ) : null
                                }
                            </>
                        ) : (
                            quiz.length ? (
                                <>
                                    <p className='question'>{quiz[currentQuestion]?.question}</p>
                                    <form className='answers'>
                                        {
                                            quiz[currentQuestion]?.answers.map((answer, index) => (
                                                <div onClick={() => {
                                                    setQuiz(quiz.map((question, i) => {
                                                        if (i == currentQuestion) {
                                                            return {...question, chosenIndex: index}
                                                        } else {
                                                            return question
                                                        }
                                                    }))
                                                }} className='answer' key={index}>
                                                    <input type='radio' name='answer' value={index}/>
                                                    <label>{answer}</label>
                                                </div>
                                            ))
                                        }
                                    </form>
                                    <div className='button-group'>
                                        {
                                            currentQuestion > 0 ? (
                                                <Button onClick={() => setCurrentQuestion(currentQuestion-1)} className='bttn'>Previous</Button>
                                            ) : null
                                        }
                                        {
                                            currentQuestion == quiz.length - 1 ? (
                                                <Button onClick={(e) => {
                                                    e.stopPropagation()
                                                    setShowResult(true)
                                                }} className='bttn'>Finish</Button>
                                            ) : (
                                                <Button onClick={() => setCurrentQuestion(currentQuestion+1)} className='bttn'>Next</Button>
                                            )
                                        }
                                    </div>
                                </>
                            ) : (
                                <p>No quiz available for this lesson</p>
                            )
                        )
                    }
                </div>
            </>
        )
    }
}