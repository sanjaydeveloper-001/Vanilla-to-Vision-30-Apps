import { useEffect, useState } from 'react'
import { FaDeleteLeft } from "react-icons/fa6";

function App() {

  const [history , setHistory] = useState(() => {
    const stored = localStorage.getItem("history");
    return stored ? JSON.parse(stored) : [];
  });
  const [transaction , setTransaction] = useState("");
  const [amount , setAmount] = useState(null);

  const [balance , setBalance] = useState(() => {
    const stored = localStorage.getItem("balance");
    return stored ? parseFloat(stored) : 0.00;
  });
  const [income , setIncome] = useState(() => {
    const stored = localStorage.getItem("income");
    return stored ? parseFloat(stored) : 0.00;
  });
  const [expense , setExpense] = useState(() => {
    const stored = localStorage.getItem("expense");
    return stored ? parseFloat(stored) : 0.00;
  });

  const [showHistory , setShowHistory] = useState(false);
  const [isIncome , setIsIncome] = useState(true);

  const AddHistory = () => {
    if(!transaction || amount == 0) {
      alert("Please enter transaction and amount");
      return;
    }

    if(isIncome) {
      setBalance(balance + amount);
      setIncome(income + amount);
      setHistory([...history, {name : transaction, amount : amount, isIncome: isIncome}]);
    } else {
      setBalance(balance - amount);
      setExpense(expense + amount);
      setHistory([...history, {name : transaction, amount : amount, isIncome: isIncome}]);
    }
    setAmount(0);
    setTransaction("");

  }

  const DeleteHistory = (index) => {
    if(history[index].isIncome) {
      setBalance(balance - history[index].amount);
      setIncome(income - history[index].amount);
    } else {
      setBalance(balance + history[index].amount);
      setExpense(expense - history[index].amount);
    }
    history.splice(index, 1);
    setHistory([...history]);
  }

  useEffect(()=>{
    if(history.length != 0) localStorage.setItem("history", JSON.stringify(history));
    if(balance != 0) localStorage.setItem("balance", balance);
    if(income != 0) localStorage.setItem("income", income);
    if(expense != 0) localStorage.setItem("expense", expense);
  },[history]);
  
  return (
    <div className='w-full h-max flex justify-center items-start py-25 bg-[#DAF1DE] '>
      <div className='md:w-[400px] w-[350px]  h-max p-5 border space-y-4 rounded bg-white'>
          <h1 className='text-4xl font-bold text-center text-[#235347]'>Expence Tracker</h1>
          <div className='h-[2px] rounded-[25%] bg-amber-700' />

          <div>
            <p className='text-2xl font-semibold text-[#8EB69B]'> Your Balance</p>
            <p className='text-4xl font-bold text-gray-800'>₹{balance.toFixed(2)}</p>
          </div>
          
          <div className='w-full flex h-25 p-5 justify-center items-center rounded shadow-sm shadow-gray-400'>
            <div className='w-[50%] h-full text-center border-r-1 border-gray-400'>
              <h2 className='text-xl font-semibold'>INCOME</h2>
              <h2 className='text-xl font-medium text-green-400'>₹{income.toFixed(2)}</h2>
            </div>
            <div className='w-[50%] h-full text-center '>
              <h2 className='text-xl font-semibold'>EXPENCE</h2>
              <h2 className='text-xl font-medium text-red-400'>₹{expense.toFixed(2)}</h2>
            </div>
          </div>

          <div className='space-y-4'>
            <h2 className='text-xl font-medium'>ADD TRANSACTION</h2>
            <div className='space-y-2'>
              <input className='rounded border border-blue-500 p-2 w-full focus:outline-none focus:border-2' type="text" value={transaction} placeholder='Enter transaction description' onChange={(e) => setTransaction(e.target.value)}/>
              <input className='rounded border border-blue-500 p-2 w-full focus:outline-none focus:border-2' type="number" value={amount} placeholder='Enter amount' onChange={(e) => setAmount(parseFloat(e.target.value))}/>
            </div>

            <div className='flex space-x-4'>
              <button className={`cursor-pointer rounded text-green-800 p-2 w-full ${isIncome ? 'border-2 font-semibold bg-green-400/40' : 'border font-normal bg-green-400/30'}`} onClick={() => setIsIncome(true)}>Income</button>
              <button className={`cursor-pointer rounded text-red-800 p-2 w-full ${isIncome ? 'border font-normal bg-red-400/30' : 'border-2 font-semibold bg-red-400/40'}`} onClick={() => setIsIncome(false)}>Expense</button>
            </div>
            <button className='bg-[#81bfef] hover:bg-[#5b9fd3] rounded text-white p-2 w-full cursor-pointer' onClick={AddHistory}>Add Transaction</button>
          </div>

          <div>
            <button className='bg-[#ef4281] hover:bg-[#da2869] cursor-pointer rounded text-white p-2 w-full mb-4' onClick={() => setShowHistory(!showHistory)}>Show History</button>
            <div className='flex flex-col w-full space-y-2'>
              {showHistory && history.map((item , index) => (
                <div key={index} className={`w-full flex p-2 border rounded justify-between border-l-5 ${item.isIncome ? 'border-green-400' : 'border-red-400'}`}>
                  <div className='flex gap-5 w-[90%] justify-between'>
                    <p className='font-semibold truncate overflow-hidden whitespace-nowrap'>{item.name}</p>
                    <p className='whitespace-nowrap'>{item.isIncome ? "+" : "-"}{item.amount}</p>
                  </div>
                  <button onClick={() => DeleteHistory(index)} className=' text-xl text-red-500 hover:text-red-600 cursor-pointer flex-shrink-0'><FaDeleteLeft/></button>
                  
                </div>
              ))}
            </div>
          </div>
      </div>
    </div>
  )
}

export default App