import React from 'react'

const ScoreBoard = ({score}) => {
  return (
    <div className='w-[300px] justify-between flex'>
      <div className='text-lg text-[#38BDF8] font-medium'>You(X) : {score.X}</div>
      <div className='text-lg text-[#F472B6] font-medium'>AI(O) : {score.O}</div>
    </div>
  )
}

export default ScoreBoard