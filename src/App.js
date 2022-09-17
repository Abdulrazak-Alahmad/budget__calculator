import React, { useEffect, useState } from 'react';
import './App.css';
import ExpensList from './components/ExpenseList'
import ExpensForm from './components/ExpenseForm'
import Alert from './components/Alert'
import { v4 as uuid } from 'uuid';

const initialExpense = localStorage.getItem('expenses')
  ? JSON.parse(localStorage.getItem('expenses'))
  : []

function App() {
  // useState
  const [expenses, setExpenses] = useState(initialExpense)
  const [charge, setCharge] = useState('');
  const [amount, setAmount] = useState('');
  const [alert, setAlert] = useState({ show: false });
  const [edit, setEdit] = useState(false)
  const [id, setId] = useState(0)

  //useEffect
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses))
  }, [expenses])

  //functions
  const handleAlert = ({ type, text }) => {
    setAlert({ show: true, type, text });
    setTimeout(() => {
      setAlert({ show: false })
    }, 3000)
  }
  const handleCharge = e => {
    setCharge(e.target.value)
  }
  const handleAmount = e => {
    setAmount(e.target.value)
  }
  const handleSubmit = e => {
    e.preventDefault();
    if (charge !== '' && amount > 0) {
      if (edit) {
        let tempExpenses = expenses.map(item => {
          return item.id === id ? { ...item, charge, amount } : item
        })
        setExpenses(tempExpenses);
        setEdit(false)
        handleAlert({ type: 'success', text: 'item edited' })
      }
      else {
        const singleExpense = { id: uuid(), charge, amount }
        setExpenses([...expenses, singleExpense])
        handleAlert({ type: 'success', text: 'item added' })
      }
      setCharge('')
      setAmount('')
    }
    else {
      handleAlert({ type: 'danger', text: `charge can't be empty value and amount value has to be bigger that zero` })
    }
  }
  const clearItems = () => {
    setExpenses([])
    handleAlert({ type: 'danger', text: `All items deleted` })
  }
  const handleDelete = (id) => {
    let tempExpenses = expenses.filter(item => item.id !== id)
    setExpenses(tempExpenses)
    handleAlert({ type: 'danger', text: `item deleted` })
  }
  const handleEdit = id => {
    let expense = expenses.find(item => item.id === id)
    let { charge, amount } = expense
    setCharge(charge)
    setAmount(amount)
    setEdit(true)
    setId(id)
  }

  return (
    <>
      {alert.show && <Alert type={alert.type} text={alert.text} />}
      <h1>budget calculator</h1>
      <main className='App'>
        <ExpensForm
          charge={charge}
          amount={amount}
          handleCharge={handleCharge}
          handleAmount={handleAmount}
          handleSubmit={handleSubmit}
          edit={edit}
        />
        <ExpensList expenses={expenses}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          clearItems={clearItems}
        />
      </main>
      <h1> total spending : <spam className='total'>${expenses.reduce((acc, curr) => {
        return (acc += parseInt(curr.amount))
      }, 0)}</spam> </h1>
    </>
  );
}

export default App;